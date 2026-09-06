import type { Pool } from "pg";

import { normalizeCustomerEmail } from "@/modules/customers/account";
import type { PasswordlessDeliveryProvider } from "@/modules/customers/delivery";
import { readPublicEnvironment } from "@/platform/config/environment";
import { appendAudit } from "@/platform/db/repositories/auditRepository";
import {
  acquirePasswordlessAccessSlot,
  activateCustomer,
  consumePasswordlessChallenge,
  createCustomerSession,
  createGuestSession,
  createPasswordlessChallenge,
  findCustomerByEmail,
  findCustomerByIdForUpdate,
  inviteCustomer,
  pruneExpiredPasswordlessAccessLimits,
  revokeSession,
  revokeCustomerSessions,
} from "@/platform/db/repositories/customerRepository";
import { linkVerifiedIdentity } from "@/platform/db/repositories/identityRepository";
import { claimGuestOrder } from "@/platform/db/repositories/orderRepository";
import { withTransaction } from "@/platform/db/transaction";
import {
  AUTH_ABSOLUTE_LIFETIME_SECONDS,
  AUTH_IDLE_TIMEOUT_SECONDS,
  GUEST_SESSION_LIFETIME_SECONDS,
  PASSWORDLESS_TTL_SECONDS,
} from "@/platform/identity/cookies";
import { generateOpaqueToken, hashOpaqueToken } from "@/platform/identity/tokens";
import { isLocale, type Locale } from "@/site/i18n/config";

const GENERIC_ACCESS_MESSAGE = "If this address is eligible, an access link will be sent.";
export const PASSWORDLESS_ACCESS_COOLDOWN_SECONDS = 60;
export const PASSWORDLESS_CALLER_LIMIT_PER_WINDOW = 20;

function correlationId(prefix: string) {
  return `${prefix}-${globalThis.crypto.randomUUID()}`;
}

function requireLocale(value: string): Locale {
  if (!isLocale(value)) throw new Error("UNSUPPORTED_ACCOUNT_LOCALE");
  return value;
}

function verificationUrl(locale: Locale, rawToken: string) {
  const { siteUrl } = readPublicEnvironment(process.env);
  const url = new URL(`/${locale}/account/verify`, siteUrl.origin);
  url.searchParams.set("token", rawToken);
  return url.toString();
}

async function challengeMaterial(now: Date) {
  const rawToken = generateOpaqueToken();
  const tokenHash = await hashOpaqueToken(rawToken);
  return { rawToken, tokenHash, expiresAt: new Date(now.getTime() + PASSWORDLESS_TTL_SECONDS * 1000) };
}

export async function inviteAccount(
  pool: Pool,
  input: Readonly<{
    customerId: string;
    locale: Locale;
    delivery: PasswordlessDeliveryProvider;
    now?: Date;
  }>,
) {
  const locale = requireLocale(input.locale);
  const now = input.now ?? new Date();
  const material = await challengeMaterial(now);
  const invitation = await withTransaction(pool, async (client) => {
    const customer = await findCustomerByIdForUpdate(client, input.customerId);
    if (!customer) throw new Error("CUSTOMER_NOT_FOUND");
    await inviteCustomer(client, input.customerId);
    const challenge = await createPasswordlessChallenge(client, {
      customerId: input.customerId,
      purpose: "ACCOUNT_ACTIVATION",
      tokenHash: material.tokenHash,
      expiresAt: material.expiresAt,
    });
    await appendAudit(client, {
      actorType: "SYSTEM",
      actorId: "account-invitation",
      action: "ACCOUNT_INVITED",
      resourceType: "CUSTOMER",
      resourceId: input.customerId,
      correlationId: correlationId("invite"),
      result: "SUCCEEDED",
      afterState: { accountState: "INVITED" },
    });
    return { challenge, email: customer.email };
  });
  await input.delivery.deliverAccountLink({
    customerId: input.customerId,
    email: invitation.email,
    purpose: "ACCOUNT_ACTIVATION",
    url: verificationUrl(locale, material.rawToken),
    expiresAt: material.expiresAt,
  });
  return invitation.challenge;
}

type AccountAccessInput = Readonly<{
  email: string;
  locale: Locale;
  callerScope?: string;
  now?: Date;
}>;

export async function prepareAccountAccess(
  pool: Pool,
  input: AccountAccessInput,
) {
  const locale = requireLocale(input.locale);
  const now = input.now ?? new Date();
  const email = normalizeCustomerEmail(input.email);
  const requestKey = email.ok
    ? `email:${email.value}`
    : `invalid:${input.email.trim().toLowerCase().slice(0, 512)}`;
  const [requestHash, callerHash, material] = await Promise.all([
    hashOpaqueToken(requestKey),
    hashOpaqueToken(`caller:${input.callerScope ?? "unattributed"}`),
    challengeMaterial(now),
  ]);
  const pendingDelivery = await withTransaction(pool, async (client) => {
    await pruneExpiredPasswordlessAccessLimits(client, now);
    const expiresAt = new Date(now.getTime() + PASSWORDLESS_ACCESS_COOLDOWN_SECONDS * 1000);
    const addressGranted = await acquirePasswordlessAccessSlot(client, {
      scope: "ADDRESS",
      requestHash,
      requestedAt: now,
      expiresAt,
      maxRequests: 1,
    });
    const callerGranted = await acquirePasswordlessAccessSlot(client, {
      scope: "CALLER",
      requestHash: callerHash,
      requestedAt: now,
      expiresAt,
      maxRequests: PASSWORDLESS_CALLER_LIMIT_PER_WINDOW,
    });
    const customer = email.ok ? await findCustomerByEmail(client, email.value) : null;
    if (!addressGranted || !callerGranted || customer?.accountState !== "ACTIVE") return null;
    await createPasswordlessChallenge(client, {
      customerId: customer.id,
      purpose: "SIGN_IN",
      tokenHash: material.tokenHash,
      expiresAt: material.expiresAt,
    });
    return { customerId: customer.id, email: customer.email };
  });
  return {
    message: GENERIC_ACCESS_MESSAGE,
    delivery: pendingDelivery ? {
      ...pendingDelivery,
      purpose: "SIGN_IN",
      url: verificationUrl(locale, material.rawToken),
      expiresAt: material.expiresAt,
    } as const : null,
  } as const;
}

export async function requestAccountAccess(
  pool: Pool,
  input: AccountAccessInput & Readonly<{ delivery: PasswordlessDeliveryProvider }>,
) {
  const prepared = await prepareAccountAccess(pool, input);
  if (prepared.delivery) await input.delivery.deliverAccountLink(prepared.delivery);
  return { message: prepared.message } as const;
}

export async function exchangePasswordlessToken(
  pool: Pool,
  input: Readonly<{ rawToken: string; guestRawToken?: string; now?: Date }>,
) {
  if (!/^[A-Za-z0-9_-]{43}$/.test(input.rawToken)) return null;
  const now = input.now ?? new Date();
  const challengeHash = await hashOpaqueToken(input.rawToken);
  const sessionRawToken = generateOpaqueToken();
  const sessionHash = await hashOpaqueToken(sessionRawToken);
  const guestHash = input.guestRawToken ? await hashOpaqueToken(input.guestRawToken) : null;
  return withTransaction(pool, async (client) => {
    const challenge = await consumePasswordlessChallenge(client, challengeHash, now);
    if (!challenge) return null;
    const customer = await client.query<{ email: string; account_state: string }>(
      "SELECT email,account_state FROM customers WHERE id=$1 FOR UPDATE", [challenge.customerId],
    );
    const account = customer.rows[0];
    if (!account) return null;
    if (challenge.purpose === "ACCOUNT_ACTIVATION") {
      await activateCustomer(client, challenge.customerId);
      const linked = await linkVerifiedIdentity(client, {
        customerId: challenge.customerId,
        type: "VERIFIED_EMAIL",
        value: account.email,
      });
      if (linked === "CONFLICT") throw new Error("VERIFIED_IDENTITY_CONFLICT");
      if (linked === "LINKED") {
        await appendAudit(client, {
          actorType: "CUSTOMER", actorId: challenge.customerId, action: "VERIFIED_IDENTITY_LINKED",
          resourceType: "CUSTOMER", resourceId: challenge.customerId,
          correlationId: correlationId("identity"), result: "SUCCEEDED",
          afterState: { identityType: "VERIFIED_EMAIL" },
        });
      }
      await appendAudit(client, {
        actorType: "CUSTOMER", actorId: challenge.customerId, action: "ACCOUNT_ACTIVATED",
        resourceType: "CUSTOMER", resourceId: challenge.customerId,
        correlationId: correlationId("activation"), result: "SUCCEEDED",
        afterState: { accountState: "ACTIVE" },
      });
    } else if (account.account_state !== "ACTIVE") {
      return null;
    }
    if (guestHash) {
      await client.query(
        `UPDATE guest_sessions SET revoked_at=now(),bound_customer_id=$1
         WHERE token_hash=$2 AND revoked_at IS NULL AND expires_at > $3`,
        [challenge.customerId, guestHash, now],
      );
    }
    const idleExpiresAt = new Date(now.getTime() + AUTH_IDLE_TIMEOUT_SECONDS * 1000);
    const absoluteExpiresAt = new Date(now.getTime() + AUTH_ABSOLUTE_LIFETIME_SECONDS * 1000);
    const session = await createCustomerSession(client, {
      customerId: challenge.customerId,
      tokenHash: sessionHash,
      idleExpiresAt,
      absoluteExpiresAt,
      createdFromChallengeId: challenge.id,
    });
    await appendAudit(client, {
      actorType: "CUSTOMER", actorId: challenge.customerId, action: "SESSION_CREATED",
      resourceType: "CUSTOMER_SESSION", resourceId: session.id,
      correlationId: correlationId("session"), result: "SUCCEEDED",
      afterState: { createdFromChallengeId: challenge.id },
    });
    return { rawToken: sessionRawToken, sessionId: session.id, customerId: challenge.customerId } as const;
  });
}

export async function createAnonymousGuestSession(pool: Pool, now = new Date()) {
  const rawToken = generateOpaqueToken();
  const tokenHash = await hashOpaqueToken(rawToken);
  const expiresAt = new Date(now.getTime() + GUEST_SESSION_LIFETIME_SECONDS * 1000);
  const session = await withTransaction(pool, (client) => createGuestSession(client, { tokenHash, expiresAt }));
  return { ...session, rawToken, expiresAt };
}

export async function logoutSession(pool: Pool, rawToken: string) {
  const tokenHash = await hashOpaqueToken(rawToken);
  return withTransaction(pool, async (client) => {
    const result = await client.query<{ id: string; customer_id: string }>(
      "SELECT id,customer_id FROM customer_sessions WHERE token_hash=$1 FOR UPDATE", [tokenHash],
    );
    const session = result.rows[0];
    if (!session) return false;
    await revokeSession(client, session.id, "LOGOUT");
    await appendAudit(client, {
      actorType: "CUSTOMER", actorId: session.customer_id, action: "SESSION_REVOKED",
      resourceType: "CUSTOMER_SESSION", resourceId: session.id,
      correlationId: correlationId("logout"), result: "SUCCEEDED",
      afterState: { reason: "LOGOUT" },
    });
    return true;
  });
}

export async function disableCustomerAccount(pool: Pool, customerId: string) {
  return withTransaction(pool, async (client) => {
    const disabled = await client.query(
      `UPDATE customers SET account_state='DISABLED'
       WHERE id=$1 AND account_state <> 'DISABLED' RETURNING id`, [customerId],
    );
    if (disabled.rowCount !== 1) return false;
    await revokeCustomerSessions(client, customerId, "ACCOUNT_DISABLED");
    await appendAudit(client, {
      actorType: "SYSTEM", actorId: "account-security", action: "ACCOUNT_DISABLED",
      resourceType: "CUSTOMER", resourceId: customerId,
      correlationId: correlationId("disable"), result: "SUCCEEDED",
      afterState: { accountState: "DISABLED" },
    });
    return true;
  });
}

export async function linkVerifiedIdentityWithAudit(
  pool: Pool,
  input: Readonly<{
    customerId: string;
    type: "VERIFIED_EMAIL" | "EXTERNAL_SUBJECT";
    value: string;
    provider?: string;
  }>,
) {
  return withTransaction(pool, async (client) => {
    const outcome = await linkVerifiedIdentity(client, input);
    await appendAudit(client, {
      actorType: "SYSTEM", actorId: "identity-linker", action: "VERIFIED_IDENTITY_LINKED",
      resourceType: "CUSTOMER", resourceId: input.customerId,
      correlationId: correlationId("identity"),
      result: outcome === "CONFLICT" ? "REJECTED" : "SUCCEEDED",
      afterState: { identityType: input.type, outcome },
    });
    return outcome;
  });
}

export async function claimGuestOrderForCustomer(pool: Pool, customerId: string, orderId: string) {
  return withTransaction(pool, async (client) => {
    const outcome = await claimGuestOrder(client, customerId, orderId);
    if (outcome === "CLAIMED") {
      await appendAudit(client, {
        actorType: "CUSTOMER", actorId: customerId, action: "GUEST_ORDER_CLAIMED",
        resourceType: "ORDER", resourceId: orderId,
        correlationId: correlationId("order-claim"), result: "SUCCEEDED",
        afterState: { customerId },
      });
    }
    return outcome;
  });
}
