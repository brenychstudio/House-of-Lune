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
  const result = await client.query<{ id: string; market: Market; currency: Currency; revision: string }>(
    `INSERT INTO price_books (market, currency, revision, effective_from, effective_until)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, market, currency, revision`,
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
  const target = await client.query("UPDATE price_books SET state='PUBLISHED' WHERE id=$1 AND state='DRAFT' RETURNING id", [priceBookId]);
  if (target.rowCount !== 1) throw new Error("Draft price book not found");
}

export type ResolvedPrice = Readonly<{
  priceBookId: string; revision: string; market: Market; currency: Currency; minorUnits: string;
}>;
export type PriceResolution = { kind: "PRICE"; price: ResolvedPrice } | { kind: "NO_PRICE" };

export async function resolveVariantPrice(client: PoolClient, input: { variantId: string; market: Market; at: Date }): Promise<PriceResolution> {
  if (!Number.isFinite(input.at.getTime())) throw new Error("Invalid price resolution instant");
  const books = await client.query<{ id: string; revision: string; market: Market; currency: Currency }>(
    `SELECT id,revision,market,currency FROM price_books WHERE market=$1 AND state='PUBLISHED'
      AND effective_from<=$2 AND (effective_until IS NULL OR $2<effective_until)`,
    [input.market, input.at]);
  if (books.rows.length > 1) throw new Error("Conflicting applicable price books");
  const book = books.rows[0];
  if (!book) return { kind: "NO_PRICE" };
  const entry = (await client.query<{ unit_price_minor: string }>(
    "SELECT unit_price_minor FROM price_book_entries WHERE price_book_id=$1 AND variant_id=$2", [book.id, input.variantId])).rows[0];
  if (!entry) return { kind: "NO_PRICE" };
  return { kind: "PRICE", price: { priceBookId: book.id, revision: book.revision, market: book.market, currency: book.currency, minorUnits: entry.unit_price_minor } };
}
