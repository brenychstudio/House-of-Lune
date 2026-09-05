import { describe, expect, it } from "vitest";

import { createCartBinding, linkCartToCustomer } from "@/modules/cart/domain";
import { canMergeCustomerRecords } from "@/modules/customers/domain";
import { createMoney } from "@/modules/shared/valueObjects";
import { buildOrderSnapshot, transitionOrder } from "@/modules/orders/domain";
import { transitionProduction } from "@/modules/production/domain";
import { transitionReturn } from "@/modules/aftercare/domain";

function money(value: bigint, currency: "EUR" | "GBP" | "USD" = "EUR") {
  const result = createMoney(value, currency);
  if (!result.ok) throw new Error(result.error.message);
  return result.value;
}

describe("commerce aggregate invariants", () => {
  it("totals and deeply freezes the commercial truth captured by an order", () => {
    const source = {
      productId: "018f2dd0-30d2-7ad6-9a36-06b7f30461bd",
      productName: "MASK 01",
      variantId: "018f2dd0-30d2-7ad6-9a36-06b7f30461be",
      sku: "BR-M01-PS",
      finish: "Polished Silver",
      editionNumber: 7,
      unitPrice: money(89000n),
      quantity: 1,
      tax: money(18690n),
      duties: money(0n),
      shipping: money(2500n),
      discount: money(0n),
      priceBookRevision: "eu-2026-01",
      designRevisionId: "mask-01-r1",
    } as const;

    const result = buildOrderSnapshot(source);
    expect(result).toMatchObject({ ok: true });
    if (!result.ok) return;
    expect(result.value.total).toEqual(money(110190n));
    expect(Object.isFrozen(result.value)).toBe(true);
    expect(Object.isFrozen(result.value.unitPrice)).toBe(true);
    expect(() => Object.assign(result.value, { productName: "Changed" })).toThrow();
  });

  it("rejects illegal order transitions", () => {
    expect(transitionOrder("PENDING", "PAID")).toEqual({ ok: true, value: "PAID" });
    expect(transitionOrder("CANCELLED", "PAID")).toMatchObject({
      ok: false,
      error: { code: "ILLEGAL_TRANSITION" },
    });
  });

  it("preserves corrective QC history in the production state machine", () => {
    expect(transitionProduction("QUALITY_CONTROL", "RETURNED_TO_FINISHING")).toMatchObject({ ok: true });
    expect(transitionProduction("RETURNED_TO_FINISHING", "FINISHING")).toMatchObject({ ok: true });
    expect(transitionProduction("PACKAGED", "FABRICATION")).toMatchObject({ ok: false });
  });

  it("supports the return lifecycle without skipping inspection", () => {
    expect(transitionReturn("REQUESTED", "AUTHORIZED")).toMatchObject({ ok: true });
    expect(transitionReturn("RECEIVED", "REFUNDED")).toMatchObject({ ok: false });
    expect(transitionReturn("INSPECTED", "REFUNDED")).toMatchObject({ ok: true });
  });

  it("keeps guest and customer cart bindings explicit", () => {
    const guest = createCartBinding({ guestToken: "guest_01J77D8J19N3TBW9TQG7J2CRHH" });
    expect(guest).toEqual({ kind: "guest", guestToken: "guest_01J77D8J19N3TBW9TQG7J2CRHH" });
    expect(linkCartToCustomer(guest, "018f2dd0-30d2-7ad6-9a36-06b7f30461bf")).toEqual({
      kind: "customer",
      customerId: "018f2dd0-30d2-7ad6-9a36-06b7f30461bf",
    });
  });

  it("never merges customer records based on a name alone", () => {
    expect(canMergeCustomerRecords({ name: "Ada" }, { name: "Ada" })).toEqual({
      ok: false,
      error: { code: "INSUFFICIENT_IDENTITY_EVIDENCE", message: expect.any(String) },
    });
    expect(
      canMergeCustomerRecords(
        { name: "Ada", verifiedEmail: "ada@example.com" },
        { name: "A. L.", verifiedEmail: "ada@example.com" },
      ),
    ).toEqual({ ok: true, value: true });
  });
});
