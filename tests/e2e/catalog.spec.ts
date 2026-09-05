import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("catalog index and MASK 01 retain semantic content without invented commerce", async ({ page }) => {
  await page.goto("/en/objects");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.getByRole("link", { name: /examine/i })).toBeVisible();
  await page.goto("/en/objects/mask-01");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("MASK 01");
  if (process.env.BRENYCH_E2E_DEGRADED === "1") {
    await expect(page.getByText("Commercial data temporarily unavailable")).toBeVisible();
    await expect(page.locator("[data-product-id]")).toHaveCount(0);
  } else {
    await expect(page.getByText("Development presentation — not offered for sale")).toBeVisible();
    await expect(page.locator("[data-product-id]")).toHaveAttribute("data-product-id", /^[0-9a-f-]{36}$/);
  }
  await expect(page.locator("main")).not.toContainText(/[€£$]\s?\d|\b\d+\/\d+\b|\b\d+ (days|weeks)\b|in stock|available now/i);
  await expect(page.getByRole("button", { name: /buy|acquire|add to bag/i })).toHaveCount(0);
  await expect(page.getByRole("link", { name: /buy|add to bag/i })).toHaveCount(0);
  const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
  expect(results.violations.filter(v => v.impact === "serious" || v.impact === "critical")).toEqual([]);
});
