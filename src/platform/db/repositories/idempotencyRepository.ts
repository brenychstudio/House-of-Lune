import type { PoolClient } from "pg";

export type IdempotencyResponse = Readonly<{
  status: number;
  body: Readonly<Record<string, unknown>>;
  resourceId: string | null;
}>;

export type IdempotencyClaim =
  | Readonly<{ kind: "CLAIMED" }>
  | Readonly<{ kind: "REPLAY"; response: IdempotencyResponse }>
  | Readonly<{ kind: "CONFLICT" }>;

export async function claimIdempotency(
  client: PoolClient,
  input: Readonly<{ scope: string; key: string; fingerprint: string; expiresAt: Date }>,
): Promise<IdempotencyClaim> {
  const inserted = await client.query(
    `INSERT INTO idempotency_records (scope, idempotency_key, request_fingerprint, expires_at)
     VALUES ($1,$2,$3,$4)
     ON CONFLICT (scope, idempotency_key) DO NOTHING
     RETURNING scope`,
    [input.scope, input.key, input.fingerprint, input.expiresAt],
  );
  if (inserted.rowCount === 1) return { kind: "CLAIMED" };

  const current = await client.query<{
    request_fingerprint: string;
    state: string;
    response_status: number | null;
    response_body: Record<string, unknown> | null;
    resource_id: string | null;
    expires_at: Date;
  }>(
    `SELECT request_fingerprint, state, response_status, response_body, resource_id, expires_at
     FROM idempotency_records
     WHERE scope = $1 AND idempotency_key = $2
     FOR UPDATE`,
    [input.scope, input.key],
  );
  const row = current.rows[0]!;
  if (row.request_fingerprint.trim() !== input.fingerprint) return { kind: "CONFLICT" };
  if (row.state === "COMPLETED" && row.response_status !== null && row.response_body !== null) {
    return {
      kind: "REPLAY",
      response: { status: row.response_status, body: row.response_body, resourceId: row.resource_id },
    };
  }
  if (row.expires_at.getTime() <= Date.now()) {
    await client.query(
      `UPDATE idempotency_records
       SET state = 'PROCESSING', response_status = NULL, response_body = NULL, resource_id = NULL, expires_at = $3
       WHERE scope = $1 AND idempotency_key = $2`,
      [input.scope, input.key, input.expiresAt],
    );
    return { kind: "CLAIMED" };
  }
  throw new Error("Idempotent command is already processing");
}

export async function completeIdempotency(
  client: PoolClient,
  input: Readonly<{ scope: string; key: string; response: IdempotencyResponse }>,
) {
  await client.query(
    `UPDATE idempotency_records
     SET state = 'COMPLETED', response_status = $3, response_body = $4, resource_id = $5
     WHERE scope = $1 AND idempotency_key = $2 AND state = 'PROCESSING'`,
    [input.scope, input.key, input.response.status, input.response.body, input.response.resourceId],
  );
}
