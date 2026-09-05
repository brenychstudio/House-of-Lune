import type { PoolClient } from "pg";

import { transitionProduction } from "@/modules/production/domain";
import type { ProductionState } from "@/modules/production/domain";

export async function appendProductionEvent(
  client: PoolClient,
  input: Readonly<{
    productionOrderId: string;
    eventType: string;
    fromState: ProductionState;
    toState: ProductionState;
    actorId: string;
    correlationId: string;
    details?: Readonly<Record<string, unknown>>;
  }>,
) {
  const transition = transitionProduction(input.fromState, input.toState);
  if (!transition.ok) throw new Error(transition.error.message);

  const updated = await client.query(
    "UPDATE production_orders SET state = $2, updated_at = now() WHERE id = $1 AND state = $3 RETURNING id",
    [input.productionOrderId, input.toState, input.fromState],
  );
  if (updated.rowCount !== 1) throw new Error("Production order state changed concurrently");

  const event = await client.query<{ id: string }>(
    `INSERT INTO production_events (
       production_order_id, event_type, from_state, to_state, actor_id, correlation_id, details
     ) VALUES ($1,$2,$3,$4,$5,$6,$7)
     RETURNING id`,
    [
      input.productionOrderId,
      input.eventType,
      input.fromState,
      input.toState,
      input.actorId,
      input.correlationId,
      input.details ?? {},
    ],
  );
  return event.rows[0]!;
}
