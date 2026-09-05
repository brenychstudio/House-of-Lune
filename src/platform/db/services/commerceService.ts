import { Pool, type PoolClient } from "pg";

import {
  claimIdempotency,
  completeIdempotency,
  type IdempotencyResponse,
} from "@/platform/db/repositories/idempotencyRepository";
import {
  appendOutboxEvent,
  createOrder,
  type CreateOrderInput,
} from "@/platform/db/repositories/orderRepository";
import { withTransaction } from "@/platform/db/transaction";

export class IdempotencyConflictError extends Error {
  constructor() {
    super("Idempotency key was already used for a different request");
    this.name = "IdempotencyConflictError";
  }
}

async function persistOrderAndEvent(client: PoolClient, input: CreateOrderInput) {
  const order = await createOrder(client, input);
  const outbox = await appendOutboxEvent(client, {
    eventType: "order.created",
    aggregateType: "order",
    aggregateId: order.orderId,
    correlationId: input.correlationId,
    schemaVersion: 1,
    payload: { orderId: order.orderId, orderItemId: order.orderItemId },
  });
  return { ...order, outboxEventId: outbox.id } as const;
}

export function createOrderWithOutbox(
  database: Pool,
  input: CreateOrderInput,
): ReturnType<typeof persistOrderAndEvent>;
export function createOrderWithOutbox(
  database: PoolClient,
  input: CreateOrderInput,
): ReturnType<typeof persistOrderAndEvent>;
export function createOrderWithOutbox(database: Pool | PoolClient, input: CreateOrderInput) {
  return database instanceof Pool
    ? withTransaction(database, (client) => persistOrderAndEvent(client, input))
    : persistOrderAndEvent(database, input);
}

export async function executeIdempotent(
  pool: Pool,
  command: Readonly<{ scope: string; key: string; fingerprint: string; expiresAt: Date }>,
  handler: (client: PoolClient) => Promise<IdempotencyResponse>,
) {
  return withTransaction(pool, async (client) => {
    const claim = await claimIdempotency(client, command);
    if (claim.kind === "CONFLICT") throw new IdempotencyConflictError();
    if (claim.kind === "REPLAY") return { ...claim.response, replayed: true } as const;

    const response = await handler(client);
    await completeIdempotency(client, { scope: command.scope, key: command.key, response });
    return { ...response, replayed: false } as const;
  });
}
