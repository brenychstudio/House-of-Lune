import { describe, expect, it } from "vitest";

import {
  currencyForMarket,
  isMarketCurrency,
  parseMarket,
} from "@/site/market/market";

describe("market and currency", () => {
  it.each([
    ["EU", "EUR"],
    ["UK", "GBP"],
    ["US", "USD"],
  ] as const)("maps %s to its deliberate price-book currency", (market, currency) => {
    expect(currencyForMarket(market)).toBe(currency);
    expect(isMarketCurrency(market, currency)).toBe(true);
  });

  it("does not derive a currency from a mismatched market", () => {
    expect(isMarketCurrency("EU", "USD")).toBe(false);
    expect(isMarketCurrency("UK", "EUR")).toBe(false);
    expect(isMarketCurrency("US", "GBP")).toBe(false);
  });

  it("rejects unsupported market input", () => {
    expect(() => parseMarket("CA")).toThrowError("Unsupported market: CA");
  });
});
