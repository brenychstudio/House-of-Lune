import { Pool, type PoolConfig } from "pg";

export function createPool(config: PoolConfig = {}): Pool {
  const connectionString = config.connectionString ?? process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is required");
  }

  return new Pool({
    ...config,
    connectionString,
    application_name: config.application_name ?? "brenych-commerce",
  });
}
