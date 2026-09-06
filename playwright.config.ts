import { randomBytes } from "node:crypto";

import { defineConfig, devices } from "@playwright/test";

const identityHarnessSecret = process.env.BRENYCH_IDENTITY_HARNESS_SECRET ?? randomBytes(32).toString("base64url");
process.env.BRENYCH_IDENTITY_HARNESS_SECRET = identityHarnessSecret;

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: "http://127.0.0.1:3101",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "chromium-desktop",
      use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } },
    },
    {
      name: "chromium-mobile",
      use: { ...devices["Desktop Chrome"], viewport: { width: 390, height: 844 } },
    },
  ],
  webServer: {
    command: "npm run db:migrate && npm run build && npm run start -- --hostname 127.0.0.1 --port 3101",
    url: "http://127.0.0.1:3101/en",
    reuseExistingServer: false,
    timeout: 120_000,
    env: {
      DATABASE_URL: process.env.DATABASE_URL ?? "postgresql://postgres@127.0.0.1:54329/brenych_test",
      BRENYCH_ENV: "development",
      BRENYCH_IDENTITY_DEV_HARNESS: "1",
      BRENYCH_IDENTITY_HARNESS_SECRET: identityHarnessSecret,
      BRENYCH_IDENTITY_TEST_DELIVERY_DELAY_MS: "1200",
      NEXT_PUBLIC_SITE_URL: "http://127.0.0.1:3101",
    },
  },
});
