import type { Metadata } from "next";
import { cookies } from "next/headers";
import Link from "next/link";

import { authCookieContract } from "@/platform/identity/cookies";
import { loadCollectorAccount } from "@/site/account/gateway";
import { AccountAccessForm } from "@/site/components/AccountAccessForm";
import { AddressBook } from "@/site/components/AddressBook";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Collector Space",
  description: "Private BRENYCH customer identity, ownership, order, care, and service foundation.",
  robots: { index: false, follow: false, noarchive: true },
};

export default async function AccountPage({
  searchParams,
}: Readonly<{ searchParams: Promise<Record<string, string | string[] | undefined>> }>) {
  const query = await searchParams;
  const forcedOutage =
    process.env.BRENYCH_ENV === "development" &&
    process.env.BRENYCH_IDENTITY_DEV_HARNESS === "1" &&
    query.qaAccountOutage === "1";
  const store = await cookies();
  const secure = process.env.NEXT_PUBLIC_SITE_URL?.startsWith("https://") ?? false;
  const contract = authCookieContract(secure);
  const account = forcedOutage
    ? { status: "UNAVAILABLE" as const }
    : await loadCollectorAccount(store.get(contract.name)?.value);

  return (
    <main id="main-content" className="account-page">
      <header className="account-hero">
        <p className="eyebrow">Private ownership environment</p>
        <h1>Collector Space</h1>
        <p className="lede">A secure place for BRENYCH account identity, owned objects, orders, care, and service.</p>
      </header>

      {account.status === "UNAVAILABLE" ? (
        <section className="account-panel" aria-labelledby="account-unavailable">
          <h2 id="account-unavailable">Account access is temporarily unavailable.</h2>
          <p>Your identity and private records remain closed. The public BRENYCH collection is still available.</p>
          <Link className="text-link" href="/en/objects">View objects</Link>
        </section>
      ) : null}

      {account.status === "ANONYMOUS" ? (
        <section className="account-panel" aria-labelledby="account-access">
          <h2 id="account-access">Request access</h2>
          <p>Account access is invitation-led. Enter your account email and we will respond without revealing account eligibility.</p>
          <AccountAccessForm />
        </section>
      ) : null}

      {account.status === "AUTHENTICATED" ? (
        <div className="collector-sections">
          <section className="account-panel" aria-labelledby="account-identity">
            <p className="eyebrow">Account identity</p>
            <h2 id="account-identity">{account.customer.displayName ?? "BRENYCH Collector"}</h2>
            <p>{account.customer.email}</p>
          </section>
          <section className="account-panel" aria-labelledby="owned-objects">
            <h2 id="owned-objects">Owned Objects</h2>
            <p className="empty-state">No registered objects yet.</p>
          </section>
          <section className="account-panel" aria-labelledby="orders">
            <h2 id="orders">Orders</h2>
            {account.orders.length === 0 ? <p className="empty-state">No orders are linked to this account.</p> : (
              <ul>{account.orders.map((order) => <li key={order.id}>{order.orderNumber} — {order.state}</li>)}</ul>
            )}
          </section>
          <section className="account-panel" aria-labelledby="addresses">
            <h2 id="addresses">Addresses</h2>
            <AddressBook addresses={account.addresses} />
          </section>
          <section className="account-panel" aria-labelledby="security">
            <h2 id="security">Security</h2>
            <p>Passwordless access is protected by one-time links and revocable server-side sessions.</p>
            <form action="/api/account/logout" method="post">
              <button className="button" type="submit">Log out</button>
            </form>
          </section>
          <section className="account-panel" aria-labelledby="care-service">
            <h2 id="care-service">Care / Service</h2>
            <p className="empty-state">No care or service records are linked to this account.</p>
          </section>
        </div>
      ) : null}
    </main>
  );
}
