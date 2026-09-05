import { randomUUID } from "node:crypto";
import { execFileSync } from "node:child_process";
import { Pool } from "pg";
import { beforeAll, afterAll } from "vitest";

// Each suite owns this explicitly named disposable database, never the configured source DB.
export function isolatedPostgres() {
  const url = new URL(process.env.DATABASE_URL ?? "postgresql://postgres@127.0.0.1:54329/brenych_test");
  const name = `br03_test_${randomUUID().replaceAll("-", "")}`;
  const admin = new Pool({ connectionString: url.toString() });
  url.pathname = `/${name}`;
  const pool = new Pool({ connectionString: url.toString() });
  let created = false;
  beforeAll(async () => {
    if (process.env.BRENYCH_ENV === "production") throw new Error("Integration tests forbidden in production");
    await admin.query(`CREATE DATABASE ${name}`);
    created = true;
    execFileSync(process.execPath, ["scripts/db/migrate.mjs"], {
      env: { ...process.env, DATABASE_URL: url.toString() }, stdio: "pipe",
    });
  });
  afterAll(async () => {
    await pool.end();
    if (created && /^br03_test_[a-f0-9]{32}$/.test(name)) await admin.query(`DROP DATABASE ${name}`);
    await admin.end();
  });
  return { pool, connectionString: url.toString() };
}
