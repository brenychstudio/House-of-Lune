import { describe, expect, it } from "vitest";

import { fingerprintRequest } from "@/platform/idempotency/fingerprint";

describe("request fingerprints", () => {
  it("is stable across object key insertion order", async () => {
    const first = await fingerprintRequest({ quantity: 1, object: { sku: "BR-M01-PS", market: "EU" } });
    const second = await fingerprintRequest({ object: { market: "EU", sku: "BR-M01-PS" }, quantity: 1 });

    expect(first).toBe(second);
    expect(first).toMatch(/^[a-f0-9]{64}$/);
  });

  it("changes when request content changes", async () => {
    expect(await fingerprintRequest({ quantity: 1 })).not.toBe(
      await fingerprintRequest({ quantity: 2 }),
    );
  });
});
