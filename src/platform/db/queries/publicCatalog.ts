import type { Pool, PoolClient } from "pg";
import type { Market } from "@/modules/shared/valueObjects";
import type { PublicObject, PublicVariant } from "@/modules/catalog/readModel";
import { deriveAvailability } from "@/modules/catalog/availability";
import type { ProductRecord, VariantRecord } from "@/platform/db/services/catalogService";
import { resolveVariantPrice } from "@/platform/db/repositories/pricingRepository";
import { withTransaction } from "@/platform/db/transaction";

export type CatalogQueryContext = Readonly<{ market: Market; at: Date }>;
const columns = 'id,slug,name,status,scarcity_mode AS "scarcityMode",acquisition_mode AS "acquisitionMode"';

async function project(client: PoolClient, product: ProductRecord, context: CatalogQueryContext): Promise<PublicObject> {
  const rows = await client.query<VariantRecord & { inventoryAvailable: number; capacityAvailable: number; editionAvailable: number }>(
    `SELECT v.id,v.product_id AS "productId",v.sku,v.finish AS "finishName",v.finish_code AS "finishCode",
      v.fulfillment_mode AS "fulfillmentMode",v.active,v.edition_size AS "editionSize",
      v.lead_time_min_days AS "leadTimeMinDays",v.lead_time_max_days AS "leadTimeMaxDays",
      COALESCE(i.on_hand-i.reserved,0) AS "inventoryAvailable",
      (SELECT COALESCE(sum(c.total_units-c.reserved_units),0)::integer FROM capacity_windows c
        WHERE c.variant_id=v.id AND c.ends_at>$2 AND c.ends_at<=$2::timestamptz + v.lead_time_max_days * interval '1 day') AS "capacityAvailable",
      (SELECT count(*)::integer FROM editions e WHERE e.variant_id=v.id AND
        (e.state='AVAILABLE' OR (e.state='RESERVED' AND e.reserved_until<=$2))) AS "editionAvailable"
      FROM variants v LEFT JOIN inventory_items i ON i.variant_id=v.id
      WHERE v.product_id=$1 AND v.active AND v.finish_code IS NOT NULL ORDER BY v.id`,
    [product.id, context.at]);
  const variants: PublicVariant[] = [];
  for (const v of rows.rows) {
    const resolution = product.acquisitionMode === "PURCHASABLE" && v.fulfillmentMode !== "BESPOKE"
      ? await resolveVariantPrice(client, { variantId: v.id, ...context }) : { kind: "NO_PRICE" as const };
    const price = resolution.kind === "PRICE" ? resolution.price : null;
    const availability = deriveAvailability({ ...product, ...v, variantActive: v.active, hasPrice: price !== null });
    variants.push({
      variantId: v.id, finishCode: v.finishCode, finishName: v.finishName, fulfillmentMode: v.fulfillmentMode,
      price, availability,
      madeToOrder: availability === "MADE_TO_ORDER" && v.leadTimeMinDays !== null && v.leadTimeMaxDays !== null
        ? { minDays: v.leadTimeMinDays, maxDays: v.leadTimeMaxDays } : null,
      edition: product.acquisitionMode !== "NOT_FOR_SALE" && v.editionSize !== null
        ? { size: v.editionSize, remaining: v.editionAvailable } : null,
    });
  }
  const availability = product.acquisitionMode === "NOT_FOR_SALE" ? "NOT_FOR_SALE"
    : product.acquisitionMode === "INQUIRY_ONLY" ? "INQUIRY"
    : variants.find(v => v.availability === "IN_STOCK" || v.availability === "MADE_TO_ORDER" || v.availability === "INQUIRY")?.availability
      ?? (variants.length > 0 && variants.every(v => v.availability === "SOLD_OUT") ? "SOLD_OUT" : "UNAVAILABLE");
  return { productId: product.id, productSlug: product.slug, name: product.name, status: product.status,
    scarcityMode: product.scarcityMode, acquisitionMode: product.acquisitionMode, availability, variants };
}

async function snapshot<T>(pool: Pool, work: (client: PoolClient) => Promise<T>) {
  return withTransaction(pool, async client => {
    await client.query("SET TRANSACTION ISOLATION LEVEL REPEATABLE READ, READ ONLY");
    return work(client);
  });
}

export async function getPublicObjectBySlug(pool: Pool, slug: string, context: CatalogQueryContext): Promise<PublicObject | null> {
  return snapshot(pool, async client => {
    const p = (await client.query<ProductRecord>(`SELECT ${columns} FROM products WHERE slug=$1 AND status='ACTIVE'`, [slug])).rows[0];
    return p ? project(client, p, context) : null;
  });
}

export async function listPublicObjects(pool: Pool, context: CatalogQueryContext): Promise<PublicObject[]> {
  return snapshot(pool, async client => {
    const products = (await client.query<ProductRecord>(`SELECT ${columns} FROM products WHERE status='ACTIVE' ORDER BY slug`)).rows;
    const objects: PublicObject[] = [];
    for (const product of products) objects.push(await project(client, product, context));
    return objects;
  });
}

// Explicit local-only identity projection, never a public "includeDrafts" option.
// No draft variant, finish, price, edition, capacity or promise can escape.
export async function getDevelopmentObjectBySlug(pool: Pool, slug: string, environment: string): Promise<PublicObject | null> {
  if (environment !== "development" || slug !== "mask-01") return null;
  const p = (await pool.query<ProductRecord>(`SELECT ${columns} FROM products
    WHERE slug=$1 AND status='DRAFT' AND scarcity_mode='UNDECIDED' AND acquisition_mode='NOT_FOR_SALE'`, [slug])).rows[0];
  return p ? { productId: p.id, productSlug: p.slug, name: p.name, status: p.status,
    scarcityMode: p.scarcityMode, acquisitionMode: p.acquisitionMode, availability: "NOT_FOR_SALE", variants: [] } : null;
}
