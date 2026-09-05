import type { Pool, PoolClient } from "pg";

import { withTransaction } from "@/platform/db/transaction";

export async function claimOutboxBatch(pool: Pool, limit = 20) {
  return withTransaction(pool, async (client) => {
    const result = await client.query(
      `WITH claimable AS (
         SELECT id FROM outbox_events
         WHERE status = 'PENDING' AND available_at <= now()
         ORDER BY created_at
         FOR UPDATE SKIP LOCKED
         LIMIT $1
       )
       UPDATE outbox_events event
       SET status = 'PROCESSING', claimed_at = now(), attempt_count = event.attempt_count + 1
       FROM claimable
       WHERE event.id = claimable.id
       RETURNING event.*`,
      [limit],
    );
    return result.rows;
  });
}

export async function markOutboxPublished(pool: Pool, eventId: string) {
  await pool.query(
    "UPDATE outbox_events SET status = 'PUBLISHED', published_at = now(), last_error = NULL WHERE id = $1 AND status = 'PROCESSING'",
    [eventId],
  );
}

export async function markOutboxFailed(pool: Pool, eventId: string, message: string, maxAttempts = 8) {
  await pool.query(
    `UPDATE outbox_events
     SET status = CASE WHEN attempt_count >= $3 THEN 'DEAD_LETTER' ELSE 'PENDING' END,
         available_at = CASE WHEN attempt_count >= $3 THEN available_at ELSE now() + interval '30 seconds' END,
         claimed_at = NULL,
         last_error = left($2, 2000)
     WHERE id = $1 AND status = 'PROCESSING'`,
    [eventId, message, maxAttempts],
  );
}

export async function consumeOnce(
  pool: Pool,
  consumerName: string,
  eventId: string,
  effect: (client: PoolClient) => Promise<void>,
): Promise<boolean> {
  return withTransaction(pool, async (client) => {
    const receipt = await client.query(
      `INSERT INTO consumer_receipts (consumer_name, event_id)
       VALUES ($1, $2)
       ON CONFLICT (consumer_name, event_id) DO NOTHING
       RETURNING event_id`,
      [consumerName, eventId],
    );
    if (receipt.rowCount !== 1) return false;
    await effect(client);
    return true;
  });
}
