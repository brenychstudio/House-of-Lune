import { describe, expect, it } from "vitest";

import {
  canClaimGuestOrder,
  canReadOwnedOrder,
  canTransitionAccount,
  evaluateSession,
  normalizeCustomerEmail,
  validateAddress,
} from "@/modules/customers/account";
import { canMergeCustomerRecords } from "@/modules/customers/domain";

describe("customer identity and account invariants", () => {
  it("normalizes one canonical email policy without provider-specific alias rules", () => {
    expect(normalizeCustomerEmail("  Collector+MASK@Example.COM ")).toEqual({
      ok: true,
      value: "collector+mask@example.com",
    });
    expect(normalizeCustomerEmail("missing-domain@")).toMatchObject({ ok: false });
    expect(normalizeCustomerEmail("two@@example.com")).toMatchObject({ ok: false });
  });

  it("requires explicit customer lifecycle transitions", () => {
    expect(canTransitionAccount("GUEST", "INVITED")).toEqual({ ok: true, value: true });
    expect(canTransitionAccount("INVITED", "ACTIVE")).toEqual({ ok: true, value: true });
    expect(canTransitionAccount("ACTIVE", "DISABLED")).toEqual({ ok: true, value: true });
    expect(canTransitionAccount("GUEST", "ACTIVE")).toMatchObject({ ok: false });
    expect(canTransitionAccount("DISABLED", "ACTIVE")).toMatchObject({ ok: false });
  });

  it("fails sessions closed for idle, absolute, revoked, and disabled states", () => {
    const now = new Date("2026-09-06T12:00:00.000Z");
    const valid = {
      revokedAt: null,
      idleExpiresAt: new Date("2026-09-07T12:00:00.000Z"),
      absoluteExpiresAt: new Date("2026-10-01T12:00:00.000Z"),
      accountState: "ACTIVE" as const,
    };
    expect(evaluateSession(valid, now)).toEqual({ ok: true, value: true });
    expect(evaluateSession({ ...valid, idleExpiresAt: now }, now)).toMatchObject({ ok: false });
    expect(evaluateSession({ ...valid, absoluteExpiresAt: now }, now)).toMatchObject({ ok: false });
    expect(evaluateSession({ ...valid, revokedAt: now }, now)).toMatchObject({ ok: false });
    expect(evaluateSession({ ...valid, accountState: "DISABLED" }, now)).toMatchObject({ ok: false });
  });

  it("validates owner-scoped postal addresses and treats them as non-identity data", () => {
    expect(validateAddress({
      kind: "SHIPPING",
      recipientName: "A Collector",
      line1: "1 Carrer de la Forma",
      line2: null,
      city: "Barcelona",
      region: null,
      postalCode: "08001",
      countryCode: "ES",
    })).toMatchObject({ ok: true });
    expect(validateAddress({
      kind: "SHIPPING",
      recipientName: " ",
      line1: "1 Street",
      city: "London",
      postalCode: "SW1A",
      countryCode: "GBR",
    })).toMatchObject({ ok: false });
  });

  it("authorizes order reads only by canonical owner and claims only by verified email", () => {
    expect(canReadOwnedOrder("customer-a", "customer-a")).toBe(true);
    expect(canReadOwnedOrder("customer-a", "customer-b")).toBe(false);
    expect(canReadOwnedOrder("customer-a", null)).toBe(false);

    expect(canClaimGuestOrder({
      currentOwnerId: null,
      guestEmail: "owner@example.com",
      verifiedEmails: ["owner@example.com"],
    })).toEqual({ ok: true, value: true });
    expect(canClaimGuestOrder({
      currentOwnerId: null,
      guestEmail: "owner@example.com",
      verifiedEmails: ["other@example.com"],
    })).toMatchObject({ ok: false });
    expect(canClaimGuestOrder({
      currentOwnerId: "customer-b",
      guestEmail: "owner@example.com",
      verifiedEmails: ["owner@example.com"],
    })).toMatchObject({ ok: false });
  });

  it("never treats matching names as deterministic identity evidence", () => {
    expect(canMergeCustomerRecords({ name: "Same Name" }, { name: "Same Name" })).toMatchObject({
      ok: false,
      error: { code: "INSUFFICIENT_IDENTITY_EVIDENCE" },
    });
  });
});
