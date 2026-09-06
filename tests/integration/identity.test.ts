import { randomUUID } from "node:crypto";

import { describe, expect, it } from "vitest";

import { hashOpaqueToken } from "@/platform/identity/tokens";
import {
  acquirePasswordlessAccessSlot,
  consumePasswordlessChallenge,
  createCustomer,
  createPasswordlessChallenge,
  createCustomerSession,
  createGuestSession,
  findActiveSession,
  inviteCustomer,
  pruneExpiredPasswordlessAccessLimits,
  revokeCustomerSessions,
  revokeSession,
} from "@/platform/db/repositories/customerRepository";
import {
  linkVerifiedIdentity,
  listPasskeyCredentialsForCustomer,
  registerPasskeyCredential,
  revokePasskeyCredential,
} from "@/platform/db/repositories/identityRepository";
import {
  createAddress,
  deleteAddressForCustomer,
  getAddressForCustomer,
  listAddressesForCustomer,
  updateAddressForCustomer,
} from "@/platform/db/repositories/addressRepository";
import { claimGuestOrder, getOwnedOrder } from "@/platform/db/repositories/orderRepository";
import { withTransaction } from "@/platform/db/transaction";
import { isolatedPostgres } from "../helpers/postgres";

const { pool } = isolatedPostgres();

async function customer(email: string, state: "GUEST" | "INVITED" | "ACTIVE" = "GUEST") {
  return withTransaction(pool, (client) => createCustomer(client, { email, accountState: state }));
}

describe("BR-04 identity persistence", () => {
  it("creates canonical customers and advances invitation state without duplication", async () => {
    const created = await customer(`invite-${randomUUID()}@example.com`);
    await withTransaction(pool, (client) => inviteCustomer(client, created.id));
    const row = await pool.query("SELECT account_state FROM customers WHERE id=$1", [created.id]);
    expect(row.rows[0].account_state).toBe("INVITED");
    expect((await pool.query("SELECT count(*)::int AS count FROM customers WHERE id=$1", [created.id])).rows[0].count).toBe(1);
  });

  it("stores only passwordless token hashes and consumes a challenge once", async () => {
    const created = await customer(`challenge-${randomUUID()}@example.com`, "INVITED");
    const raw = `raw-${randomUUID()}`;
    const tokenHash = await hashOpaqueToken(raw);
    const challenge = await withTransaction(pool, (client) => createPasswordlessChallenge(client, {
      customerId: created.id,
      purpose: "ACCOUNT_ACTIVATION",
      tokenHash,
      expiresAt: new Date(Date.now() + 60_000),
    }));
    const stored = await pool.query("SELECT token_hash, to_jsonb(passwordless_challenges) AS document FROM passwordless_challenges WHERE id=$1", [challenge.id]);
    expect(stored.rows[0].token_hash).toBe(tokenHash);
    expect(JSON.stringify(stored.rows[0].document)).not.toContain(raw);
    expect(await withTransaction(pool, (client) => consumePasswordlessChallenge(client, tokenHash, new Date()))).toMatchObject({ id: challenge.id });
    expect(await withTransaction(pool, (client) => consumePasswordlessChallenge(client, tokenHash, new Date()))).toBeNull();
  });

  it("rejects expired and superseded passwordless challenges", async () => {
    const created = await customer(`expired-${randomUUID()}@example.com`, "INVITED");
    const first = await hashOpaqueToken(`first-${randomUUID()}`);
    const second = await hashOpaqueToken(`second-${randomUUID()}`);
    await withTransaction(pool, (client) => createPasswordlessChallenge(client, {
      customerId: created.id, purpose: "ACCOUNT_ACTIVATION", tokenHash: first,
      expiresAt: new Date(Date.now() - 1_000),
    }));
    await withTransaction(pool, (client) => createPasswordlessChallenge(client, {
      customerId: created.id, purpose: "ACCOUNT_ACTIVATION", tokenHash: second,
      expiresAt: new Date(Date.now() + 60_000),
    }));
    expect(await withTransaction(pool, (client) => consumePasswordlessChallenge(client, first, new Date()))).toBeNull();
    expect(await withTransaction(pool, (client) => consumePasswordlessChallenge(client, second, new Date()))).not.toBeNull();
  });

  it("stores only opaque session hashes and enforces revocation, expiry, and active account state", async () => {
    const created = await customer(`session-${randomUUID()}@example.com`, "ACTIVE");
    const raw = `session-${randomUUID()}`;
    const hash = await hashOpaqueToken(raw);
    const session = await withTransaction(pool, (client) => createCustomerSession(client, {
      customerId: created.id,
      tokenHash: hash,
      idleExpiresAt: new Date(Date.now() + 60_000),
      absoluteExpiresAt: new Date(Date.now() + 120_000),
      createdFromChallengeId: null,
    }));
    const stored = await pool.query("SELECT token_hash, to_jsonb(customer_sessions) AS document FROM customer_sessions WHERE id=$1", [session.id]);
    expect(stored.rows[0].token_hash).toBe(hash);
    expect(JSON.stringify(stored.rows[0].document)).not.toContain(raw);
    expect(await findActiveSession(pool, hash, new Date())).toMatchObject({ customerId: created.id });
    await withTransaction(pool, (client) => revokeSession(client, session.id, "LOGOUT"));
    expect(await findActiveSession(pool, hash, new Date())).toBeNull();

    const expiredHash = await hashOpaqueToken(`expired-${randomUUID()}`);
    await withTransaction(pool, (client) => createCustomerSession(client, {
      customerId: created.id, tokenHash: expiredHash,
      idleExpiresAt: new Date(Date.now() - 1_000), absoluteExpiresAt: new Date(Date.now() + 60_000),
      createdFromChallengeId: null,
    }));
    expect(await findActiveSession(pool, expiredHash, new Date())).toBeNull();

    const absoluteExpiredHash = await hashOpaqueToken(`absolute-expired-${randomUUID()}`);
    const absoluteExpired = await withTransaction(pool, (client) => createCustomerSession(client, {
      customerId: created.id, tokenHash: absoluteExpiredHash,
      idleExpiresAt: new Date(Date.now() + 120_000), absoluteExpiresAt: new Date(Date.now() + 180_000),
      createdFromChallengeId: null,
    }));
    await pool.query(
      `UPDATE customer_sessions
       SET created_at=now()-interval '3 days', idle_expires_at=now()-interval '2 days',
           absolute_expires_at=now()-interval '1 day'
       WHERE id=$1`,
      [absoluteExpired.id],
    );
    expect(await findActiveSession(pool, absoluteExpiredHash, new Date())).toBeNull();

    const disabledHash = await hashOpaqueToken(`disabled-${randomUUID()}`);
    await withTransaction(pool, (client) => createCustomerSession(client, {
      customerId: created.id, tokenHash: disabledHash,
      idleExpiresAt: new Date(Date.now() + 60_000), absoluteExpiresAt: new Date(Date.now() + 120_000),
      createdFromChallengeId: null,
    }));
    await pool.query("UPDATE customers SET account_state='DISABLED' WHERE id=$1", [created.id]);
    await withTransaction(pool, (client) => revokeCustomerSessions(client, created.id, "ACCOUNT_DISABLED"));
    expect(await findActiveSession(pool, disabledHash, new Date())).toBeNull();
  });

  it("creates PII-free guest sessions that remain distinct from customers", async () => {
    const hash = await hashOpaqueToken(`guest-${randomUUID()}`);
    const before = Number((await pool.query("SELECT count(*) FROM customers")).rows[0].count);
    const guest = await withTransaction(pool, (client) => createGuestSession(client, {
      tokenHash: hash, expiresAt: new Date(Date.now() + 60_000),
    }));
    expect(guest.id).toBeTruthy();
    expect(Number((await pool.query("SELECT count(*) FROM customers")).rows[0].count)).toBe(before);
    expect(Object.keys((await pool.query("SELECT * FROM guest_sessions WHERE id=$1", [guest.id])).rows[0])).not.toContain("email");
  });

  it("bounds caller abuse windows and prunes expired limiter state", async () => {
    const now = new Date();
    const requestHash = await hashOpaqueToken(`caller-${randomUUID()}`);
    for (let attempt = 1; attempt <= 21; attempt += 1) {
      const granted = await withTransaction(pool, (client) => acquirePasswordlessAccessSlot(client, {
        scope: "CALLER",
        requestHash,
        requestedAt: now,
        expiresAt: new Date(now.getTime() + 60_000),
        maxRequests: 20,
      }));
      expect(granted).toBe(attempt <= 20);
    }
    expect(await withTransaction(pool, (client) => pruneExpiredPasswordlessAccessLimits(
      client,
      new Date(now.getTime() + 60_001),
    ))).toBeGreaterThanOrEqual(1);
    expect((await pool.query(
      "SELECT count(*)::int AS count FROM passwordless_access_limits WHERE scope='CALLER' AND request_hash=$1",
      [requestHash],
    )).rows[0].count).toBe(0);
  });

  it("links deterministic identities idempotently and fails closed on conflict", async () => {
    const first = await customer(`identity-a-${randomUUID()}@example.com`);
    const second = await customer(`identity-b-${randomUUID()}@example.com`);
    const identity = `owner-${randomUUID()}@example.com`;
    expect(await withTransaction(pool, (client) => linkVerifiedIdentity(client, {
      customerId: first.id, type: "VERIFIED_EMAIL", value: identity,
    }))).toBe("LINKED");
    expect(await withTransaction(pool, (client) => linkVerifiedIdentity(client, {
      customerId: first.id, type: "VERIFIED_EMAIL", value: identity,
    }))).toBe("ALREADY_LINKED");
    expect(await withTransaction(pool, (client) => linkVerifiedIdentity(client, {
      customerId: second.id, type: "VERIFIED_EMAIL", value: identity,
    }))).toBe("CONFLICT");
  });

  it("scopes address CRUD to the canonical owner", async () => {
    const owner = await customer(`address-owner-${randomUUID()}@example.com`);
    const other = await customer(`address-other-${randomUUID()}@example.com`);
    const created = await withTransaction(pool, (client) => createAddress(client, owner.id, {
      kind: "SHIPPING", recipientName: "Owner", line1: "1 Form", line2: null,
      city: "Barcelona", region: null, postalCode: "08001", countryCode: "ES",
    }));
    expect(await getAddressForCustomer(pool, owner.id, created.id)).toMatchObject({ recipientName: "Owner" });
    expect(await getAddressForCustomer(pool, other.id, created.id)).toBeNull();
    expect(await withTransaction(pool, (client) => updateAddressForCustomer(client, other.id, created.id, {
      kind: "SHIPPING", recipientName: "Intruder", line1: "2 Form", line2: null,
      city: "Madrid", region: null, postalCode: "28001", countryCode: "ES",
    }))).toBeNull();
    expect(await withTransaction(pool, (client) => deleteAddressForCustomer(client, other.id, created.id))).toBe(false);
    expect(await listAddressesForCustomer(pool, owner.id)).toHaveLength(1);
    expect(await withTransaction(pool, (client) => deleteAddressForCustomer(client, owner.id, created.id))).toBe(true);
  });

  it("enforces order ownership and verified-email guest claims", async () => {
    const ownerEmail = `order-owner-${randomUUID()}@example.com`;
    const owner = await customer(ownerEmail);
    const other = await customer(`order-other-${randomUUID()}@example.com`);
    await withTransaction(pool, (client) => linkVerifiedIdentity(client, {
      customerId: owner.id, type: "VERIFIED_EMAIL", value: ownerEmail,
    }));
    const order = await pool.query<{ id: string }>(
      `INSERT INTO orders (guest_email,market,currency,subtotal_minor,tax_minor,duties_minor,shipping_minor,discount_minor,total_minor,price_book_revision)
       VALUES ($1,'EU','EUR',100,0,0,0,0,100,'br04-test') RETURNING id`, [ownerEmail],
    );
    const id = order.rows[0]!.id;
    expect(await getOwnedOrder(pool, owner.id, id)).toBeNull();
    expect(await withTransaction(pool, (client) => claimGuestOrder(client, other.id, id))).toBe("VERIFIED_EMAIL_MISMATCH");
    expect(await withTransaction(pool, (client) => claimGuestOrder(client, owner.id, id))).toBe("CLAIMED");
    expect(await getOwnedOrder(pool, other.id, id)).toBeNull();
    expect(await getOwnedOrder(pool, owner.id, id)).toMatchObject({ id });
    expect(await withTransaction(pool, (client) => claimGuestOrder(client, other.id, id))).toBe("ALREADY_OWNED");
  });

  it("stores public passkey material with stable non-PII handles and unique credential IDs", async () => {
    const owner = await customer(`passkey-${randomUUID()}@example.com`);
    const other = await customer(`passkey-other-${randomUUID()}@example.com`);
    const first = await withTransaction(pool, (client) => registerPasskeyCredential(client, {
      customerId: owner.id,
      credentialId: `credential-${randomUUID()}`,
      publicKey: "public-material-only",
      signCount: 0,
      userHandle: owner.webauthnUserHandle,
      transports: ["internal"],
    }));
    expect(first.customerId).toBe(owner.id);
    expect(JSON.stringify(first)).not.toContain("private");
    const second = await withTransaction(pool, (client) => registerPasskeyCredential(client, {
      customerId: owner.id,
      credentialId: `credential-${randomUUID()}`,
      publicKey: "second-public-material",
      signCount: 1,
      userHandle: owner.webauthnUserHandle,
      transports: ["hybrid"],
    }));
    expect((await listPasskeyCredentialsForCustomer(pool, owner.id))).toHaveLength(2);
    expect(await listPasskeyCredentialsForCustomer(pool, other.id)).toHaveLength(0);
    expect(await withTransaction(pool, (client) => revokePasskeyCredential(client, other.id, second.credentialId))).toBe(false);
    expect(await withTransaction(pool, (client) => revokePasskeyCredential(client, owner.id, second.credentialId))).toBe(true);
    expect((await listPasskeyCredentialsForCustomer(pool, owner.id)).find(({ credentialId }) => credentialId === second.credentialId)?.revokedAt).toBeInstanceOf(Date);
    await expect(withTransaction(pool, (client) => registerPasskeyCredential(client, {
      customerId: owner.id,
      credentialId: first.credentialId,
      publicKey: "another-public-key",
      signCount: 0,
      userHandle: owner.webauthnUserHandle,
      transports: null,
    }))).rejects.toMatchObject({ code: "23505" });
  });
});
