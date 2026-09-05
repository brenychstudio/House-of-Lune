import pg from "pg";

const environment = process.env.BRENYCH_ENV ?? "development";
if (environment !== "development") {
  throw new Error("Development seed is permitted only in development");
}

const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL ?? "postgresql://postgres@127.0.0.1:54329/brenych_test",
  application_name: "brenych-development-seed",
});

try {
  const product = await pool.query(
    `INSERT INTO products (slug, name, status, scarcity_mode, acquisition_mode)
     VALUES ('mask-01', 'MASK 01', 'DRAFT', 'UNDECIDED', 'NOT_FOR_SALE')
     ON CONFLICT (slug) DO NOTHING`,
  );
  const canonical = (await pool.query(`SELECT p.*,(SELECT count(*) FROM variants WHERE product_id=p.id) AS variant_count
    FROM products p WHERE slug='mask-01'`)).rows[0];
  if (canonical.name !== "MASK 01" || canonical.status !== "DRAFT" ||
      canonical.scarcity_mode !== "UNDECIDED" || canonical.acquisition_mode !== "NOT_FOR_SALE" ||
      canonical.variant_count !== "0") {
    throw new Error("Existing MASK 01 differs from the authorized product-only seed; review without overwriting");
  }
  console.log(`MASK 01 DRAFT / UNDECIDED / NOT_FOR_SALE; product only (${product.rowCount ? "created" : "unchanged"})`);
} finally {
  await pool.end();
}
