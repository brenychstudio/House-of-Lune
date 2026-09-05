import type { PoolClient } from "pg";

import type { OrderSnapshot } from "@/modules/orders/domain";
import type { Currency, Market } from "@/modules/shared/valueObjects";

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
