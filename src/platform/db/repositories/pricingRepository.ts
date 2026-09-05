import type { PoolClient } from "pg";

import type { Currency, Market } from "@/modules/shared/valueObjects";

export async function createPriceBook(
  client: PoolClient,
  input: Readonly<{
    market: Market;
    currency: Currency;
    revision: string;
    effectiveFrom: Date;
    effectiveUntil?: Date;
  }>,
) {
  const result = await client.query<{ id: string; market: Market; currency: Currency }>(
    `INSERT INTO price_books (market, currency, revision, effective_from, effective_until)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, market, currency`,
    [input.market, input.currency, input.revision, input.effectiveFrom, input.effectiveUntil ?? null],
  );
  return result.rows[0]!;
}

export async function setVariantPrice(
  client: PoolClient,
  input: Readonly<{ priceBookId: string; variantId: string; unitPriceMinor: bigint }>,
) {
  await client.query(
    `INSERT INTO price_book_entries (price_book_id, variant_id, unit_price_minor)
     VALUES ($1, $2, $3)
     ON CONFLICT (price_book_id, variant_id)
     DO UPDATE SET unit_price_minor = EXCLUDED.unit_price_minor`,
    [input.priceBookId, input.variantId, input.unitPriceMinor.toString(10)],
  );
}

export async function activatePriceBook(client: PoolClient, priceBookId: string) {
  const target = await client.query<{ market: Market }>(
    "SELECT market FROM price_books WHERE id = $1 FOR UPDATE",
    [priceBookId],
  );
  if (target.rowCount !== 1) throw new Error("Price book not found");
  await client.query("UPDATE price_books SET state = 'RETIRED' WHERE market = $1 AND state = 'ACTIVE'", [
    target.rows[0]!.market,
  ]);
  await client.query("UPDATE price_books SET state = 'ACTIVE' WHERE id = $1", [priceBookId]);
}
