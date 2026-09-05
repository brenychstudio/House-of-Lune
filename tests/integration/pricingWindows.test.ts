import { randomUUID } from "node:crypto";
import { expect, it } from "vitest";
import { isolatedPostgres } from "../helpers/postgres";
import { CatalogService } from "@/platform/db/services/catalogService";
import { PricingService } from "@/platform/db/services/pricingService";
import { withTransaction } from "@/platform/db/transaction";

const { pool } = isolatedPostgres();
const actor = { actorId: "pricing-test", correlationId: randomUUID() };
const pricing = new PricingService(pool, actor);
const catalog = new CatalogService(pool, actor);
const revision = () => `test-${randomUUID()}`;
// Far-future finite synthetic windows avoid collisions with accepted BR-02 fixtures.
const day = 20000;
const at = (offset: number) => new Date((day + offset) * 86400000);
async function variant() {
  const p = await catalog.createProduct({ slug: revision(), name: "Synthetic pricing object" });
  return catalog.createVariant({ productId: p.id, sku: revision().toUpperCase(), finishCode: "TEST-FINISH-A",
    finishName: "Synthetic", fulfillmentMode: "IN_STOCK", leadTimeMinDays: null, leadTimeMaxDays: null });
}

it.each([["EU", "EUR"], ["UK", "GBP"], ["US", "USD"]] as const)("resolves %s/%s historical and future prices at half-open boundaries", async (market, currency) => {
  const v = await variant();
  const first = await pricing.createBook({ market, currency, revision: revision(), effectiveFrom: at(0), effectiveUntil: at(1) });
  const second = await pricing.createBook({ market, currency, revision: revision(), effectiveFrom: at(1), effectiveUntil: at(2) });
  await pricing.setPrice({ priceBookId: first.id, variantId: v.id, unitPriceMinor: 12345n });
  await pricing.setPrice({ priceBookId: second.id, variantId: v.id, unitPriceMinor: 23456n });
  expect(await pricing.resolvePrice({ variantId: v.id, market, at: at(0) })).toEqual({ kind: "NO_PRICE" });
  await pricing.publishBook(first.id);
  await pricing.publishBook(second.id);
  expect(await pricing.resolvePrice({ variantId: v.id, market, at: at(0) })).toMatchObject({ kind: "PRICE", price: { currency, minorUnits: "12345", revision: first.revision } });
  expect(await pricing.resolvePrice({ variantId: v.id, market, at: at(1) })).toMatchObject({ kind: "PRICE", price: { currency, minorUnits: "23456" } });
  expect(await pricing.resolvePrice({ variantId: v.id, market, at: at(2) })).toEqual({ kind: "NO_PRICE" });
  expect(await pricing.resolvePrice({ variantId: randomUUID(), market, at: at(0) })).toEqual({ kind: "NO_PRICE" });
});

it("updates drafts but freezes published windows and price entries", async () => {
  const v = await variant();
  const b = await pricing.createBook({ market: "UK", currency: "GBP", revision: revision(), effectiveFrom: at(5), effectiveUntil: at(6) });
  await pricing.updateBook(b.id, { market: "UK", currency: "GBP", revision: revision(), effectiveFrom: at(5), effectiveUntil: at(7) });
  await pricing.setPrice({ priceBookId: b.id, variantId: v.id, unitPriceMinor: 100n });
  await pricing.setPrice({ priceBookId: b.id, variantId: v.id, unitPriceMinor: 200n });
  await pricing.publishBook(b.id);
  await expect(pricing.setPrice({ priceBookId: b.id, variantId: v.id, unitPriceMinor: 300n })).rejects.toThrow();
  await expect(pricing.updateBook(b.id, { market: "UK", currency: "GBP", revision: revision(), effectiveFrom: at(5), effectiveUntil: at(8) })).rejects.toThrow();
  await expect(pool.query("DELETE FROM price_book_entries WHERE price_book_id=$1", [b.id])).rejects.toThrow();
  await expect(pool.query("UPDATE price_books SET state='DRAFT' WHERE id=$1", [b.id])).rejects.toThrow();
});

it("rejects market/currency mismatch, invalid windows and negative prices", async () => {
  await expect(pricing.createBook({ market: "EU", currency: "USD", revision: revision(), effectiveFrom: at(0), effectiveUntil: at(1) })).rejects.toThrow();
  await expect(pricing.createBook({ market: "EU", currency: "EUR", revision: "", effectiveFrom: at(1), effectiveUntil: at(0) })).rejects.toThrow();
  const v = await variant();
  const b = await pricing.createBook({ market: "US", currency: "USD", revision: revision(), effectiveFrom: at(9), effectiveUntil: at(10) });
  await expect(pricing.setPrice({ priceBookId: b.id, variantId: v.id, unitPriceMinor: -1n })).rejects.toThrow();
});

it("rejects a sequential overlapping publish without replacing historical commercial truth", async () => {
  const a = await pricing.createBook({ market: "EU", currency: "EUR", revision: revision(), effectiveFrom: at(30), effectiveUntil: at(32) });
  const b = await pricing.createBook({ market: "EU", currency: "EUR", revision: revision(), effectiveFrom: at(31), effectiveUntil: at(33) });
  await pricing.publishBook(a.id);
  await expect(pricing.publishBook(b.id)).rejects.toMatchObject({ code: "23P01" });
  expect((await pool.query("SELECT state FROM price_books WHERE id=$1", [a.id])).rows[0].state).toBe("PUBLISHED");
  expect((await pool.query("SELECT state FROM price_books WHERE id=$1", [b.id])).rows[0].state).toBe("DRAFT");
});

it("allows only one simultaneous overlapping publication even through direct SQL", async () => {
  const a = await pricing.createBook({ market: "US", currency: "USD", revision: revision(), effectiveFrom: at(20), effectiveUntil: at(22) });
  const b = await pricing.createBook({ market: "US", currency: "USD", revision: revision(), effectiveFrom: at(21), effectiveUntil: at(23) });
  let ready = 0;
  let release!: () => void;
  const barrier = new Promise<void>((resolve) => { release = resolve; });
  const publish = (id: string) => withTransaction(pool, async (client) => {
    if (++ready === 2) release();
    await barrier;
    await client.query("UPDATE price_books SET state='PUBLISHED' WHERE id=$1", [id]);
  });
  const outcomes = await Promise.allSettled([publish(a.id), publish(b.id)]);
  expect(outcomes.filter(r => r.status === "fulfilled")).toHaveLength(1);
  expect(outcomes.find(r => r.status === "rejected")).toMatchObject({ reason: { code: "23P01" } });
});
