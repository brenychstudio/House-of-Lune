import { describe, expect, it } from "vitest";

import {
  addMoney,
  createMoney,
  moneyToJSON,
  normalizeEmail,
  parseSku,
  parseSlug,
  parseUtcTimestamp,
} from "@/modules/shared/valueObjects";

describe("commerce value objects", () => {
  it("stores money as integer minor units and serializes bigint as a decimal string", () => {
    const money = createMoney(123n, "EUR");
    expect(money).toEqual({ ok: true, value: { minorUnits: 123n, currency: "EUR" } });
    if (money.ok) {
      expect(moneyToJSON(money.value)).toEqual({ minorUnits: "123", currency: "EUR" });
    }

    expect(createMoney(1.25, "EUR")).toMatchObject({ ok: false });
    expect(createMoney(1n, "CAD")).toMatchObject({ ok: false });
  });

  it("adds only matching non-negative monetary values", () => {
    const first = createMoney(120n, "GBP");
    const second = createMoney(30n, "GBP");
    if (!first.ok || !second.ok) throw new Error("test setup failed");

    expect(addMoney(first.value, second.value)).toEqual({
      ok: true,
      value: { minorUnits: 150n, currency: "GBP" },
    });
    expect(createMoney(-1n, "GBP")).toMatchObject({ ok: false });
  });

  it("validates canonical SKU and slug forms", () => {
    expect(parseSku("BR-M01-PS-001")).toMatchObject({ ok: true });
    expect(parseSku("br m01")).toMatchObject({ ok: false });
    expect(parseSlug("mask-01")).toMatchObject({ ok: true });
    expect(parseSlug("Mask 01")).toMatchObject({ ok: false });
  });

  it("normalizes email without treating a matching name as identity", () => {
    expect(normalizeEmail("  Founder@BRENYCH.com ")).toEqual({
      ok: true,
      value: "founder@brenych.com",
    });
    expect(normalizeEmail("not-an-email")).toMatchObject({ ok: false });
  });

  it("requires timestamps to include an explicit UTC offset and normalizes to UTC", () => {
    expect(parseUtcTimestamp("2026-09-05T10:30:00+02:00")).toEqual({
      ok: true,
      value: "2026-09-05T08:30:00.000Z",
    });
    expect(parseUtcTimestamp("2026-09-05T10:30:00")).toMatchObject({ ok: false });
  });
});
