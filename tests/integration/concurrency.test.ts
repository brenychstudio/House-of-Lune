import { randomUUID } from "node:crypto";

import { Pool, type PoolClient } from "pg";
import { afterAll, describe, expect, it } from "vitest";

import { createProduct, createVariant } from "@/platform/db/repositories/catalogRepository";
import { reserveCapacity, reserveEdition } from "@/platform/db/repositories/inventoryRepository";
import { withTransaction } from "@/platform/db/transaction";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL ?? "postgresql://postgres@127.0.0.1:54329/brenych_test",
  max: 4,
});

async function variantFixture() {
  return withTransaction(pool, async (client) => {
    const token = randomUUID().replaceAll("-", "").slice(0, 12).toUpperCase();
    const product = await createProduct(client, { slug: `concurrency-${token.toLowerCase()}`, name: "Concurrent" });
    return createVariant(client, {
      productId: product.id,
      sku: `BR-${token}-CC`,
      finish: "Test",
      fulfillmentMode: "MADE_TO_ORDER",
    });
  });
}

function barrier(parties: number) {
  let ready = 0;
  let release!: () => void;
  const gate = new Promise<void>((resolve) => { release = resolve; });
  return async () => {
    ready += 1;
    if (ready === parties) release();
    await gate;
  };
}

async function contend(work: (client: PoolClient) => Promise<boolean>) {
  const synchronize = barrier(2);
  const run = async () => withTransaction(pool, async (client) => {
    await synchronize();
    return work(client);
  });
  return Promise.all([run(), run()]);
}

afterAll(async () => pool.end());

describe("atomic reservation concurrency", () => {
  it("allows exactly one contender to reserve the final edition", async () => {
    const variant = await variantFixture();
    const edition = await pool.query<{ id: string }>(
      "INSERT INTO editions (variant_id, edition_number, edition_size) VALUES ($1, 1, 1) RETURNING id",
      [variant.id],
    );
    const results = await contend((client) => reserveEdition(client, edition.rows[0]!.id, new Date(Date.now() + 60_000)));
    expect(results.sort()).toEqual([false, true]);
  });

  it("allows exactly one contender to reserve the final capacity unit", async () => {
    const variant = await variantFixture();
    const window = await pool.query<{ id: string }>(
      "INSERT INTO capacity_windows (variant_id, starts_at, ends_at, total_units) VALUES ($1, now(), now() + interval '1 month', 1) RETURNING id",
      [variant.id],
    );
    const results = await contend((client) => reserveCapacity(client, window.rows[0]!.id, 1));
    expect(results.sort()).toEqual([false, true]);
  });
});
