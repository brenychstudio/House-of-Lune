import { execFileSync } from "node:child_process";
import { expect, it } from "vitest";
import { isolatedPostgres } from "../helpers/postgres";

const { pool, connectionString } = isolatedPostgres();
const execute = (file: string) => execFileSync(process.execPath, [file], {
  env: { ...process.env, DATABASE_URL: connectionString }, stdio: "pipe",
}).toString();

it("bootstraps PostgreSQL 17 from empty state and checks constraints plus checksums", async () => {
  expect((await pool.query("SHOW server_version")).rows[0].server_version).toMatch(/^17\./);
  expect(execute("scripts/db/check.mjs")).toContain("13 migrations");
  expect(execute("scripts/db/migrate.mjs")).toBe("");
});

it("refuses altered migration history and restores only the controlled test ledger", async () => {
  const before = (await pool.query("SELECT version,checksum FROM schema_migrations ORDER BY version LIMIT 1")).rows[0];
  try {
    await pool.query("UPDATE schema_migrations SET checksum=$1 WHERE version=$2", ["0".repeat(64), before.version]);
    expect(() => execute("scripts/db/migrate.mjs")).toThrow();
    expect(() => execute("scripts/db/check.mjs")).toThrow();
  } finally {
    await pool.query("UPDATE schema_migrations SET checksum=$1 WHERE version=$2", [before.checksum, before.version]);
  }
  expect(execute("scripts/db/check.mjs")).toContain("schema ok");
});
