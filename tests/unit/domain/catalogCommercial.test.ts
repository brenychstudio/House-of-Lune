import { describe, expect, it } from "vitest";
import { validateCommercialProfile, validateVariantConfiguration } from "@/modules/catalog/commercial";
import { deriveAvailability } from "@/modules/catalog/availability";
import { validatePriceWindow } from "@/modules/pricing/domain";

describe("commercial activation", () => {
  it("keeps undecided objects strictly noncommercial", () => {
    expect(() => validateCommercialProfile({ status: "DRAFT", scarcityMode: "UNDECIDED", acquisitionMode: "NOT_FOR_SALE" })).not.toThrow();
    expect(() => validateCommercialProfile({ status: "ACTIVE", scarcityMode: "UNDECIDED", acquisitionMode: "PURCHASABLE" })).toThrow();
    expect(() => validateCommercialProfile({ status: "DRAFT", scarcityMode: "CORE", acquisitionMode: "PURCHASABLE" })).toThrow();
    expect(() => validateCommercialProfile({ status: "ACTIVE", scarcityMode: "UNDECIDED", acquisitionMode: "INQUIRY_ONLY" })).toThrow();
  });
  it.each(["CORE", "LIMITED", "UNIQUE_ATELIER"] as const)("supports approved %s acquisition", (scarcityMode) => {
    expect(() => validateCommercialProfile({ status: "ACTIVE", scarcityMode, acquisitionMode: "INQUIRY_ONLY" })).not.toThrow();
  });
  it("requires a stable finish identity and coherent nullable promise", () => {
    const config = { finishCode: "TEST-FINISH-A", finishName: "Synthetic finish", fulfillmentMode: "MADE_TO_ORDER" as const, leadTimeMinDays: null, leadTimeMaxDays: null };
    expect(() => validateVariantConfiguration(config)).not.toThrow();
    expect(() => validateVariantConfiguration({ ...config, finishCode: "Display name" })).toThrow();
    expect(() => validateVariantConfiguration({ ...config, finishName: " " })).toThrow();
    expect(() => validateVariantConfiguration({ ...config, leadTimeMinDays: 4, leadTimeMaxDays: 3 })).toThrow();
    expect(() => validateVariantConfiguration({ ...config, leadTimeMinDays: 4 })).toThrow();
  });
});

describe("effective price windows", () => {
  it("rejects invalid, empty and reversed windows", () => {
    expect(() => validatePriceWindow(new Date("invalid"), null)).toThrow();
    expect(() => validatePriceWindow(new Date("2026-01-01"), new Date("2026-01-01"))).toThrow();
    expect(() => validatePriceWindow(new Date("2026-01-02"), new Date("2026-01-01"))).toThrow();
    expect(() => validatePriceWindow(new Date("2026-01-01"), null)).not.toThrow();
  });
});

describe("derived availability fails closed", () => {
  const base = { status: "ACTIVE" as const, scarcityMode: "CORE" as const, acquisitionMode: "PURCHASABLE" as const,
    variantActive: true, fulfillmentMode: "IN_STOCK" as const, hasPrice: true, inventoryAvailable: 1,
    capacityAvailable: 0, editionAvailable: 0, editionSize: null, leadTimeMinDays: null, leadTimeMaxDays: null };
  it("requires approved state, active variant and an actual applicable price", () => {
    expect(deriveAvailability(base)).toBe("IN_STOCK");
    expect(deriveAvailability({ ...base, status: "DRAFT" })).toBe("NOT_FOR_SALE");
    expect(deriveAvailability({ ...base, variantActive: false })).toBe("UNAVAILABLE");
    expect(deriveAvailability({ ...base, hasPrice: false })).toBe("UNAVAILABLE");
    expect(deriveAvailability({ ...base, inventoryAvailable: 0 })).toBe("SOLD_OUT");
  });
  it("requires capacity and approved promise for made-to-order; never infers it from zero stock", () => {
    const mto = { ...base, fulfillmentMode: "MADE_TO_ORDER" as const, inventoryAvailable: 0, capacityAvailable: 1 };
    expect(deriveAvailability(mto)).toBe("UNAVAILABLE");
    expect(deriveAvailability({ ...mto, leadTimeMinDays: 3, leadTimeMaxDays: 7 })).toBe("MADE_TO_ORDER");
    expect(deriveAvailability({ ...mto, leadTimeMinDays: 3, leadTimeMaxDays: 7, capacityAvailable: 0 })).toBe("UNAVAILABLE");
  });
  it("respects finite editions and inquiry policy independently of price", () => {
    expect(deriveAvailability({ ...base, scarcityMode: "LIMITED", editionSize: 2 })).toBe("SOLD_OUT");
    expect(deriveAvailability({ ...base, scarcityMode: "LIMITED", editionSize: 2, editionAvailable: 1 })).toBe("IN_STOCK");
    expect(deriveAvailability({ ...base, acquisitionMode: "INQUIRY_ONLY", hasPrice: false })).toBe("INQUIRY");
    expect(deriveAvailability({ ...base, fulfillmentMode: "BESPOKE", hasPrice: false })).toBe("INQUIRY");
  });
});
