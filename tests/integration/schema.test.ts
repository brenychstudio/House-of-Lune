import { Pool, type PoolClient } from "pg";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL ?? "postgresql://postgres@127.0.0.1:54329/brenych_test",
});

async function inRollback(work: (client: PoolClient) => Promise<void>) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await work(client);
  } finally {
    await client.query("ROLLBACK").catch(() => undefined);
    client.release();
  }
}

async function rejectsConstraint(client: PoolClient, text: string, values: unknown[] = []) {
  await client.query("SAVEPOINT expected_constraint");
  try {
    await expect(client.query(text, values)).rejects.toMatchObject({ code: expect.stringMatching(/^23/) });
  } finally {
    await client.query("ROLLBACK TO SAVEPOINT expected_constraint");
  }
}

describe("canonical PostgreSQL schema", () => {
  beforeAll(async () => {
    await pool.query("SELECT 1");
  });

  afterAll(async () => {
    await pool.end();
  });

  it("contains every BR-02 canonical table", async () => {
    const expected = [
      "schema_migrations", "products", "variants", "editions", "physical_instances",
      "customers", "customer_identities", "addresses", "price_books", "price_book_entries",
      "carts", "cart_items", "orders", "order_items", "payments", "refunds",
      "inventory_items", "capacity_windows", "capacity_reservations", "production_recipes",
      "production_orders", "production_events", "shipments", "shipment_events", "returns",
      "return_events", "service_cases", "service_events", "warranty_claims", "outbox_events",
      "idempotency_records", "consumer_receipts", "audit_log",
    ];
    const result = await pool.query<{ table_name: string }>(
      "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name",
    );
    expect(result.rows.map(({ table_name }) => table_name)).toEqual(expect.arrayContaining(expected));
  });

  it("rejects duplicate product slugs and variant SKUs", async () => {
    await inRollback(async (client) => {
      const product = await client.query<{ id: string }>(
        "INSERT INTO products (slug, name) VALUES ('mask-01', 'MASK 01') RETURNING id",
      );
      await rejectsConstraint(client, "INSERT INTO products (slug, name) VALUES ('mask-01', 'Other')");
      await client.query(
        "INSERT INTO variants (product_id, sku, finish, fulfillment_mode) VALUES ($1, 'BR-M01-UNIQ', 'Silver', 'MADE_TO_ORDER')",
        [product.rows[0]?.id],
      );
      await rejectsConstraint(
        client,
        "INSERT INTO variants (product_id, sku, finish, fulfillment_mode) VALUES ($1, 'BR-M01-UNIQ', 'Chrome', 'MADE_TO_ORDER')",
        [product.rows[0]?.id],
      );
      expect(product.rows[0]?.id).toBeTruthy();
    });
  });

  it("rejects edition numbers outside their boundary and duplicate numbers", async () => {
    await inRollback(async (client) => {
      const product = await client.query<{ id: string }>(
        "INSERT INTO products (slug, name) VALUES ('mask-edition', 'MASK') RETURNING id",
      );
      const variant = await client.query<{ id: string }>(
        "INSERT INTO variants (product_id, sku, finish, fulfillment_mode) VALUES ($1, 'BR-M01-PS', 'Silver', 'MADE_TO_ORDER') RETURNING id",
        [product.rows[0]?.id],
      );
      await rejectsConstraint(
        client,
        "INSERT INTO editions (variant_id, edition_number, edition_size) VALUES ($1, 26, 25)",
        [variant.rows[0]?.id],
      );
      await client.query(
        "INSERT INTO editions (variant_id, edition_number, edition_size) VALUES ($1, 1, 25)",
        [variant.rows[0]?.id],
      );
      await rejectsConstraint(
        client,
        "INSERT INTO editions (variant_id, edition_number, edition_size) VALUES ($1, 1, 25)",
        [variant.rows[0]?.id],
      );
    });
  });

  it("rejects duplicate physical identities and edition allocation", async () => {
    await inRollback(async (client) => {
      const product = await client.query<{ id: string }>(
        "INSERT INTO products (slug, name) VALUES ('mask-instance', 'MASK') RETURNING id",
      );
      const variant = await client.query<{ id: string }>(
        "INSERT INTO variants (product_id, sku, finish, fulfillment_mode) VALUES ($1, 'BR-M01-INST', 'Silver', 'MADE_TO_ORDER') RETURNING id",
        [product.rows[0]?.id],
      );
      const edition = await client.query<{ id: string }>(
        "INSERT INTO editions (variant_id, edition_number, edition_size) VALUES ($1, 1, 25) RETURNING id",
        [variant.rows[0]?.id],
      );
      const values = [variant.rows[0]?.id, edition.rows[0]?.id, "BR-M01-PS-001", "r1", "r1", "r1"];
      await client.query(
        "INSERT INTO physical_instances (variant_id, edition_id, identity_code, design_revision_id, finish_revision_id, fit_revision_id) VALUES ($1,$2,$3,$4,$5,$6)",
        values,
      );
      await rejectsConstraint(
        client,
        "INSERT INTO physical_instances (variant_id, edition_id, identity_code, design_revision_id, finish_revision_id, fit_revision_id) VALUES ($1,$2,'BR-M01-PS-002',$3,$4,$5)",
        [values[0], values[1], values[3], values[4], values[5]],
      );
      await rejectsConstraint(
        client,
        "INSERT INTO physical_instances (variant_id, edition_id, identity_code, design_revision_id, finish_revision_id, fit_revision_id) VALUES ($1,NULL,$2,$3,$4,$5)",
        [values[0], values[2], values[3], values[4], values[5]],
      );
    });
  });

  it("rejects negative commercial amounts and invalid market currencies", async () => {
    await inRollback(async (client) => {
      await rejectsConstraint(
        client,
        "INSERT INTO price_books (market, currency, revision, effective_from) VALUES ('EU', 'USD', 'bad', now())",
      );
      await rejectsConstraint(
        client,
        "INSERT INTO payments (order_id, amount_minor, currency, state) VALUES (gen_random_uuid(), -1, 'EUR', 'AUTHORIZED')",
      );
    });
  });

  it("rejects negative inventory and oversubscribed capacity", async () => {
    await inRollback(async (client) => {
      const product = await client.query<{ id: string }>(
        "INSERT INTO products (slug, name) VALUES ('capacity-object', 'Capacity object') RETURNING id",
      );
      const variant = await client.query<{ id: string }>(
        "INSERT INTO variants (product_id, sku, finish, fulfillment_mode) VALUES ($1, 'BR-CAP-01', 'Raw', 'MADE_TO_ORDER') RETURNING id",
        [product.rows[0]?.id],
      );
      await rejectsConstraint(
        client,
        "INSERT INTO inventory_items (variant_id, on_hand, reserved) VALUES ($1, -1, 0)",
        [variant.rows[0]?.id],
      );
      await rejectsConstraint(
        client,
        "INSERT INTO capacity_windows (variant_id, starts_at, ends_at, total_units, reserved_units) VALUES ($1, now(), now() + interval '1 month', 1, 2)",
        [variant.rows[0]?.id],
      );
    });
  });
});
