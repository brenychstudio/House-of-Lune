export const markets = ["EU", "UK", "US"] as const;
export const currencies = ["EUR", "GBP", "USD"] as const;

export type Market = (typeof markets)[number];
export type Currency = (typeof currencies)[number];

const currencyByMarket = {
  EU: "EUR",
  UK: "GBP",
  US: "USD",
} as const satisfies Record<Market, Currency>;

export function parseMarket(value: string): Market {
  if (!markets.includes(value as Market)) {
    throw new Error(`Unsupported market: ${value}`);
  }

  return value as Market;
}

export function currencyForMarket(market: Market): Currency {
  return currencyByMarket[market];
}

export function isMarketCurrency(market: Market, currency: Currency): boolean {
  return currencyByMarket[market] === currency;
}
