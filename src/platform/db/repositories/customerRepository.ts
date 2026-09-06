import type { Pool, PoolClient } from "pg";

import type { AccountState, PasswordlessPurpose } from "@/modules/customers/account";
import { normalizeCustomerEmail } from "@/modules/customers/account";
import { AUTH_IDLE_TIMEOUT_SECONDS } from "@/platform/identity/cookies";

export async function createCustomer(
  client: PoolClient,
  input: Readonly<{ email: string; accountState?: AccountState; displayName?: string | null }>,
) {
  const email = normalizeCustomerEmail(input.email);
  if (!email.ok) throw new Error(email.error.code);
  const result = await client.query<{ id: string; email: string; account_state: AccountState; webauthn_user_handle: string }>(
    `INSERT INTO customers (email, account_state, display_name)
     VALUES ($1,$2,$3) RETURNING id,email,account_state,webauthn_user_handle`,
    [email.value, input.accountState ?? "GUEST", input.displayName?.trim() || null],
  );
  return {
    id: result.rows[0]!.id,
    email: result.rows[0]!.email,
    accountState: result.rows[0]!.account_state,
    webauthnUserHandle: result.rows[0]!.webauthn_user_handle,
  };
}

export async function inviteCustomer(client: PoolClient, customerId: string) {
  const result = await client.query(
    `UPDATE customers SET account_state='INVITED'
     WHERE id=$1 AND account_state IN ('GUEST','INVITED') RETURNING id`,
    [customerId],
  );
  if (result.rowCount !== 1) throw new Error("CUSTOMER_NOT_INVITABLE");
}

export async function activateCustomer(client: PoolClient, customerId: string) {
  const result = await client.query(
    `UPDATE customers SET account_state='ACTIVE'
     WHERE id=$1 AND account_state IN ('INVITED','ACTIVE') RETURNING id`,
    [customerId],
  );
  if (result.rowCount !== 1) throw new Error("CUSTOMER_NOT_ACTIVATABLE");
}

export async function findCustomerByEmail(client: PoolClient, emailInput: string) {
  const email = normalizeCustomerEmail(emailInput);
  if (!email.ok) return null;
  const result = await client.query<{ id: string; email: string; account_state: AccountState }>(
    "SELECT id,email,account_state FROM customers WHERE email=$1",
    [email.value],
  );
  const row = result.rows[0];
  return row ? { id: row.id, email: row.email, accountState: row.account_state } : null;
}

export async function findCustomerByIdForUpdate(client: PoolClient, customerId: string) {
  const result = await client.query<{ id: string; email: string; account_state: AccountState }>(
    "SELECT id,email,account_state FROM customers WHERE id=$1 FOR UPDATE",
    [customerId],
  );
  const row = result.rows[0];
  return row ? { id: row.id, email: row.email, accountState: row.account_state } : null;
}

export async function acquirePasswordlessAccessSlot(
  client: PoolClient,
  input: Readonly<{
    scope: "ADDRESS" | "CALLER";
    requestHash: string;
    requestedAt: Date;
    expiresAt: Date;
    maxRequests: number;
  }>,
) {
  const result = await client.query<{ request_count: number }>(
    `INSERT INTO passwordless_access_limits (
       scope,request_hash,window_started_at,request_count,expires_at
     ) VALUES ($1,$2,$3,1,$4)
     ON CONFLICT (scope,request_hash) DO UPDATE SET
       window_started_at=CASE
         WHEN passwordless_access_limits.expires_at <= EXCLUDED.window_started_at
         THEN EXCLUDED.window_started_at ELSE passwordless_access_limits.window_started_at END,
       request_count=CASE
         WHEN passwordless_access_limits.expires_at <= EXCLUDED.window_started_at
         THEN 1 ELSE passwordless_access_limits.request_count + 1 END,
       expires_at=CASE
         WHEN passwordless_access_limits.expires_at <= EXCLUDED.window_started_at
         THEN EXCLUDED.expires_at ELSE passwordless_access_limits.expires_at END
     RETURNING request_count`,
    [input.scope, input.requestHash, input.requestedAt, input.expiresAt],
  );
  return result.rows[0]!.request_count <= input.maxRequests;
}

export async function pruneExpiredPasswordlessAccessLimits(client: PoolClient, now: Date) {
  const result = await client.query(
    `DELETE FROM passwordless_access_limits
     WHERE ctid IN (
       SELECT ctid FROM passwordless_access_limits
       WHERE expires_at <= $1 ORDER BY expires_at LIMIT 100
     )`,
    [now],
  );
  return result.rowCount ?? 0;
}

export async function createGuestSession(
  client: PoolClient,
  input: Readonly<{ tokenHash: string; expiresAt: Date }>,
) {
  const result = await client.query<{ id: string }>(
    "INSERT INTO guest_sessions (token_hash,expires_at) VALUES ($1,$2) RETURNING id",
    [input.tokenHash, input.expiresAt],
  );
  return result.rows[0]!;
}

export async function createPasswordlessChallenge(
  client: PoolClient,
  input: Readonly<{
    customerId: string;
    purpose: PasswordlessPurpose;
    tokenHash: string;
    expiresAt: Date;
  }>,
) {
  await client.query(
    `UPDATE passwordless_challenges SET invalidated_at=now()
     WHERE customer_id=$1 AND purpose=$2 AND consumed_at IS NULL AND invalidated_at IS NULL`,
    [input.customerId, input.purpose],
  );
  const result = await client.query<{ id: string }>(
    `INSERT INTO passwordless_challenges (customer_id,purpose,token_hash,expires_at)
     VALUES ($1,$2,$3,$4) RETURNING id`,
    [input.customerId, input.purpose, input.tokenHash, input.expiresAt],
  );
  return result.rows[0]!;
}

export async function consumePasswordlessChallenge(client: PoolClient, tokenHash: string, now: Date) {
  const result = await client.query<{
    id: string;
    customer_id: string;
    purpose: PasswordlessPurpose;
  }>(
    `UPDATE passwordless_challenges
     SET consumed_at=$2
     WHERE token_hash=$1 AND consumed_at IS NULL AND invalidated_at IS NULL AND expires_at > $2
     RETURNING id,customer_id,purpose`,
    [tokenHash, now],
  );
  const row = result.rows[0];
  return row ? { id: row.id, customerId: row.customer_id, purpose: row.purpose } : null;
}

export async function createCustomerSession(
  client: PoolClient,
  input: Readonly<{
    customerId: string;
    tokenHash: string;
    idleExpiresAt: Date;
    absoluteExpiresAt: Date;
    createdFromChallengeId: string | null;
  }>,
) {
  const result = await client.query<{ id: string }>(
    `INSERT INTO customer_sessions (
       customer_id,token_hash,idle_expires_at,absolute_expires_at,created_from_challenge_id
     ) VALUES ($1,$2,$3,$4,$5) RETURNING id`,
    [input.customerId, input.tokenHash, input.idleExpiresAt, input.absoluteExpiresAt, input.createdFromChallengeId],
  );
  return result.rows[0]!;
}

export async function findActiveSession(pool: Pool, tokenHash: string, now: Date) {
  const nextIdle = new Date(now.getTime() + AUTH_IDLE_TIMEOUT_SECONDS * 1000);
  const result = await pool.query<{
    id: string;
    customer_id: string;
    email: string;
    display_name: string | null;
    account_state: AccountState;
  }>(
    `UPDATE customer_sessions session
     SET last_seen_at=$2, idle_expires_at=LEAST($3, session.absolute_expires_at)
     FROM customers customer
     WHERE session.token_hash=$1
       AND session.customer_id=customer.id
       AND session.revoked_at IS NULL
       AND session.idle_expires_at > $2
       AND session.absolute_expires_at > $2
       AND customer.account_state='ACTIVE'
     RETURNING session.id,customer.id AS customer_id,customer.email,customer.display_name,customer.account_state`,
    [tokenHash, now, nextIdle],
  );
  const row = result.rows[0];
  return row ? {
    id: row.id,
    customerId: row.customer_id,
    email: row.email,
    displayName: row.display_name,
    accountState: row.account_state,
  } : null;
}

export async function revokeSession(client: PoolClient, sessionId: string, reason: string) {
  return client.query(
    `UPDATE customer_sessions SET revoked_at=COALESCE(revoked_at,now()),
       revocation_reason=COALESCE(revocation_reason,$2) WHERE id=$1`,
    [sessionId, reason],
  );
}

export async function revokeCustomerSessions(client: PoolClient, customerId: string, reason: string) {
  return client.query(
    `UPDATE customer_sessions SET revoked_at=now(),revocation_reason=$2
     WHERE customer_id=$1 AND revoked_at IS NULL`,
    [customerId, reason],
  );
}
