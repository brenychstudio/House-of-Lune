import { randomUUID } from "node:crypto";

import type { PoolClient } from "pg";
import { describe, expect, it } from "vitest";

import { hashOpaqueToken } from "@/platform/identity/tokens";
import { consumePasswordlessChallenge, createCustomer, createPasswordlessChallenge } from "@/platform/db/repositories/customerRepository";
import { linkVerifiedIdentity } from "@/platform/db/repositories/identityRepository";
import { claimGuestOrder } from "@/platform/db/repositories/orderRepository";
import { withTransaction } from "@/platform/db/transaction";
import { isolatedPostgres } from "../helpers/postgres";

const { pool } = isolatedPostgres();

function barrier(parties: number) {
  let ready = 0;
  let release!: () => void;
  const gate = new Promise<void>((resolve) => { release = resolve; });
  return async () => { ready += 1; if (ready === parties) release(); await gate; };
}

async function contend<T>(work: (client: PoolClient, contender: number) => Promise<T>) {
  const synchronize = barrier(2);
  return Promise.all([0, 1].map((contender) => withTransaction(pool, async (client) => {
    await synchronize();
    return work(client, contender);
  })));
}

describe("BR-04 concurrency boundaries", () => {
  it("allows exactly one transaction to consume a passwordless challenge", async () => {
    const created = await withTransaction(pool, (client) => createCustomer(client, {
      email: `race-challenge-${randomUUID()}@example.com`, accountState: "INVITED",
    }));
    const hash = await hashOpaqueToken(`challenge-${randomUUID()}`);
    await withTransaction(pool, (client) => createPasswordlessChallenge(client, {
      customerId: created.id, purpose: "ACCOUNT_ACTIVATION", tokenHash: hash,
      expiresAt: new Date(Date.now() + 60_000),
    }));
    const outcomes = await contend((client) => consumePasswordlessChallenge(client, hash, new Date()));
    expect(outcomes.filter(Boolean)).toHaveLength(1);
  });

  it("allows exactly one customer to own a deterministic verified identity", async () => {
    const customers = await Promise.all([0, 1].map((index) => withTransaction(pool, (client) => createCustomer(client, {
      email: `race-identity-${index}-${randomUUID()}@example.com`,
    }))));
    const identity = `shared-${randomUUID()}@example.com`;
    const outcomes = await contend((client, contender) => linkVerifiedIdentity(client, {
      customerId: customers[contender]!.id, type: "VERIFIED_EMAIL", value: identity,
    }));
    expect(outcomes.sort()).toEqual(["CONFLICT", "LINKED"]);
  });

  it("assigns an unowned guest order at most once", async () => {
    const email = `race-order-${randomUUID()}@example.com`;
    const eligible = await withTransaction(pool, async (client) => {
      const created = await createCustomer(client, { email });
      await linkVerifiedIdentity(client, { customerId: created.id, type: "VERIFIED_EMAIL", value: email });
      return created;
    });
    const ineligible = await withTransaction(pool, (client) => createCustomer(client, {
      email: `other-${randomUUID()}@example.com`,
    }));
    const order = await pool.query<{ id: string }>(
      `INSERT INTO orders (guest_email,market,currency,subtotal_minor,tax_minor,duties_minor,shipping_minor,discount_minor,total_minor,price_book_revision)
       VALUES ($1,'EU','EUR',100,0,0,0,0,100,'br04-race') RETURNING id`, [email],
    );
    const outcomes = await contend((client, contender) => claimGuestOrder(
      client,
      contender === 0 ? eligible.id : ineligible.id,
      order.rows[0]!.id,
    ));
    expect(outcomes.filter((result) => result === "CLAIMED")).toHaveLength(1);
    expect((await pool.query("SELECT customer_id FROM orders WHERE id=$1", [order.rows[0]!.id])).rows[0].customer_id).toBe(eligible.id);
  });
});
