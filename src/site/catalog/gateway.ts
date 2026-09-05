import "server-only";
import type { Pool } from "pg";
import type { Market } from "@/modules/shared/valueObjects";
import { createPool } from "@/platform/db/pool";
import { getPublicObjectBySlug, listPublicObjects, getDevelopmentObjectBySlug } from "@/platform/db/queries/publicCatalog";
import { readCatalog } from "./readCatalog";

// A request owns and closes its pool; Workers cannot share request I/O globally.
async function withCatalog<T>(query: (pool: Pool) => Promise<T>) {
  return readCatalog(async () => {
    const pool = createPool({ max: 1, connectionTimeoutMillis: 1500, statement_timeout: 2000 });
    try { return await query(pool); }
    finally { await pool.end(); }
  });
}

export function storefrontObject(slug: string, market: Market) {
  return withCatalog(async pool => {
    const published = await getPublicObjectBySlug(pool, slug, { market, at: new Date() });
    if (published) return published;
    return getDevelopmentObjectBySlug(pool, slug, process.env.BRENYCH_ENV ?? "");
  });
}

export function storefrontObjects(market: Market) {
  return withCatalog(async pool => {
    const published = await listPublicObjects(pool, { market, at: new Date() });
    const draft = await getDevelopmentObjectBySlug(pool, "mask-01", process.env.BRENYCH_ENV ?? "");
    return draft ? [...published, draft] : published;
  });
}

export function catalogMarket(value: string | string[] | undefined): Market {
  return value === "UK" || value === "US" ? value : "EU";
}
