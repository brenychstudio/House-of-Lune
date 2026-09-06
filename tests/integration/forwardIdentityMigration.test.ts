import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { readdir } from "node:fs/promises";
import { join } from "node:path";

import { expect, it } from "vitest";

import { isolatedPostgres } from "../helpers/postgres";

const { pool, connectionString } = isolatedPostgres({ migrate: false });

it("migrates an accepted BR-03 database forward through BR-04 without reset", async () => {
  await pool.query(`CREATE TABLE schema_migrations (
    version text PRIMARY KEY,
    checksum char(64) NOT NULL,
    applied_at timestamptz NOT NULL DEFAULT now()
  )`);
  const migrationNames = await readdir(join(process.cwd(), "database", "migrations"));
  for (let index = 1; index <= 10; index += 1) {
    const prefix = index.toString().padStart(4, "0");
    const resolved = migrationNames.find((name) => name.startsWith(`${prefix}_`));
    if (!resolved) throw new Error(`Missing accepted migration ${prefix}`);
    const sql = readFileSync(join(process.cwd(), "database", "migrations", resolved), "utf8");
    await pool.query("BEGIN");
    try {
      await pool.query(sql);
      await pool.query(
        "INSERT INTO schema_migrations (version,checksum) VALUES ($1,$2)",
        [resolved.replace(/\.sql$/, ""), createHash("sha256").update(sql).digest("hex")],
      );
      await pool.query("COMMIT");
    } catch (error) {
      await pool.query("ROLLBACK");
      throw error;
    }
  }

  const output = execFileSync(process.execPath, ["scripts/db/migrate.mjs"], {
    env: { ...process.env, DATABASE_URL: connectionString }, stdio: "pipe",
  }).toString();
  expect(output).toContain("applied 0011_customer_sessions_and_passwordless");
  expect(output).toContain("applied 0012_customer_identity_hardening");
  expect(output).toContain("applied 0013_passkey_ready_credentials");
  expect(execFileSync(process.execPath, ["scripts/db/check.mjs"], {
    env: { ...process.env, DATABASE_URL: connectionString }, stdio: "pipe",
  }).toString()).toContain("38 tables, 13 migrations");
});
