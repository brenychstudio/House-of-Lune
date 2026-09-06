import "server-only";

import type { Pool } from "pg";

import { createPool } from "@/platform/db/pool";
import { listAddressesForCustomer } from "@/platform/db/repositories/addressRepository";
import { findActiveSession } from "@/platform/db/repositories/customerRepository";
import { listOwnedOrders } from "@/platform/db/repositories/orderRepository";
import { hashOpaqueToken } from "@/platform/identity/tokens";

export type CollectorAccountState =
  | Readonly<{ status: "ANONYMOUS" }>
  | Readonly<{ status: "UNAVAILABLE" }>
  | Readonly<{
      status: "AUTHENTICATED";
      sessionId: string;
      customer: Readonly<{ id: string; email: string; displayName: string | null }>;
      addresses: Awaited<ReturnType<typeof listAddressesForCustomer>>;
      orders: Awaited<ReturnType<typeof listOwnedOrders>>;
      ownedObjects: readonly never[];
    }>;

async function withAccountPool<T>(work: (pool: Pool) => Promise<T>) {
  const pool = createPool({ max: 1, connectionTimeoutMillis: 1200, statement_timeout: 2000 });
  try { return await work(pool); }
  finally { await pool.end(); }
}

export async function loadCollectorAccount(rawToken: string | undefined): Promise<CollectorAccountState> {
  try {
    return await withAccountPool(async (pool) => {
      await pool.query("SELECT 1");
      if (!rawToken) return { status: "ANONYMOUS" };
      const session = await findActiveSession(pool, await hashOpaqueToken(rawToken), new Date());
      if (!session) return { status: "ANONYMOUS" };
      const [addresses, orders] = await Promise.all([
        listAddressesForCustomer(pool, session.customerId),
        listOwnedOrders(pool, session.customerId),
      ]);
      return {
        status: "AUTHENTICATED",
        sessionId: session.id,
        customer: { id: session.customerId, email: session.email, displayName: session.displayName },
        addresses,
        orders,
        ownedObjects: [],
      };
    });
  } catch {
    return { status: "UNAVAILABLE" };
  }
}
