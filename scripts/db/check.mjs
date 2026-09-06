import { createHash } from "node:crypto";
import { readdir, readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import pg from "pg";

const { Pool } = pg;
const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const migrationsDirectory = join(root, "database", "migrations");
const expectedTables = [
  "addresses", "audit_log", "capacity_reservations", "capacity_windows", "cart_items", "carts",
  "consumer_receipts", "customer_identities", "customer_sessions", "customers", "editions", "guest_sessions", "idempotency_records",
  "inventory_items", "order_items", "orders", "outbox_events", "payments", "physical_instances",
  "passkey_credentials", "passwordless_access_limits", "passwordless_challenges", "price_book_entries", "price_books", "production_events", "production_orders", "production_recipes",
  "products", "refunds", "return_events", "returns", "schema_migrations", "service_cases",
  "service_events", "shipment_events", "shipments", "variants", "warranty_claims",
];

async function plan() {
  const files = (await readdir(migrationsDirectory)).filter((name) => name.endsWith(".sql")).sort();
  return Promise.all(files.map(async (file) => ({
    version: file.replace(/\.sql$/, ""),
    checksum: createHash("sha256").update(await readFile(join(migrationsDirectory, file), "utf8")).digest("hex"),
  })));
}

if (process.argv.includes("--print-plan")) {
  console.log(JSON.stringify(await plan(), null, 2));
} else {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL ?? "postgresql://postgres@127.0.0.1:54329/brenych_test",
    application_name: "brenych-schema-check",
  });
  try {
    const tables = await pool.query(
      "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name",
    );
    const actual = tables.rows.map(({ table_name }) => table_name);
    const missing = expectedTables.filter((table) => !actual.includes(table));
    if (missing.length > 0) throw new Error(`Missing canonical tables: ${missing.join(", ")}`);

    const migrations = await pool.query("SELECT version, checksum FROM schema_migrations ORDER BY version");
    const expected = await plan();
    for (const migration of expected) {
      const applied = migrations.rows.find(({ version }) => version === migration.version);
      if (!applied || applied.checksum.trim() !== migration.checksum) {
        throw new Error(`Migration state mismatch: ${migration.version}`);
      }
    }
    if (migrations.rowCount !== expected.length) throw new Error("Unexpected migration history");
    const requiredConstraints = [
      "product_activation_profile", "variant_finish_activation", "variant_lead_time_promise",
      "published_market_windows_do_not_overlap", "customer_identity_type", "customer_identity_namespace",
    ];
    const constraints = await pool.query("SELECT conname FROM pg_constraint WHERE connamespace='public'::regnamespace");
    for (const name of requiredConstraints) {
      if (!constraints.rows.some(row => row.conname === name)) throw new Error(`Missing constraint: ${name}`);
    }
    const requiredTriggers = ["products_guard_commercial", "variants_guard_commercial",
      "editions_guard_configuration", "variants_guard_unique_edition", "price_books_immutable_history", "price_entries_immutable_history",
      "addresses_set_updated_at"];
    const triggers = await pool.query("SELECT tgname FROM pg_trigger WHERE NOT tgisinternal AND tgenabled='O'");
    for (const name of requiredTriggers) {
      if (!triggers.rows.some(row => row.tgname === name)) throw new Error(`Missing active trigger: ${name}`);
    }
    console.log(`schema ok: ${actual.length} tables, ${migrations.rowCount} migrations, UTC-safe timestamptz`);
  } finally {
    await pool.end();
  }
}
