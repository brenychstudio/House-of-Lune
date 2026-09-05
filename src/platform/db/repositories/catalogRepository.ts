import type { PoolClient } from "pg";

import type { FulfillmentMode } from "@/modules/catalog/domain";

export async function createProduct(
  client: PoolClient,
  input: Readonly<{ slug: string; name: string }>,
) {
  const result = await client.query<{ id: string; slug: string; name: string }>(
    "INSERT INTO products (slug, name) VALUES ($1, $2) RETURNING id, slug, name",
    [input.slug, input.name],
  );
  return result.rows[0]!;
}

export async function createVariant(
  client: PoolClient,
  input: Readonly<{
    productId: string;
    sku: string;
    finish: string;
    fulfillmentMode: FulfillmentMode;
  }>,
) {
  const result = await client.query<{
    id: string;
    productId: string;
    sku: string;
    finish: string;
    fulfillmentMode: FulfillmentMode;
  }>(
    `INSERT INTO variants (product_id, sku, finish, fulfillment_mode)
     VALUES ($1, $2, $3, $4)
     RETURNING id, product_id AS "productId", sku, finish, fulfillment_mode AS "fulfillmentMode"`,
    [input.productId, input.sku, input.finish, input.fulfillmentMode],
  );
  return result.rows[0]!;
}

export async function issuePhysicalInstance(
  client: PoolClient,
  input: Readonly<{
    variantId: string;
    editionId: string | null;
    identityCode: string;
    designRevisionId: string;
    finishRevisionId: string;
    fitRevisionId: string;
  }>,
) {
  const result = await client.query<{ id: string; identityCode: string }>(
    `INSERT INTO physical_instances (
       variant_id, edition_id, identity_code, design_revision_id, finish_revision_id, fit_revision_id
     ) VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING id, identity_code AS "identityCode"`,
    [
      input.variantId,
      input.editionId,
      input.identityCode,
      input.designRevisionId,
      input.finishRevisionId,
      input.fitRevisionId,
    ],
  );
  return result.rows[0]!;
}
