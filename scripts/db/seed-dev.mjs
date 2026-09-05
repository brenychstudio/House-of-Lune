import pg from "pg";

const environment = process.env.BRENYCH_ENV ?? "development";
if (environment === "production") {
  throw new Error("Development seed is disabled in production");
}

const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL ?? "postgresql://postgres@127.0.0.1:54329/brenych_test",
  application_name: "brenych-development-seed",
});

try {
  const product = await pool.query(
    `INSERT INTO products (slug, name, status)
     VALUES ('mask-01', 'MASK 01', 'DRAFT')
     ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
     RETURNING id`,
  );
  await pool.query(
    `INSERT INTO variants (product_id, sku, finish, fulfillment_mode, active)
     VALUES ($1, 'BR-M01-FOUNDATION', 'Development foundation', 'MADE_TO_ORDER', false)
     ON CONFLICT (sku) DO UPDATE SET active = false`,
    [product.rows[0].id],
  );
  console.log("seeded non-sellable MASK 01 development foundation");
} finally {
  await pool.end();
}
