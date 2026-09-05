import { expect, it } from "vitest";
import { readCatalog } from "@/site/catalog/readCatalog";

it("reports unavailable commerce without substituting a draft or a price on read failure", async () => {
  const result = await readCatalog(async () => { throw new Error("private database diagnostic"); });
  expect(result).toEqual({ state: "UNAVAILABLE", data: null });
  expect(JSON.stringify(result)).not.toContain("private");
});

it("keeps missing data distinct from a database outage", async () => {
  expect(await readCatalog(async () => null)).toEqual({ state: "READY", data: null });
});
