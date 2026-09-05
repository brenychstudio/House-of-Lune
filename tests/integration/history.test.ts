import { randomUUID } from "node:crypto";

import { Pool } from "pg";
import { afterAll, describe, expect, it } from "vitest";

import { createProduct, createVariant, issuePhysicalInstance } from "@/platform/db/repositories/catalogRepository";
import { appendProductionEvent } from "@/platform/db/repositories/productionRepository";
import { withTransaction } from "@/platform/db/transaction";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL ?? "postgresql://postgres@127.0.0.1:54329/brenych_test",
});

async function orderItemFixture() {
  return withTransaction(pool, async (client) => {
    const token = randomUUID().replaceAll("-", "").slice(0, 10).toUpperCase();
    const product = await createProduct(client, { slug: `order-history-${token.toLowerCase()}`, name: "History" });
    const variant = await createVariant(client, {
      productId: product.id,
      sku: `BR-${token}-OH`,
      finish: "Archive",
      fulfillmentMode: "MADE_TO_ORDER",
    });
    const order = await client.query<{ id: string }>(
      `INSERT INTO orders (
         guest_email, market, currency, subtotal_minor, tax_minor, duties_minor,
         shipping_minor, discount_minor, total_minor, price_book_revision
       ) VALUES ($1, 'EU', 'EUR', 100, 21, 0, 0, 0, 121, 'history-r1')
       RETURNING id`,
      [`history-${token.toLowerCase()}@example.com`],
    );
    const item = await client.query<{ id: string }>(
      `INSERT INTO order_items (order_id, product_id, variant_id, quantity, unit_price_minor, snapshot)
       VALUES ($1,$2,$3,1,100,$4)
       RETURNING id`,
      [order.rows[0]!.id, product.id, variant.id, { productName: "History", revision: "r1" }],
    );
    return { productId: product.id, variantId: variant.id, orderItemId: item.rows[0]!.id };
  });
}

afterAll(async () => pool.end());

describe("immutable commercial and operational history", () => {
  it("issues one permanent physical identity with exact revisions", async () => {
    const identity = `BR-H${randomUUID().replaceAll("-", "").slice(0, 8).toUpperCase()}-AA-001`;
    const instance = await withTransaction(pool, async (client) => {
      const token = randomUUID().replaceAll("-", "").slice(0, 10).toUpperCase();
      const product = await createProduct(client, { slug: `history-${token.toLowerCase()}`, name: "History" });
      const variant = await createVariant(client, {
        productId: product.id,
        sku: `BR-${token}-H1`,
        finish: "Archive",
        fulfillmentMode: "IN_STOCK",
      });
      return issuePhysicalInstance(client, {
        variantId: variant.id,
        editionId: null,
        identityCode: identity,
        designRevisionId: "design-r1",
        finishRevisionId: "finish-r1",
        fitRevisionId: "fit-r1",
      });
    });
    expect(instance.identityCode).toBe(identity);
  });

  it("rejects mutation and deletion of order snapshots", async () => {
    const fixture = await orderItemFixture();
    await expect(pool.query("UPDATE order_items SET snapshot = '{}'::jsonb WHERE id = $1", [fixture.orderItemId])).rejects.toMatchObject({ code: "55000" });
    await expect(pool.query("DELETE FROM order_items WHERE id = $1", [fixture.orderItemId])).rejects.toMatchObject({ code: "55000" });
  });

  it("appends production corrections and rejects event rewriting", async () => {
    const fixture = await orderItemFixture();
    const production = await pool.query<{ id: string }>(
      `WITH recipe AS (
         INSERT INTO production_recipes (product_family, revision, stages, lead_time_days)
         VALUES ($1, 'r1', '["QUALITY_CONTROL","RETURNED_TO_FINISHING","FINISHING"]'::jsonb, 7)
         RETURNING id
       )
       INSERT INTO production_orders (order_item_id, recipe_id, state)
       SELECT $2, id, 'QUALITY_CONTROL' FROM recipe
       RETURNING id`,
      [`history-${randomUUID()}`, fixture.orderItemId],
    );
    const event = await withTransaction(pool, (client) => appendProductionEvent(client, {
      productionOrderId: production.rows[0]!.id,
      fromState: "QUALITY_CONTROL",
      toState: "RETURNED_TO_FINISHING",
      eventType: "QC_FAILED",
      actorId: "qc-test",
      correlationId: `corr-${randomUUID()}`,
      details: { reason: "surface" },
    }));
    await expect(pool.query("UPDATE production_events SET event_type = 'REWRITTEN' WHERE id = $1", [event.id])).rejects.toMatchObject({ code: "55000" });
  });

  it("keeps audit history append-only and commercial references restrictive", async () => {
    const fixture = await orderItemFixture();
    const audit = await pool.query<{ id: string }>(
      "INSERT INTO audit_log (actor_type, actor_id, action, resource_type, resource_id, correlation_id, result) VALUES ('SYSTEM','test','verify','order',$1,$2,'SUCCEEDED') RETURNING id",
      [randomUUID(), `corr-${randomUUID()}`],
    );
    await expect(pool.query("DELETE FROM audit_log WHERE id = $1", [audit.rows[0]!.id])).rejects.toMatchObject({ code: "55000" });

    await expect(pool.query("DELETE FROM products WHERE id = $1", [fixture.productId])).rejects.toMatchObject({ code: "23503" });
  });
});
