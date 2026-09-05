import { randomUUID } from "node:crypto";

import type { PoolClient } from "pg";
import { describe, expect, it } from "vitest";
import { isolatedPostgres } from "../helpers/postgres";

import { buildOrderSnapshot } from "@/modules/orders/domain";
import { createMoney } from "@/modules/shared/valueObjects";
import { appendAudit } from "@/platform/db/repositories/auditRepository";
import { createProduct, createVariant } from "@/platform/db/repositories/catalogRepository";
import { appendOutboxEvent } from "@/platform/db/repositories/orderRepository";
import {
  activatePriceBook,
  createPriceBook,
  setVariantPrice,
} from "@/platform/db/repositories/pricingRepository";
import {
  IdempotencyConflictError,
  createOrderWithOutbox,
  executeIdempotent,
} from "@/platform/db/services/commerceService";
import { withTransaction } from "@/platform/db/transaction";
import { claimOutboxBatch, consumeOnce, markOutboxFailed } from "@/platform/events/outboxWorker";

const { pool } = isolatedPostgres();

function money(minorUnits: bigint) {
  const result = createMoney(minorUnits, "EUR");
  if (!result.ok) throw new Error(result.error.message);
  return result.value;
}

async function catalog(client: PoolClient) {
  const token = randomUUID().replaceAll("-", "").slice(0, 12).toUpperCase();
  const product = await createProduct(client, { slug: `object-${token.toLowerCase()}`, name: "Test Object" });
  const variant = await createVariant(client, {
    productId: product.id,
    sku: `BR-${token}-01`,
    finish: "Test finish",
    fulfillmentMode: "MADE_TO_ORDER",
  });
  return { product, variant, token };
}

function snapshot(productId: string, variantId: string, sku: string) {
  const result = buildOrderSnapshot({
    productId,
    productName: "Test Object",
    variantId,
    sku,
    finish: "Test finish",
    editionNumber: null,
    unitPrice: money(10000n),
    quantity: 1,
    tax: money(2100n),
    duties: money(0n),
    shipping: money(500n),
    discount: money(0n),
    priceBookRevision: "eu-test-01",
    designRevisionId: "test-r1",
  });
  if (!result.ok) throw new Error(result.error.message);
  return result.value;
}


describe("transactional commerce services", () => {
  it("creates catalog and activates one market-specific price book", async () => {
    await withTransaction(pool, async (client) => {
      const { variant, token } = await catalog(client);
      const priceBook = await createPriceBook(client, {
        market: "EU",
        currency: "EUR",
        revision: `eu-${token.toLowerCase()}`,
        effectiveFrom: new Date(),
      });
      await setVariantPrice(client, { priceBookId: priceBook.id, variantId: variant.id, unitPriceMinor: 89000n });
      await activatePriceBook(client, priceBook.id);

      const active = await client.query(
        "SELECT pb.state, pbe.unit_price_minor FROM price_books pb JOIN price_book_entries pbe ON pbe.price_book_id = pb.id WHERE pb.id = $1",
        [priceBook.id],
      );
      expect(active.rows[0]).toMatchObject({ state: "PUBLISHED", unit_price_minor: "89000" });
    });
  });

  it("persists an immutable order fact and its outbox event atomically", async () => {
    const fixture = await withTransaction(pool, catalog);
    const correlationId = `corr-${randomUUID()}`;
    const result = await createOrderWithOutbox(pool, {
      guestEmail: "collector@example.com",
      market: "EU",
      currency: "EUR",
      snapshot: snapshot(fixture.product.id, fixture.variant.id, fixture.variant.sku),
      correlationId,
    });

    const stored = await pool.query(
      "SELECT o.id, oi.snapshot, oe.correlation_id FROM orders o JOIN order_items oi ON oi.order_id = o.id JOIN outbox_events oe ON oe.aggregate_id = o.id WHERE o.id = $1",
      [result.orderId],
    );
    expect(stored.rowCount).toBe(1);
    expect(stored.rows[0].snapshot.productName).toBe("Test Object");
    expect(stored.rows[0].correlation_id).toBe(correlationId);
  });

  it("rolls back both business state and outbox on transaction failure", async () => {
    const fixture = await withTransaction(pool, catalog);
    const correlationId = `rollback-${randomUUID()}`;

    await expect(
      withTransaction(pool, async (client) => {
        const order = await createOrderWithOutbox(client, {
          guestEmail: "rollback@example.com",
          market: "EU",
          currency: "EUR",
          snapshot: snapshot(fixture.product.id, fixture.variant.id, fixture.variant.sku),
          correlationId,
        });
        await appendOutboxEvent(client, {
          eventType: "test.rollback",
          aggregateType: "order",
          aggregateId: order.orderId,
          correlationId,
          payload: {},
        });
        throw new Error("forced rollback");
      }),
    ).rejects.toThrow("forced rollback");

    expect((await pool.query("SELECT 1 FROM orders WHERE guest_email = 'rollback@example.com'")).rowCount).toBe(0);
    expect((await pool.query("SELECT 1 FROM outbox_events WHERE correlation_id = $1", [correlationId])).rowCount).toBe(0);
  });

  it("replays the stored idempotent response and conflicts on changed input", async () => {
    const key = `checkout-${randomUUID()}`;
    let executions = 0;
    const command = {
      scope: "checkout",
      key,
      fingerprint: "a".repeat(64),
      expiresAt: new Date(Date.now() + 60_000),
    };
    const handler = async () => {
      executions += 1;
      return { status: 201, body: { receipt: "stable" }, resourceId: null };
    };

    const first = await executeIdempotent(pool, command, handler);
    const replay = await executeIdempotent(pool, command, handler);
    expect(first).toMatchObject({ replayed: false, body: { receipt: "stable" } });
    expect(replay).toMatchObject({ replayed: true, body: { receipt: "stable" } });
    expect(executions).toBe(1);

    await expect(
      executeIdempotent(pool, { ...command, fingerprint: "b".repeat(64) }, handler),
    ).rejects.toBeInstanceOf(IdempotencyConflictError);
  });

  it("records one durable consumer effect receipt across repeated delivery", async () => {
    const aggregateId = randomUUID();
    const outbox = await withTransaction(pool, (client) => appendOutboxEvent(client, {
      eventType: "test.delivery",
      aggregateType: "test",
      aggregateId,
      correlationId: `corr-${aggregateId}`,
      payload: { aggregateId },
    }));
    const claimed = await claimOutboxBatch(pool, 100);
    expect(claimed.map(({ id }) => id)).toContain(outbox.id);
    await markOutboxFailed(pool, outbox.id, "expected test failure", 1);
    expect((await pool.query("SELECT status, last_error FROM outbox_events WHERE id = $1", [outbox.id])).rows[0]).toMatchObject({
      status: "DEAD_LETTER",
      last_error: "expected test failure",
    });

    const eventId = outbox.id;
    let executions = 0;
    const effect = async (client: PoolClient) => {
      executions += 1;
      await appendAudit(client, {
        id: eventId,
        actorType: "SYSTEM",
        actorId: "outbox-consumer",
        action: "test.effect",
        resourceType: "event",
        resourceId: eventId,
        correlationId: `corr-${eventId}`,
        result: "SUCCEEDED",
      });
    };

    expect(await consumeOnce(pool, "test-consumer", eventId, effect)).toBe(true);
    expect(await consumeOnce(pool, "test-consumer", eventId, effect)).toBe(false);
    expect(executions).toBe(1);
    expect((await pool.query("SELECT 1 FROM consumer_receipts WHERE consumer_name = 'test-consumer' AND event_id = $1", [eventId])).rowCount).toBe(1);
  });
});
