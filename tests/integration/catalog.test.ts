import { randomUUID } from "node:crypto";
import { expect, it } from "vitest";
import { isolatedPostgres } from "../helpers/postgres";
import { CatalogService } from "@/platform/db/services/catalogService";

const { pool } = isolatedPostgres();
const actor = { actorId: "br03-test", correlationId: randomUUID() };
const service = new CatalogService(pool, actor);
const token = () => randomUUID().replaceAll("-", "");
const variantInput = (productId: string) => ({ productId, sku: `TEST-${token().toUpperCase()}`,
  finishCode: "TEST-FINISH-A", finishName: "Synthetic finish", fulfillmentMode: "IN_STOCK" as const,
  leadTimeMinDays: null, leadTimeMaxDays: null });

it("creates, updates and archives a product with stable identity and audit receipts", async () => {
  const product = await service.createProduct({ slug: `test-${token()}`, name: "Synthetic object" });
  expect(product).toMatchObject({ status: "DRAFT", scarcityMode: "UNDECIDED", acquisitionMode: "NOT_FOR_SALE" });
  await expect(service.updateProduct(product.id, { name: "Synthetic", status: "ACTIVE", scarcityMode: "UNDECIDED", acquisitionMode: "PURCHASABLE" })).rejects.toThrow();
  const active = await service.updateProduct(product.id, { name: "Synthetic renamed", status: "ACTIVE", scarcityMode: "CORE", acquisitionMode: "PURCHASABLE" });
  expect(active).toMatchObject({ id: product.id, slug: product.slug, name: "Synthetic renamed", status: "ACTIVE" });
  expect(await service.archiveProduct(product.id)).toMatchObject({ status: "ARCHIVED", acquisitionMode: "NOT_FOR_SALE" });
  expect((await pool.query("SELECT action FROM audit_log WHERE resource_id=$1", [product.id])).rows).toHaveLength(3);
});

it("supports variant CRUD and rejects active variants on drafts or missing finish identities", async () => {
  const product = await service.createProduct({ slug: `test-${token()}`, name: "Synthetic" });
  const v = await service.createVariant(variantInput(product.id));
  expect(v).toMatchObject({ finishCode: "TEST-FINISH-A", active: false });
  await expect(service.setVariantActive(v.id, true)).rejects.toThrow();
  await service.updateProduct(product.id, { name: "Synthetic", status: "ACTIVE", scarcityMode: "CORE", acquisitionMode: "PURCHASABLE" });
  expect(await service.setVariantActive(v.id, true)).toMatchObject({ active: true });
  expect(await service.updateVariant(v.id, { finishName: "Renamed display", fulfillmentMode: "MADE_TO_ORDER", leadTimeMinDays: 3, leadTimeMaxDays: 7 })).toMatchObject({ finishCode: "TEST-FINISH-A", finishName: "Renamed display", leadTimeMinDays: 3 });
  expect(await service.setVariantActive(v.id, false)).toMatchObject({ active: false });
  await expect(pool.query("UPDATE variants SET finish_code='CHANGED' WHERE id=$1", [v.id])).rejects.toThrow();
  await expect(service.createVariant({ ...variantInput(product.id), finishCode: " " })).rejects.toThrow();
});

it("defines limited editions consistently and never assigns a cap to Core", async () => {
  const p = await service.createProduct({ slug: `test-${token()}`, name: "Synthetic" });
  const v = await service.createVariant(variantInput(p.id));
  await service.updateProduct(p.id, { name: "Synthetic", status: "DRAFT", scarcityMode: "CORE", acquisitionMode: "NOT_FOR_SALE" });
  await expect(service.defineEdition(v.id, 2)).rejects.toThrow();
  await service.updateProduct(p.id, { name: "Synthetic", status: "DRAFT", scarcityMode: "LIMITED", acquisitionMode: "NOT_FOR_SALE" });
  await service.defineEdition(v.id, 2);
  await service.defineEdition(v.id, 2);
  expect((await pool.query("SELECT edition_number,edition_size FROM editions WHERE variant_id=$1 ORDER BY edition_number", [v.id])).rows).toEqual([{ edition_number: 1, edition_size: 2 }, { edition_number: 2, edition_size: 2 }]);
  await expect(service.defineEdition(v.id, 3)).rejects.toThrow();
  await expect(service.updateProduct(p.id, { name: "Synthetic", status: "ACTIVE", scarcityMode: "CORE", acquisitionMode: "PURCHASABLE" })).rejects.toThrow();
  await expect(pool.query("INSERT INTO editions(variant_id,edition_number,edition_size) VALUES($1,3,3)", [v.id])).rejects.toThrow();
});

it("represents unique atelier inquiry without a stocked variant and enforces one-of-one edition size", async () => {
  const p = await service.createProduct({ slug: `test-${token()}`, name: "Synthetic commission" });
  await service.updateProduct(p.id, { name: p.name, status: "ACTIVE", scarcityMode: "UNIQUE_ATELIER", acquisitionMode: "INQUIRY_ONLY" });
  const v = await service.createVariant({ ...variantInput(p.id), fulfillmentMode: "BESPOKE" });
  await expect(service.defineEdition(v.id, 2)).rejects.toThrow();
  await service.defineEdition(v.id, 1);
  await service.defineEdition(v.id, 1);
  await service.setVariantActive(v.id, true);
  await service.archiveProduct(p.id);
  expect((await pool.query("SELECT active FROM variants WHERE id=$1", [v.id])).rows[0].active).toBe(false);
});

it("protects one-of-one allocation across competing variants", async () => {
  const p = await service.createProduct({ slug: `test-${token()}`, name: "Synthetic unique object" });
  await service.updateProduct(p.id, { name: p.name, status: "DRAFT", scarcityMode: "UNIQUE_ATELIER", acquisitionMode: "NOT_FOR_SALE" });
  const a = await service.createVariant(variantInput(p.id));
  const b = await service.createVariant({ ...variantInput(p.id), finishCode: "TEST-FINISH-B" });
  const outcomes = await Promise.allSettled([service.defineEdition(a.id, 1), service.defineEdition(b.id, 1)]);
  expect(outcomes.filter(outcome => outcome.status === "fulfilled")).toHaveLength(1);
  expect((await pool.query("SELECT count(*) FROM editions e JOIN variants v ON e.variant_id=v.id WHERE v.product_id=$1", [p.id])).rows[0].count).toBe("1");
});
