import type { Pool, PoolClient } from "pg";
import { validateCommercialProfile, validateVariantConfiguration, type CommercialProfile, type VariantConfiguration } from "@/modules/catalog/commercial";
import { appendAudit } from "@/platform/db/repositories/auditRepository";
import { withTransaction } from "@/platform/db/transaction";

export type CommandActor = Readonly<{ actorId: string; correlationId: string }>;
export type ProductRecord = CommercialProfile & { id: string; slug: string; name: string };
export type VariantRecord = VariantConfiguration & { id: string; productId: string; sku: string; active: boolean; editionSize: number | null };
const productColumns = 'id, slug, name, status, scarcity_mode AS "scarcityMode", acquisition_mode AS "acquisitionMode"';
const variantColumns = 'id, product_id AS "productId", sku, finish AS "finishName", finish_code AS "finishCode", fulfillment_mode AS "fulfillmentMode", active, lead_time_min_days AS "leadTimeMinDays", lead_time_max_days AS "leadTimeMaxDays", edition_size AS "editionSize"';

// Internal command boundary. A future authenticated adapter must supply its verified actor.
// No command in this service is exposed as a public route or Server Action.
export class CatalogService {
  constructor(private readonly pool: Pool, private readonly actor: CommandActor) {
    if (!actor.actorId.trim() || !actor.correlationId.trim()) throw new Error("Command actor and correlation required");
  }

  private async audit(client: PoolClient, action: string, type: string, id: string, before: Record<string, unknown> | undefined, after: Record<string, unknown>) {
    await appendAudit(client, { ...this.actor, actorType: "STAFF", action, resourceType: type, resourceId: id,
      result: "SUCCEEDED", ...(before ? { beforeState: before } : {}), afterState: after });
  }

  createProduct(input: { slug: string; name: string }) {
    return withTransaction(this.pool, async (client) => {
      const row = (await client.query<ProductRecord>(`INSERT INTO products(slug,name) VALUES($1,$2) RETURNING ${productColumns}`, [input.slug, input.name])).rows[0]!;
      await this.audit(client, "catalog.product.created", "product", row.id, undefined, row);
      return row;
    });
  }

  async updateProduct(id: string, input: CommercialProfile & { name: string }) {
    validateCommercialProfile(input);
    return withTransaction(this.pool, async (client) => {
      const before = (await client.query<ProductRecord>(`SELECT ${productColumns} FROM products WHERE id=$1 FOR UPDATE`, [id])).rows[0];
      if (!before) throw new Error("Product not found");
      if (input.status !== "ACTIVE") await client.query("UPDATE variants SET active=false WHERE product_id=$1 AND active", [id]);
      const row = (await client.query<ProductRecord>(`UPDATE products SET name=$2,status=$3,scarcity_mode=$4,acquisition_mode=$5 WHERE id=$1 RETURNING ${productColumns}`,
        [id, input.name, input.status, input.scarcityMode, input.acquisitionMode])).rows[0]!;
      await this.audit(client, "catalog.product.updated", "product", id, before, row);
      return row;
    });
  }

  archiveProduct(id: string) {
    return withTransaction(this.pool, async (client) => {
      const before = (await client.query<ProductRecord>(`SELECT ${productColumns} FROM products WHERE id=$1 FOR UPDATE`, [id])).rows[0];
      if (!before) throw new Error("Product not found");
      await client.query("UPDATE variants SET active=false WHERE product_id=$1 AND active", [id]);
      const row = (await client.query<ProductRecord>(`UPDATE products SET status='ARCHIVED',acquisition_mode='NOT_FOR_SALE' WHERE id=$1 RETURNING ${productColumns}`, [id])).rows[0]!;
      await this.audit(client, "catalog.product.archived", "product", id, before, row);
      return row;
    });
  }

  async createVariant(input: VariantConfiguration & { productId: string; sku: string }) {
    validateVariantConfiguration(input);
    return withTransaction(this.pool, async (client) => {
      const row = (await client.query<VariantRecord>(`INSERT INTO variants(product_id,sku,finish,finish_code,fulfillment_mode,lead_time_min_days,lead_time_max_days)
        VALUES($1,$2,$3,$4,$5,$6,$7) RETURNING ${variantColumns}`,
        [input.productId, input.sku, input.finishName, input.finishCode, input.fulfillmentMode, input.leadTimeMinDays, input.leadTimeMaxDays])).rows[0]!;
      await this.audit(client, "catalog.variant.created", "variant", row.id, undefined, row);
      return row;
    });
  }

  private async lockVariant(client: PoolClient, id: string) {
    const identity = (await client.query<{ product_id: string }>("SELECT product_id FROM variants WHERE id=$1", [id])).rows[0];
    if (!identity) throw new Error("Variant not found");
    await client.query("SELECT id FROM products WHERE id=$1 FOR UPDATE", [identity.product_id]);
    return (await client.query<VariantRecord>(`SELECT ${variantColumns} FROM variants WHERE id=$1 FOR UPDATE`, [id])).rows[0]!;
  }

  updateVariant(id: string, input: Omit<VariantConfiguration, "finishCode">) {
    return withTransaction(this.pool, async (client) => {
      const before = await this.lockVariant(client, id);
      validateVariantConfiguration({ ...input, finishCode: before.finishCode });
      const row = (await client.query<VariantRecord>(`UPDATE variants SET finish=$2,fulfillment_mode=$3,lead_time_min_days=$4,lead_time_max_days=$5
        WHERE id=$1 RETURNING ${variantColumns}`, [id, input.finishName, input.fulfillmentMode, input.leadTimeMinDays, input.leadTimeMaxDays])).rows[0]!;
      await this.audit(client, "catalog.variant.updated", "variant", id, before, row);
      return row;
    });
  }

  setVariantActive(id: string, active: boolean) {
    return withTransaction(this.pool, async (client) => {
      const before = await this.lockVariant(client, id);
      const row = (await client.query<VariantRecord>(`UPDATE variants SET active=$2 WHERE id=$1 RETURNING ${variantColumns}`, [id, active])).rows[0]!;
      await this.audit(client, active ? "catalog.variant.activated" : "catalog.variant.deactivated", "variant", id, before, row);
      return row;
    });
  }

  async defineEdition(variantId: string, size: number) {
    if (!Number.isSafeInteger(size) || size < 1 || size > 2147483647) throw new Error("Invalid edition size");
    return withTransaction(this.pool, async (client) => {
      const before = await this.lockVariant(client, variantId);
      await client.query("UPDATE variants SET edition_size=$2 WHERE id=$1", [variantId, size]);
      await client.query(`INSERT INTO editions(variant_id,edition_number,edition_size)
        SELECT $1,n,$2 FROM generate_series(1,$2::integer) n
        WHERE NOT EXISTS (SELECT 1 FROM editions WHERE variant_id=$1 AND edition_number=n)
        ON CONFLICT(variant_id,edition_number) DO NOTHING`, [variantId, size]);
      await this.audit(client, "catalog.edition.defined", "variant", variantId, before, { editionSize: size });
    });
  }
}
