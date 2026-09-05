import { randomUUID } from "node:crypto";
import { execFileSync } from "node:child_process";
import { expect, it } from "vitest";
import { isolatedPostgres } from "../helpers/postgres";
import { CatalogService } from "@/platform/db/services/catalogService";
import { PricingService } from "@/platform/db/services/pricingService";
import { getPublicObjectBySlug, listPublicObjects, getDevelopmentObjectBySlug } from "@/platform/db/queries/publicCatalog";

const { pool, connectionString } = isolatedPostgres();
const actor = { actorId: "catalog-query-test", correlationId: randomUUID() };
const catalog = new CatalogService(pool, actor);
const pricing = new PricingService(pool, actor);
const at = new Date("2030-01-01T00:00:00Z");
const context = { market: "EU" as const, at };
let priceBookId: string;

async function fixture(mode: "IN_STOCK" | "MADE_TO_ORDER" = "IN_STOCK") {
  const id = randomUUID();
  const p = await catalog.createProduct({ slug: `test-${id}`, name: "Synthetic public object" });
  const v = await catalog.createVariant({ productId: p.id, sku: `TEST-${id.toUpperCase()}`, finishCode: "TEST-FINISH-A",
    finishName: "Synthetic finish", fulfillmentMode: mode, leadTimeMinDays: null, leadTimeMaxDays: null });
  return { p, v };
}

it("excludes unpublished products and strips all draft commercial detail even in development identity queries", async () => {
  const { p } = await fixture();
  expect(await getPublicObjectBySlug(pool, p.slug, context)).toBeNull();
  expect((await listPublicObjects(pool, context)).find(x => x.productId === p.id)).toBeUndefined();
  // Only the explicitly named MASK 01 development presentation is eligible.
  expect(await getDevelopmentObjectBySlug(pool, p.slug, "development")).toBeNull();
});

it("uses actual inventory, retains stable IDs, and hides deactivated variants", async () => {
  const { p, v } = await fixture();
  const book = await pricing.createBook({ market: "EU", currency: "EUR", revision: "test-public-2030",
    effectiveFrom: new Date("2029-01-01Z"), effectiveUntil: new Date("2031-01-01Z") });
  priceBookId = book.id;
  await pricing.setPrice({ priceBookId, variantId: v.id, unitPriceMinor: 54321n });
  await pricing.publishBook(priceBookId);
  await catalog.updateProduct(p.id, { name: p.name, status: "ACTIVE", scarcityMode: "CORE", acquisitionMode: "PURCHASABLE" });
  await catalog.setVariantActive(v.id, true);
  await pool.query("INSERT INTO inventory_items(variant_id,on_hand,reserved) VALUES($1,2,1)", [v.id]);
  const object = await getPublicObjectBySlug(pool, p.slug, context);
  expect(object).toMatchObject({ productId: p.id, productSlug: p.slug, variants: [{
    variantId: v.id, finishCode: "TEST-FINISH-A", availability: "IN_STOCK", price: { currency: "EUR", minorUnits: "54321" },
  }] });
  await pool.query("UPDATE inventory_items SET reserved=2 WHERE variant_id=$1", [v.id]);
  expect((await getPublicObjectBySlug(pool, p.slug, context))!.variants[0]!.availability).toBe("SOLD_OUT");
  await catalog.setVariantActive(v.id, false);
  expect((await getPublicObjectBySlug(pool, p.slug, context))!.variants).toEqual([]);
  await catalog.archiveProduct(p.id);
  expect(await getPublicObjectBySlug(pool, p.slug, context)).toBeNull();
});

it("requires capacity within an approved lead-time promise and applicable market price", async () => {
  const { p, v } = await fixture("MADE_TO_ORDER");
  const book = await pricing.createBook({ market: "UK", currency: "GBP", revision: "test-mto-2030",
    effectiveFrom: new Date("2029-01-01Z"), effectiveUntil: new Date("2031-01-01Z") });
  await pricing.setPrice({ priceBookId: book.id, variantId: v.id, unitPriceMinor: 65432n });
  await pricing.publishBook(book.id);
  await catalog.updateProduct(p.id, { name: p.name, status: "ACTIVE", scarcityMode: "CORE", acquisitionMode: "PURCHASABLE" });
  await catalog.setVariantActive(v.id, true);
  const query = () => getPublicObjectBySlug(pool, p.slug, { ...context, market: "UK" });
  await pool.query("INSERT INTO capacity_windows(variant_id,starts_at,ends_at,total_units) VALUES($1,$2,$3,1)", [v.id, at, new Date("2030-01-06Z")]);
  expect((await query())!.variants[0]!.availability).toBe("UNAVAILABLE");
  await catalog.updateVariant(v.id, { finishName: v.finishName, fulfillmentMode: "MADE_TO_ORDER", leadTimeMinDays: 3, leadTimeMaxDays: 7 });
  expect((await query())!.variants[0]).toMatchObject({ availability: "MADE_TO_ORDER", madeToOrder: { minDays: 3, maxDays: 7 } });
  expect((await getPublicObjectBySlug(pool, p.slug, context))!.variants[0]!.availability).toBe("UNAVAILABLE");
  await pool.query("UPDATE capacity_windows SET reserved_units=1 WHERE variant_id=$1", [v.id]);
  expect((await query())!.variants[0]!.availability).toBe("UNAVAILABLE");
});

it("seeds exactly one noncommercial MASK 01 idempotently and denies production or preview seeding", async () => {
  const run = (environment: string) => execFileSync(process.execPath, ["scripts/db/seed-dev.mjs"], {
    env: { ...process.env, DATABASE_URL: connectionString, BRENYCH_ENV: environment }, stdio: "pipe",
  });
  run("development");
  const first = (await pool.query("SELECT id FROM products WHERE slug='mask-01'")).rows[0].id;
  run("development");
  expect((await pool.query("SELECT id,status,scarcity_mode,acquisition_mode FROM products WHERE slug='mask-01'")).rows).toEqual([
    { id: first, status: "DRAFT", scarcity_mode: "UNDECIDED", acquisition_mode: "NOT_FOR_SALE" },
  ]);
  expect((await pool.query("SELECT 1 FROM variants WHERE product_id=$1", [first])).rowCount).toBe(0);
  expect(() => run("production")).toThrow();
  expect(() => run("preview")).toThrow();
  expect(await getPublicObjectBySlug(pool, "mask-01", context)).toBeNull();
  expect(await getDevelopmentObjectBySlug(pool, "mask-01", "production")).toBeNull();
  expect(await getDevelopmentObjectBySlug(pool, "mask-01", "development")).toEqual({
    productId: first, productSlug: "mask-01", name: "MASK 01", status: "DRAFT",
    scarcityMode: "UNDECIDED", acquisitionMode: "NOT_FOR_SALE", availability: "NOT_FOR_SALE", variants: [],
  });
});

it("derives limited sold-out state from edition reservations even with physical stock", async () => {
  const { p, v } = await fixture();
  await catalog.updateProduct(p.id, { name: p.name, status: "DRAFT", scarcityMode: "LIMITED", acquisitionMode: "NOT_FOR_SALE" });
  await catalog.defineEdition(v.id, 1);
  const book = await pricing.createBook({ market: "US", currency: "USD", revision: "test-limited-2030",
    effectiveFrom: new Date("2029-01-01Z"), effectiveUntil: new Date("2031-01-01Z") });
  await pricing.setPrice({ priceBookId: book.id, variantId: v.id, unitPriceMinor: 87654n });
  await pricing.publishBook(book.id);
  await catalog.updateProduct(p.id, { name: p.name, status: "ACTIVE", scarcityMode: "LIMITED", acquisitionMode: "PURCHASABLE" });
  await catalog.setVariantActive(v.id, true);
  await pool.query("INSERT INTO inventory_items(variant_id,on_hand) VALUES($1,1)", [v.id]);
  const query = () => getPublicObjectBySlug(pool, p.slug, { ...context, market: "US" });
  expect((await query())!.variants[0]).toMatchObject({ availability: "IN_STOCK", edition: { size: 1, remaining: 1 } });
  await pool.query("UPDATE editions SET state='RESERVED',reserved_until=$2 WHERE variant_id=$1", [v.id, new Date("2030-01-02Z")]);
  expect((await query())!.variants[0]!.availability).toBe("SOLD_OUT");
  await pool.query("UPDATE editions SET state='ALLOCATED' WHERE variant_id=$1", [v.id]);
  expect((await query())!.variants[0]!.availability).toBe("SOLD_OUT");
});
