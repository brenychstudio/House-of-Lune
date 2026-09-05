import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

import { chromium } from "@playwright/test";

const baseURL = process.env.BRENYCH_QA_URL ?? "http://127.0.0.1:3104";
const outputDirectory = join(process.cwd(), "docs", "evidence", "br-01");
const viewports = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "tablet", width: 1024, height: 1366 },
  { name: "mobile", width: 390, height: 844 },
];
const routes = [
  { name: "home", path: "/en" },
  { name: "objects", path: "/en/objects" },
  { name: "mask-01", path: "/en/objects/mask-01" },
];

await mkdir(outputDirectory, { recursive: true });
const browser = await chromium.launch();
const receipt = [];

try {
  for (const viewport of viewports) {
    const context = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height },
      reducedMotion: viewport.name === "mobile" ? "reduce" : "no-preference",
    });
    const page = await context.newPage();
    const problems = [];
    page.on("console", (message) => {
      if (message.type() === "error") problems.push(`console: ${message.text()}`);
    });
    page.on("pageerror", (error) => problems.push(`pageerror: ${error.message}`));
    page.on("response", (response) => {
      if (response.status() >= 400) problems.push(`response ${response.status()}: ${response.url()}`);
    });

    for (const route of routes) {
      const response = await page.goto(`${baseURL}${route.path}`, { waitUntil: "networkidle" });
      if (!response?.ok()) throw new Error(`${route.path} returned ${response?.status()}`);
      if ((await page.locator("h1").count()) !== 1) throw new Error(`${route.path} must have one h1`);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      if (overflow > 0) throw new Error(`${route.path} overflows by ${overflow}px at ${viewport.width}px`);
      const file = `${route.name}-${viewport.width}x${viewport.height}.png`;
      await page.screenshot({ path: join(outputDirectory, file), fullPage: true });
      receipt.push({ route: route.path, viewport, file, overflow });
    }

    if (viewport.name === "mobile") {
      await page.goto(`${baseURL}/en`, { waitUntil: "networkidle" });
      const trigger = page.getByRole("button", { name: "Menu" });
      await trigger.waitFor();
      await trigger.click();
      const menu = page.getByRole("dialog", { name: "Site menu" });
      await menu.waitFor();
      const menuBox = await menu.boundingBox();
      if (!menuBox || menuBox.height < viewport.height - 100) {
        throw new Error(`Menu overlay is only ${menuBox?.height ?? 0}px tall`);
      }
      if (!(await menu.getByRole("link", { name: "Bag" }).isVisible())) {
        throw new Error("Menu does not expose its final navigation item");
      }
      await page.screenshot({ path: join(outputDirectory, `menu-${viewport.width}x${viewport.height}.png`), fullPage: false });
      receipt.push({ route: "/en#menu", viewport, file: `menu-${viewport.width}x${viewport.height}.png`, overflow: 0 });
    }

    if (problems.length > 0) throw new Error(problems.join("\n"));
    await context.close();
  }
} finally {
  await browser.close();
}

await writeFile(
  join(outputDirectory, "capture-receipt.json"),
  `${JSON.stringify({ baseURL, capturedAt: new Date().toISOString(), checks: receipt }, null, 2)}\n`,
  "utf8",
);

console.log(`captured ${receipt.length} verified shell views`);
