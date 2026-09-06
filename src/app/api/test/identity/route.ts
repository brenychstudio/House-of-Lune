import { NextRequest, NextResponse } from "next/server";

import { normalizeCustomerEmail } from "@/modules/customers/account";
import { createPool } from "@/platform/db/pool";
import { createAddress } from "@/platform/db/repositories/addressRepository";
import { createCustomer, findCustomerByEmail } from "@/platform/db/repositories/customerRepository";
import { linkVerifiedIdentity } from "@/platform/db/repositories/identityRepository";
import { inviteAccount, requestAccountAccess, createAnonymousGuestSession } from "@/platform/db/services/customerAccountService";
import { withTransaction } from "@/platform/db/transaction";
import { developmentPasswordlessDelivery } from "@/platform/identity/developmentDelivery";

export const dynamic = "force-dynamic";

function enabled(request: NextRequest) {
  const secret = process.env.BRENYCH_IDENTITY_HARNESS_SECRET;
  return process.env.BRENYCH_ENV === "development" &&
    process.env.BRENYCH_IDENTITY_DEV_HARNESS === "1" &&
    typeof secret === "string" && secret.length >= 32 &&
    request.headers.get("authorization") === `Bearer ${secret}` &&
    (request.nextUrl.hostname === "127.0.0.1" || request.nextUrl.hostname === "localhost");
}

export async function POST(request: NextRequest) {
  if (!enabled(request)) return new NextResponse(null, { status: 404 });
  const body = await request.json() as { operation?: string; email?: string };
  const normalized = normalizeCustomerEmail(body.email ?? "");
  const pool = createPool({ max: 1, connectionTimeoutMillis: 1200, statement_timeout: 2000 });
  try {
    if (body.operation === "guest") {
      const guest = await createAnonymousGuestSession(pool);
      return NextResponse.json({ rawToken: guest.rawToken });
    }
    if (!normalized.ok) return NextResponse.json({ message: "Invalid fixture." }, { status: 400 });
    let customer = await withTransaction(pool, (client) => findCustomerByEmail(client, normalized.value));
    if (!customer) {
      customer = await withTransaction(pool, (client) => createCustomer(client, {
        email: normalized.value,
        accountState: body.operation === "active" || body.operation === "address" || body.operation === "customer" ? "ACTIVE" : "GUEST",
      }));
    }
    if (body.operation === "invite") {
      await inviteAccount(pool, {
        customerId: customer.id,
        locale: "en", delivery: developmentPasswordlessDelivery,
      });
      const delivery = developmentPasswordlessDelivery.take(customer.id, "ACCOUNT_ACTIVATION");
      return NextResponse.json({ customerId: customer.id, verificationUrl: delivery?.url });
    }
    if (body.operation === "active" || body.operation === "address" || body.operation === "customer") {
      await withTransaction(pool, async (client) => {
        await client.query("UPDATE customers SET account_state='ACTIVE' WHERE id=$1", [customer!.id]);
        await linkVerifiedIdentity(client, { customerId: customer!.id, type: "VERIFIED_EMAIL", value: customer!.email });
      });
      if (body.operation === "address") {
        const address = await withTransaction(pool, (client) => createAddress(client, customer!.id, {
          kind: "SHIPPING", recipientName: "Other Collector", line1: "9 Private Way", line2: null,
          city: "Barcelona", region: null, postalCode: "08009", countryCode: "ES",
        }));
        return NextResponse.json({ customerId: customer.id, addressId: address.id });
      }
      if (body.operation === "customer") return NextResponse.json({ customerId: customer.id });
      await requestAccountAccess(pool, {
        email: customer.email, locale: "en", callerScope: "identity-harness",
        delivery: developmentPasswordlessDelivery,
      });
      const delivery = developmentPasswordlessDelivery.take(customer.id, "SIGN_IN");
      return NextResponse.json({ customerId: customer.id, verificationUrl: delivery?.url });
    }
    return NextResponse.json({ message: "Unknown fixture operation." }, { status: 400 });
  } finally {
    await pool.end();
  }
}
