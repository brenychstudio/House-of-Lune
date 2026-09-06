import type { PoolClient } from "pg";

import { normalizeCustomerEmail } from "@/modules/customers/account";

type VerifiedIdentityInput = Readonly<{
  customerId: string;
  type: "VERIFIED_EMAIL" | "EXTERNAL_SUBJECT";
  value: string;
  provider?: string;
}>;

export async function linkVerifiedIdentity(
  client: PoolClient,
  input: VerifiedIdentityInput,
): Promise<"LINKED" | "ALREADY_LINKED" | "CONFLICT"> {
  const normalized = input.type === "VERIFIED_EMAIL" ? normalizeCustomerEmail(input.value) : null;
  if (normalized && !normalized.ok) throw new Error(normalized.error.code);
  if (input.type === "EXTERNAL_SUBJECT" && !input.provider?.trim()) throw new Error("IDENTITY_PROVIDER_REQUIRED");
  const value = normalized?.ok ? normalized.value : input.value.trim();
  const provider = input.type === "EXTERNAL_SUBJECT" ? input.provider!.trim().toLowerCase() : null;
  const inserted = await client.query(
    `INSERT INTO customer_identities (customer_id,identity_type,identity_value,provider,verified_at)
     VALUES ($1,$2,$3,$4,now()) ON CONFLICT DO NOTHING RETURNING id`,
    [input.customerId, input.type, value, provider],
  );
  if (inserted.rowCount === 1) return "LINKED";
  const owner = await client.query<{ customer_id: string }>(
    `SELECT customer_id FROM customer_identities
     WHERE identity_type=$1 AND COALESCE(provider,'')=COALESCE($2,'') AND identity_value=$3`,
    [input.type, provider, value],
  );
  return owner.rows[0]?.customer_id === input.customerId ? "ALREADY_LINKED" : "CONFLICT";
}

export async function listPasskeyCredentialsForCustomer(
  pool: import("pg").Pool,
  customerId: string,
) {
  const result = await pool.query<{
    id: string; credential_id: string; user_handle: string; revoked_at: Date | null;
  }>(
    `SELECT id,credential_id,user_handle,revoked_at FROM passkey_credentials
     WHERE customer_id=$1 ORDER BY created_at,id`, [customerId],
  );
  return result.rows.map((row) => ({
    id: row.id, credentialId: row.credential_id, userHandle: row.user_handle, revokedAt: row.revoked_at,
  }));
}

export async function revokePasskeyCredential(
  client: PoolClient,
  customerId: string,
  credentialId: string,
) {
  const result = await client.query(
    `UPDATE passkey_credentials SET revoked_at=COALESCE(revoked_at,now())
     WHERE customer_id=$1 AND credential_id=$2`, [customerId, credentialId],
  );
  return result.rowCount === 1;
}

export async function registerPasskeyCredential(
  client: PoolClient,
  input: Readonly<{
    customerId: string;
    credentialId: string;
    publicKey: string;
    signCount: number;
    userHandle: string;
    transports: readonly string[] | null;
  }>,
) {
  const result = await client.query<{
    id: string;
    customer_id: string;
    credential_id: string;
    public_key: string;
    sign_count: string;
    user_handle: string;
    transports: string[] | null;
  }>(
    `INSERT INTO passkey_credentials (
       customer_id,credential_id,public_key,sign_count,user_handle,transports
     ) VALUES ($1,$2,$3,$4,$5,$6)
     RETURNING id,customer_id,credential_id,public_key,sign_count,user_handle,transports`,
    [input.customerId, input.credentialId, input.publicKey, input.signCount, input.userHandle, input.transports],
  );
  const row = result.rows[0]!;
  return {
    id: row.id,
    customerId: row.customer_id,
    credentialId: row.credential_id,
    publicKey: row.public_key,
    signCount: Number(row.sign_count),
    userHandle: row.user_handle,
    transports: row.transports,
  };
}
