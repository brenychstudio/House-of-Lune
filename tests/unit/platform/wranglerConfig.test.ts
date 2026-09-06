import { readFileSync } from "node:fs";
import { join } from "node:path";

import { expect, it } from "vitest";

it("redacts query strings from Cloudflare logs and traces", () => {
  const config = JSON.parse(readFileSync(join(process.cwd(), "wrangler.jsonc"), "utf8"));
  expect(config.observability.redact_query_string).toBe(true);
});
