import { createHash } from "node:crypto";
import { readdir, readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import pg from "pg";

const { Pool } = pg;
const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const migrationsDirectory = join(root, "database", "migrations");
const connectionString = process.env.DATABASE_URL ?? "postgresql://postgres@127.0.0.1:54329/brenych_test";

export async function migrationPlan() {
  const names = (await readdir(migrationsDirectory))
    .filter((name) => /^\d{4}_[a-z0-9_]+\.sql$/.test(name))
    .sort();

  return Promise.all(
    names.map(async (name) => {
      const sql = await readFile(join(migrationsDirectory, name), "utf8");
      return {
        version: name.replace(/\.sql$/, ""),
        checksum: createHash("sha256").update(sql).digest("hex"),
        sql,
      };
    }),
  );
}

export async function migrate() {
  const pool = new Pool({ connectionString, application_name: "brenych-migrations", max: 1 });
  const client = await pool.connect();
  try {
    await client.query("SET TIME ZONE 'UTC'");
    await client.query("SELECT pg_advisory_lock(hashtext('brenych_schema_migrations'))");
    await client.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        version text PRIMARY KEY,
        checksum char(64) NOT NULL,
        applied_at timestamptz NOT NULL DEFAULT now()
      )
    `);

    for (const migration of await migrationPlan()) {
      const current = await client.query(
        "SELECT checksum FROM schema_migrations WHERE version = $1",
        [migration.version],
      );
      if (current.rowCount === 1) {
        if (current.rows[0].checksum.trim() !== migration.checksum) {
          throw new Error(`Migration checksum mismatch: ${migration.version}`);
        }
        continue;
      }

      await client.query("BEGIN");
      try {
        await client.query(migration.sql);
        await client.query(
          "INSERT INTO schema_migrations (version, checksum) VALUES ($1, $2)",
          [migration.version, migration.checksum],
        );
        await client.query("COMMIT");
        console.log(`applied ${migration.version}`);
      } catch (error) {
        await client.query("ROLLBACK");
        throw error;
      }
    }
  } finally {
    await client.query("SELECT pg_advisory_unlock(hashtext('brenych_schema_migrations'))").catch(() => undefined);
    client.release();
    await pool.end();
  }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  migrate().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
