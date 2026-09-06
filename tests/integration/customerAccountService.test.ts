import { randomUUID } from "node:crypto";

import { describe, expect, it } from "vitest";

import type { PasswordlessDelivery, PasswordlessDeliveryProvider } from "@/modules/customers/delivery";
import { createCustomer, findActiveSession } from "@/platform/db/repositories/customerRepository";
import {
  claimGuestOrderForCustomer,
  disableCustomerAccount,
  exchangePasswordlessToken,
  inviteAccount,
  linkVerifiedIdentityWithAudit,
  logoutSession,
  requestAccountAccess,
} from "@/platform/db/services/customerAccountService";
import { withTransaction } from "@/platform/db/transaction";
import { PASSWORDLESS_TTL_SECONDS } from "@/platform/identity/cookies";
import { hashOpaqueToken } from "@/platform/identity/tokens";
import type { Locale } from "@/site/i18n/config";
import { isolatedPostgres } from "../helpers/postgres";

const { pool } = isolatedPostgres();

class CaptureDelivery implements PasswordlessDeliveryProvider {
  delivery: PasswordlessDelivery | null = null;
  readonly deliveries: PasswordlessDelivery[] = [];
  async deliverAccountLink(input: PasswordlessDelivery) {
    this.delivery = input;
    this.deliveries.push(input);
  }
}

describe("customer account application service", () => {
  it("activates an invited customer once, creates a fresh opaque session, and emits secret-free audits", async () => {
    const now = new Date();
    const customer = await withTransaction(pool, (client) => createCustomer(client, {
      email: `service-${randomUUID()}@example.com`,
    }));
    const delivery = new CaptureDelivery();
    await inviteAccount(pool, {
      customerId: customer.id,
      locale: "en", delivery, now,
    });
    expect(delivery.delivery?.email).toBe(customer.email);
    expect(new URL(delivery.delivery!.url).origin).toBe("http://localhost:3000");
    expect(delivery.delivery?.expiresAt.getTime()).toBe(now.getTime() + PASSWORDLESS_TTL_SECONDS * 1000);
    const verification = new URL(delivery.delivery!.url);
    const rawChallenge = verification.searchParams.get("token")!;
    const exchanged = await exchangePasswordlessToken(pool, { rawToken: rawChallenge, now: new Date(now.getTime() + 1_000) });
    expect(exchanged?.rawToken).toBeTruthy();
    expect(exchanged?.rawToken).not.toBe(rawChallenge);
    expect(await exchangePasswordlessToken(pool, { rawToken: rawChallenge, now: new Date(now.getTime() + 2_000) })).toBeNull();
    expect(await findActiveSession(pool, await hashOpaqueToken(exchanged!.rawToken), new Date(now.getTime() + 3_000))).toMatchObject({ customerId: customer.id });
    const state = await pool.query("SELECT account_state FROM customers WHERE id=$1", [customer.id]);
    expect(state.rows[0].account_state).toBe("ACTIVE");
    const actions = await pool.query<{ action: string; document: unknown }>(
      `SELECT action,to_jsonb(audit_log) AS document FROM audit_log WHERE resource_id=$1 ORDER BY occurred_at`, [customer.id],
    );
    expect(actions.rows.map(({ action }) => action)).toEqual(expect.arrayContaining([
      "ACCOUNT_INVITED", "ACCOUNT_ACTIVATED", "VERIFIED_IDENTITY_LINKED",
    ]));
    expect(JSON.stringify(actions.rows)).not.toContain(rawChallenge);
    expect(JSON.stringify(actions.rows)).not.toContain(exchanged!.rawToken);
    expect(await logoutSession(pool, exchanged!.rawToken)).toBe(true);
    expect(await findActiveSession(pool, await hashOpaqueToken(exchanged!.rawToken), new Date(now.getTime() + 4_000))).toBeNull();
  });

  it("rolls back invitation state and audit if challenge persistence fails", async () => {
    const customer = await withTransaction(pool, (client) => createCustomer(client, {
      email: `atomic-invite-${randomUUID()}@example.com`,
    }));
    const functionName = `reject_challenge_${randomUUID().replaceAll("-", "")}`;
    await pool.query(`CREATE FUNCTION ${functionName}() RETURNS trigger LANGUAGE plpgsql AS $$
      BEGIN RAISE EXCEPTION 'forced challenge failure'; END $$`);
    await pool.query(`CREATE TRIGGER ${functionName} BEFORE INSERT ON passwordless_challenges
      FOR EACH ROW EXECUTE FUNCTION ${functionName}()`);
    try {
      await expect(inviteAccount(pool, {
        customerId: customer.id,
        locale: "en",
        delivery: new CaptureDelivery(),
      })).rejects.toThrow("forced challenge failure");
      expect((await pool.query("SELECT account_state FROM customers WHERE id=$1", [customer.id])).rows[0].account_state).toBe("GUEST");
      expect((await pool.query("SELECT count(*)::int AS count FROM audit_log WHERE resource_id=$1", [customer.id])).rows[0].count).toBe(0);
    } finally {
      await pool.query(`DROP TRIGGER ${functionName} ON passwordless_challenges`);
      await pool.query(`DROP FUNCTION ${functionName}()`);
    }
  });

  it("rejects path-breaking invitation locales before creating a challenge", async () => {
    for (const hostileLocale of ["//attacker.example", "\\\\attacker.example"]) {
      const customer = await withTransaction(pool, (client) => createCustomer(client, {
        email: `locale-${randomUUID()}@example.com`,
      }));
      const delivery = new CaptureDelivery();
      await expect(inviteAccount(pool, {
        customerId: customer.id,
        locale: hostileLocale as Locale,
        delivery,
      })).rejects.toThrow("UNSUPPORTED_ACCOUNT_LOCALE");
      expect(delivery.deliveries).toHaveLength(0);
      expect((await pool.query(
        "SELECT count(*)::int AS count FROM passwordless_challenges WHERE customer_id=$1",
        [customer.id],
      )).rows[0].count).toBe(0);
      expect((await pool.query("SELECT account_state FROM customers WHERE id=$1", [customer.id])).rows[0].account_state).toBe("GUEST");
    }
  });

  it("coalesces repeated sign-in requests without invalidating the delivered challenge", async () => {
    const now = new Date();
    const customer = await withTransaction(pool, (client) => createCustomer(client, {
      email: `throttle-${randomUUID()}@example.com`, accountState: "ACTIVE",
    }));
    const delivery = new CaptureDelivery();
    const request = (requestedAt: Date) => requestAccountAccess(pool, {
      email: customer.email,
      locale: "en",
      delivery,
      now: requestedAt,
    });
    await request(now);
    const rawToken = new URL(delivery.delivery!.url).searchParams.get("token")!;
    await request(new Date(now.getTime() + 1_000));
    expect(delivery.deliveries).toHaveLength(1);
    expect((await pool.query(
      `SELECT count(*)::int AS count FROM passwordless_challenges
       WHERE customer_id=$1 AND purpose='SIGN_IN' AND consumed_at IS NULL AND invalidated_at IS NULL`,
      [customer.id],
    )).rows[0].count).toBe(1);
    expect(await exchangePasswordlessToken(pool, {
      rawToken,
      now: new Date(now.getTime() + 2_000),
    })).toMatchObject({ customerId: customer.id });
  });

  it("throttles unknown access requests without storing the supplied address", async () => {
    const email = `unknown-${randomUUID()}@example.com`;
    const delivery = new CaptureDelivery();
    await requestAccountAccess(pool, {
      email,
      locale: "en",
      delivery,
    });
    const limits = await pool.query("SELECT to_jsonb(passwordless_access_limits) AS document FROM passwordless_access_limits");
    expect(limits.rowCount).toBeGreaterThan(0);
    expect(JSON.stringify(limits.rows)).not.toContain(email);
    expect(delivery.deliveries).toHaveLength(0);
  });

  it("disables account access immediately and revokes all existing sessions", async () => {
    const customer = await withTransaction(pool, (client) => createCustomer(client, {
      email: `disabled-${randomUUID()}@example.com`, accountState: "ACTIVE",
    }));
    expect(await disableCustomerAccount(pool, customer.id)).toBe(true);
    expect((await pool.query("SELECT account_state FROM customers WHERE id=$1", [customer.id])).rows[0].account_state).toBe("DISABLED");
    expect((await pool.query("SELECT action FROM audit_log WHERE resource_id=$1", [customer.id])).rows.map((row) => row.action)).toContain("ACCOUNT_DISABLED");
  });

  it("audits deterministic identity conflicts and successful guest-order ownership claims without PII", async () => {
    const sharedEmail = `claim-${randomUUID()}@example.com`;
    const owner = await withTransaction(pool, (client) => createCustomer(client, { email: sharedEmail }));
    const other = await withTransaction(pool, (client) => createCustomer(client, { email: `other-${randomUUID()}@example.com` }));
    expect(await linkVerifiedIdentityWithAudit(pool, {
      customerId: owner.id, type: "VERIFIED_EMAIL", value: sharedEmail,
    })).toBe("LINKED");
    expect(await linkVerifiedIdentityWithAudit(pool, {
      customerId: other.id, type: "VERIFIED_EMAIL", value: sharedEmail,
    })).toBe("CONFLICT");
    const order = await pool.query<{ id: string }>(
      `INSERT INTO orders (guest_email,market,currency,subtotal_minor,tax_minor,duties_minor,shipping_minor,discount_minor,total_minor,price_book_revision)
       VALUES ($1,'EU','EUR',100,0,0,0,0,100,'br04-service') RETURNING id`, [sharedEmail],
    );
    expect(await claimGuestOrderForCustomer(pool, owner.id, order.rows[0]!.id)).toBe("CLAIMED");
    const audits = await pool.query<{ action: string; after_state: Record<string, unknown> }>(
      "SELECT action,after_state FROM audit_log WHERE resource_id IN ($1,$2,$3)",
      [owner.id, other.id, order.rows[0]!.id],
    );
    expect(audits.rows.map(({ action }) => action)).toContain("GUEST_ORDER_CLAIMED");
    expect(JSON.stringify(audits.rows)).not.toContain(sharedEmail);
  });
});
