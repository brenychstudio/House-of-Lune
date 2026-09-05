import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { chromium } from "@playwright/test";

const baseURL = process.env.BRENYCH_QA_URL ?? "http://127.0.0.1:8787";
const degraded = process.env.BRENYCH_QA_DEGRADED === "1";
const directory = join(process.cwd(), "docs", "evidence", "br-03");
await mkdir(directory, { recursive: true });
const browser = await chromium.launch();
const receipt = [];
try {
  for (const width of [1440, 1024, 390]) {
    const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: "reduce" });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", error => errors.push(error.message));
    for (const path of ["/en/objects", "/en/objects/mask-01"]) {
      const response = await page.goto(baseURL + path, { waitUntil: "networkidle" });
      if (!response?.ok()) throw new Error(`Unexpected status for ${path}`);
      const main = await page.locator("main").innerText();
      if (/[€£$]\s?\d|\b\d+\/\d+\b|\b\d+ (days|weeks)\b|in stock|buy now|add to bag/i.test(main)) throw new Error("Unapproved commercial claim");
      const hasId = await page.locator("[data-product-id]").count() > 0;
      if (hasId === degraded) throw new Error("Unexpected canonical/degraded state");
      if (degraded && !/Commercial data temporarily unavailable/i.test(main)) throw new Error("Missing degradation notice");
      if (!degraded && !/Development presentation — not offered for sale/i.test(main)) throw new Error("Missing canonical draft state");
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      if (overflow > 0 || errors.length) throw new Error(`Browser failure: ${overflow} ${errors.join(",")}`);
      const file = `${path.endsWith("mask-01") ? "mask-01" : "objects"}-${width}-${degraded ? "degraded" : "canonical"}.png`;
      await page.screenshot({ path: join(directory, file), fullPage: true });
      receipt.push({ path, width, status: response.status(), canonicalIdentity: hasId, degraded, overflow, file });
    }
    await context.close();
  }
} finally { await browser.close(); }
await writeFile(join(directory, `${degraded ? "degraded" : "canonical"}-receipt.json`),
  JSON.stringify({ baseURL, capturedAt: new Date().toISOString(), checks: receipt }, null, 2) + "\n");
console.log(`Verified ${receipt.length} catalog views (${degraded ? "degraded" : "canonical"})`);
