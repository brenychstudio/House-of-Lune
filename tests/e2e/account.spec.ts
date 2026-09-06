import { randomUUID } from "node:crypto";

import AxeBuilder from "@axe-core/playwright";
import { expect, test, type BrowserContext, type Page } from "@playwright/test";

async function fixture(page: Page, operation: "invite" | "active" | "address" | "customer" | "guest", email?: string) {
  return page.request.post("/api/test/identity", {
    data: { operation, email },
    headers: { Authorization: `Bearer ${process.env.BRENYCH_IDENTITY_HARNESS_SECRET}` },
  });
}

async function signIn(page: Page, email: string) {
  const response = await fixture(page, "active", email);
  expect(response.ok()).toBe(true);
  const { verificationUrl } = await response.json() as { verificationUrl: string };
  await page.goto(verificationUrl);
  await expect(page).toHaveURL(/\/en\/account$/);
}

async function authCookie(context: BrowserContext) {
  return (await context.cookies()).find(({ name }) => name === "br_session_dev");
}

test("unauthenticated Collector Space is semantic, private, and reveals no customer data", async ({ page }) => {
  const response = await page.goto("/en/account");
  expect(response?.status()).toBe(200);
  expect(response?.headers()["cache-control"]).toContain("no-store");
  expect(response?.headers()["x-robots-tag"]).toContain("noindex");
  await expect(page.getByRole("heading", { level: 1, name: "Collector Space" })).toBeVisible();
  await expect(page.getByLabel("Email address")).toBeVisible();
  await expect(page.getByRole("button", { name: "Request access link" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Owned Objects" })).toHaveCount(0);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
});

test("known and unknown access requests have the same public response floor", async ({ page }) => {
  const known = `known-${randomUUID()}@example.com`;
  await fixture(page, "customer", known);
  await page.goto("/en/account");
  const outcomes = await page.evaluate(async ({ knownEmail, unknownEmail }) => {
    const send = async (email: string) => {
      const startedAt = performance.now();
      const response = await fetch("/api/account/access", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, locale: "en" }),
      });
      return { status: response.status, body: await response.json(), elapsed: performance.now() - startedAt };
    };
    return [await send(knownEmail), await send(unknownEmail)];
  }, { knownEmail: known, unknownEmail: `unknown-${randomUUID()}@example.com` });
  const knownOutcome = outcomes[0]!;
  const unknownOutcome = outcomes[1]!;
  expect({ status: knownOutcome.status, body: knownOutcome.body }).toEqual({ status: unknownOutcome.status, body: unknownOutcome.body });
  expect(knownOutcome.elapsed).toBeGreaterThanOrEqual(300);
  expect(unknownOutcome.elapsed).toBeGreaterThanOrEqual(300);
  expect(knownOutcome.elapsed).toBeLessThan(900);
  expect(unknownOutcome.elapsed).toBeLessThan(900);
});

test("identity harness is unavailable without its per-run bearer secret", async ({ page }) => {
  const response = await page.request.post("/api/test/identity", { data: { operation: "guest" } });
  expect(response.status()).toBe(404);
});

test("activation rotates guest identity, cleans the URL, and rejects replay", async ({ page, context, browser }) => {
  const guestResponse = await fixture(page, "guest");
  const { rawToken: guestToken } = await guestResponse.json() as { rawToken: string };
  await context.addCookies([
    { name: "br_guest_dev", value: guestToken, url: "http://127.0.0.1:3101", httpOnly: true, sameSite: "Lax" },
    { name: "br_guest_dev", value: guestToken, url: "http://localhost:3101", httpOnly: true, sameSite: "Lax" },
  ]);
  const email = `activate-${randomUUID()}@example.com`;
  const invitation = await fixture(page, "invite", email);
  const { verificationUrl } = await invitation.json() as { verificationUrl: string };
  expect(new URL(verificationUrl).origin).toBe("http://127.0.0.1:3101");
  await page.goto(verificationUrl);
  await expect(page).toHaveURL(/\/en\/account$/);
  await expect(page.getByRole("heading", { name: "Owned Objects" })).toBeVisible();
  const cookie = await authCookie(context);
  expect(cookie?.value).toBeTruthy();
  expect(cookie?.value).not.toBe(guestToken);
  expect(cookie).toMatchObject({ httpOnly: true, secure: false, sameSite: "Lax", path: "/" });

  const replayContext = await browser.newContext();
  const replayPage = await replayContext.newPage();
  await replayPage.goto(verificationUrl);
  await expect(replayPage).toHaveURL(/\/en\/account$/);
  await expect(replayPage.getByRole("button", { name: "Request access link" })).toBeVisible();
  expect(await authCookie(replayContext)).toBeUndefined();
  await replayContext.close();
});

test("authenticated Collector Space is truthful, supports address CRUD, and logs out", async ({ page, context }) => {
  await signIn(page, `collector-${randomUUID()}@example.com`);
  await expect(page.getByText("No registered objects yet.")).toBeVisible();
  await expect(page.getByText("No orders are linked to this account.")).toBeVisible();
  await expect(page.getByText("No care or service records are linked to this account.")).toBeVisible();

  await page.getByLabel("Recipient name").fill("Test Collector");
  await page.getByLabel("Address line 1").fill("1 Object Way");
  await page.getByLabel("City").fill("Barcelona");
  await page.getByLabel("Postal code").fill("08001");
  await page.getByLabel("Country code").fill("es");
  await page.getByRole("button", { name: "Add address" }).click();
  await expect(page.getByText("Test Collector")).toBeVisible();
  await page.getByRole("button", { name: "Edit" }).click();
  await page.getByLabel("Recipient name").fill("Updated Collector");
  await page.getByRole("button", { name: "Save changes" }).click();
  await expect(page.getByText("Updated Collector")).toBeVisible();
  await page.getByRole("button", { name: "Remove" }).click();
  await expect(page.getByText("No saved addresses yet.")).toBeVisible();

  await page.getByRole("button", { name: "Log out" }).click();
  await expect(page.getByRole("button", { name: "Request access link" })).toBeVisible();
  expect(await authCookie(context)).toBeUndefined();
});

test("cross-customer address mutation has common not-found behavior", async ({ page }) => {
  await signIn(page, `intruder-${randomUUID()}@example.com`);
  const other = await fixture(page, "address", `other-${randomUUID()}@example.com`);
  const { addressId } = await other.json() as { addressId: string };
  const status = await page.evaluate(async (id) => (await fetch(`/api/account/addresses/${id}`, {
    method: "PATCH", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      kind: "SHIPPING", recipientName: "Intruder", line1: "1", line2: null,
      city: "X", region: null, postalCode: "1", countryCode: "ES",
    }),
  })).status, addressId);
  expect(status).toBe(404);
});

test("account outage fails closed while the public storefront survives", async ({ page }) => {
  await page.goto("/en");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await page.goto("/en/account?qaAccountOutage=1");
  await expect(page.getByRole("heading", { name: "Account access is temporarily unavailable." })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Owned Objects" })).toHaveCount(0);
});

test("Collector Space has no serious or critical accessibility violations", async ({ page }) => {
  await page.goto("/en/account");
  const anonymous = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
  expect(anonymous.violations.filter(({ impact }) => impact === "serious" || impact === "critical")).toEqual([]);
  await signIn(page, `axe-${randomUUID()}@example.com`);
  const authenticated = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
  expect(authenticated.violations.filter(({ impact }) => impact === "serious" || impact === "critical")).toEqual([]);
});
