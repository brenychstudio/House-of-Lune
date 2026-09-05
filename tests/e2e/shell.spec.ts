import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const routes = [
  ["/en", "Sculptural objects engineered for the body."],
  ["/en/objects", "A considered foundation for physical editions."],
  ["/en/objects/mask-01", "MASK 01"],
  ["/en/collections", "Bodies of work, edited with restraint."],
  ["/en/atelier", "Making is part of the object’s permanent record."],
  ["/en/journal", "Notes on form, body, process, and material."],
  ["/en/about", "BRENYCH is a name, an authorship, and a standard of work."],
  ["/en/private-inquiry", "A direct conversation with the studio."],
  ["/en/account", "Ownership will extend beyond an order receipt."],
  ["/en/bag", "Your bag is empty."],
] as const;

test("root deterministically redirects to the development locale", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveURL(/\/en$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Sculptural objects engineered for the body.",
  );
});

for (const [path, heading] of routes) {
  test(`${path} renders one canonical primary heading`, async ({ page }) => {
    const response = await page.goto(path);

    expect(response?.status()).toBe(200);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(heading);
    await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
  });
}

test("unsupported locale and unknown object fail closed", async ({ page }) => {
  expect((await page.goto("/fr"))?.status()).toBe(404);
  expect((await page.goto("/en/objects/not-an-object"))?.status()).toBe(404);
});

test("public foundation content has no price claim", async ({ page }) => {
  await page.goto("/en/objects/mask-01");

  await expect(page.locator("body")).not.toContainText(/[€£$]\s?\d/);
  await expect(page.getByText("Development presentation — not offered for sale")).toBeVisible();
});

test("the shell has no serious or critical automated accessibility violations", async ({ page }) => {
  await page.goto("/en");

  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();

  expect(results.violations.filter(({ impact }) => impact === "serious" || impact === "critical")).toEqual([]);
});

test("the compact header menu is keyboard complete", async ({ page }) => {
  test.skip((page.viewportSize()?.width ?? 0) > 600, "compact viewport only");
  await page.goto("/en");

  const trigger = page.getByRole("button", { name: "Menu" });
  await expect(trigger).toHaveAttribute("data-hydrated", "true");
  await trigger.focus();
  await page.keyboard.press("Enter");

  const menu = page.getByRole("dialog", { name: "Site menu" });
  await expect(menu.getByRole("link", { name: "Objects" })).toBeFocused();
  await expect(menu.getByRole("link", { name: "Bag" })).toBeVisible();
  const menuBox = await menu.boundingBox();
  expect(menuBox?.height).toBeGreaterThan(700);
  await expect(page.locator("body")).toHaveCSS("overflow", "hidden");

  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
  await expect(page.getByRole("dialog", { name: "Site menu" })).toHaveCount(0);
});

test("the shell does not overflow the compact viewport", async ({ page }) => {
  test.skip((page.viewportSize()?.width ?? 0) > 600, "compact viewport only");
  await page.goto("/en/objects/mask-01");

  const sizes = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    content: document.documentElement.scrollWidth,
  }));

  expect(sizes.content).toBeLessThanOrEqual(sizes.viewport);
});
