import type { PoolClient } from "pg";

import type { OrderSnapshot } from "@/modules/orders/domain";
import type { Currency, Market } from "@/modules/shared/valueObjects";

export type OwnedOrder = Readonly<{
  id: string;
  orderNumber: string;
  state: string;
  createdAt: Date;
}>;

export type CreateOrderInput = Readonly<{
  customerId?: string;
  guestEmail?: string;
  market: Market;
  currency: Currency;
  snapshot: OrderSnapshot;
  correlationId: string;
}>;

function jsonSafe(value: unknown): unknown {
  if (typeof value === "bigint") return value.toString(10);
  if (Array.isArray(value)) return value.map(jsonSafe);
  if (value !== null && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([key, entry]) => [key, jsonSafe(entry)]));
  }
  return value;
}

export async function createOrder(client: PoolClient, input: CreateOrderInput) {
  const order = await client.query<{ id: string }>(
    `INSERT INTO orders (
       customer_id, guest_email, market, currency, subtotal_minor, tax_minor, duties_minor,
       shipping_minor, discount_minor, total_minor, price_book_revision
     ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
     RETURNING id`,
    [
      input.customerId ?? null,
      input.guestEmail ?? null,
      input.market,
      input.currency,
      input.snapshot.subtotal.minorUnits.toString(10),
      input.snapshot.tax.minorUnits.toString(10),
      input.snapshot.duties.minorUnits.toString(10),
      input.snapshot.shipping.minorUnits.toString(10),
      input.snapshot.discount.minorUnits.toString(10),
      input.snapshot.total.minorUnits.toString(10),
      input.snapshot.priceBookRevision,
    ],
  );
  const orderId = order.rows[0]!.id;
  const item = await client.query<{ id: string }>(
    `INSERT INTO order_items (
       order_id, product_id, variant_id, edition_id, quantity, unit_price_minor, snapshot
     ) VALUES ($1,$2,$3,NULL,$4,$5,$6)
     RETURNING id`,
    [
      orderId,
      input.snapshot.productId,
      input.snapshot.variantId,
      input.snapshot.quantity,
      input.snapshot.unitPrice.minorUnits.toString(10),
      jsonSafe(input.snapshot),
    ],
  );
  return { orderId, orderItemId: item.rows[0]!.id } as const;
}

export async function appendOutboxEvent(
  client: PoolClient,
  input: Readonly<{
    eventType: string;
    aggregateType: string;
    aggregateId: string;
    correlationId: string;
    causationId?: string;
    schemaVersion?: number;
    payload: Readonly<Record<string, unknown>>;
  }>,
) {
  const result = await client.query<{ id: string }>(
    `INSERT INTO outbox_events (
       event_type, schema_version, aggregate_type, aggregate_id, correlation_id, causation_id, payload
     ) VALUES ($1,$2,$3,$4,$5,$6,$7)
     RETURNING id`,
    [
      input.eventType,
      input.schemaVersion ?? 1,
      input.aggregateType,
      input.aggregateId,
      input.correlationId,
      input.causationId ?? null,
      jsonSafe(input.payload),
    ],
  );
  return result.rows[0]!;
}

export async function getOwnedOrder(pool: import("pg").Pool, customerId: string, orderId: string) {
  const result = await pool.query<{ id: string; order_number: string; state: string; created_at: Date }>(
    `SELECT id,order_number,state,created_at FROM orders WHERE id=$1 AND customer_id=$2`,
    [orderId, customerId],
  );
  const row = result.rows[0];
  return row ? { id: row.id, orderNumber: row.order_number, state: row.state, createdAt: row.created_at } : null;
}

export async function listOwnedOrders(pool: import("pg").Pool, customerId: string) {
  const result = await pool.query<{ id: string; order_number: string; state: string; created_at: Date }>(
    `SELECT id,order_number,state,created_at FROM orders WHERE customer_id=$1 ORDER BY created_at DESC,id`,
    [customerId],
  );
  return result.rows.map((row) => ({
    id: row.id, orderNumber: row.order_number, state: row.state, createdAt: row.created_at,
  }));
}

export async function claimGuestOrder(
  client: PoolClient,
  customerId: string,
  orderId: string,
): Promise<"CLAIMED" | "ALREADY_OWNED" | "VERIFIED_EMAIL_MISMATCH" | "NOT_FOUND"> {
  const claimed = await client.query(
    `UPDATE orders order_record SET customer_id=$1
     WHERE order_record.id=$2 AND order_record.customer_id IS NULL
       AND order_record.guest_email IS NOT NULL
       AND EXISTS (
         SELECT 1 FROM customer_identities identity
         WHERE identity.customer_id=$1
           AND identity.identity_type='VERIFIED_EMAIL'
           AND identity.identity_value=lower(btrim(order_record.guest_email))
       )
     RETURNING order_record.id`,
    [customerId, orderId],
  );
  if (claimed.rowCount === 1) return "CLAIMED";
  const order = await client.query<{ customer_id: string | null }>(
    "SELECT customer_id FROM orders WHERE id=$1 FOR UPDATE", [orderId],
  );
  if (!order.rows[0]) return "NOT_FOUND";
  return order.rows[0].customer_id !== null ? "ALREADY_OWNED" : "VERIFIED_EMAIL_MISMATCH";
}
