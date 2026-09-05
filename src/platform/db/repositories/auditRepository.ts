import type { PoolClient } from "pg";

export async function appendAudit(
  client: PoolClient,
  input: Readonly<{
    id?: string;
    actorType: "CUSTOMER" | "STAFF" | "SYSTEM" | "PROVIDER";
    actorId: string;
    action: string;
    resourceType: string;
    resourceId: string;
    correlationId: string;
    approvalReference?: string;
    result: "SUCCEEDED" | "REJECTED" | "FAILED";
    beforeState?: Readonly<Record<string, unknown>>;
    afterState?: Readonly<Record<string, unknown>>;
  }>,
) {
  const result = await client.query<{ id: string }>(
    `INSERT INTO audit_log (
       id, actor_type, actor_id, action, resource_type, resource_id, correlation_id,
       approval_reference, result, before_state, after_state
     ) VALUES (COALESCE($1, gen_random_uuid()),$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
     RETURNING id`,
    [
      input.id ?? null,
      input.actorType,
      input.actorId,
      input.action,
      input.resourceType,
      input.resourceId,
      input.correlationId,
      input.approvalReference ?? null,
      input.result,
      input.beforeState ?? null,
      input.afterState ?? null,
    ],
  );
  return result.rows[0]!;
}
