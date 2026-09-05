import type { Currency, EntityId, Market, Money, Result, UtcTimestamp } from "@/modules/shared/valueObjects";

export const marketCurrency: Readonly<Record<Market, Currency>> = {
  EU: "EUR",
  UK: "GBP",
  US: "USD",
};

export type PriceBook = Readonly<{
  id: EntityId;
  market: Market;
  currency: Currency;
  revision: string;
  effectiveFrom: UtcTimestamp;
  effectiveUntil: UtcTimestamp | null;
  state: "DRAFT" | "ACTIVE" | "RETIRED";
}>;

export type PriceBookEntry = Readonly<{
  priceBookId: EntityId;
  variantId: EntityId;
  unitPrice: Money;
}>;

export function createPriceBook(input: Readonly<{
  market: Market;
  currency: Currency;
  revision: string;
}>): Result<typeof input> {
  if (marketCurrency[input.market] !== input.currency) {
    return {
      ok: false,
      error: {
        code: "MARKET_CURRENCY_MISMATCH",
        message: `${input.market} price books must use ${marketCurrency[input.market]}`,
      },
    };
  }
  if (!/^[a-z]{2}-\d{4}-\d{2}$/.test(input.revision)) {
    return { ok: false, error: { code: "INVALID_PRICE_BOOK_REVISION", message: "Price book revision is invalid" } };
  }
  return { ok: true, value: Object.freeze({ ...input }) };
}
