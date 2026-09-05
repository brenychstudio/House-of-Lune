import { describe, expect, it } from "vitest";

import { createEdition, createPhysicalInstance } from "@/modules/catalog/domain";
import { createPriceBook } from "@/modules/pricing/domain";

describe("catalog and pricing contracts", () => {
  it("keeps an edition number inside its declared scarcity boundary", () => {
    expect(createEdition({ number: 7, size: 25 })).toMatchObject({
      ok: true,
      value: { number: 7, size: 25, state: "AVAILABLE" },
    });
    expect(createEdition({ number: 0, size: 25 })).toMatchObject({ ok: false });
    expect(createEdition({ number: 26, size: 25 })).toMatchObject({ ok: false });
  });

  it("requires permanent physical identity and exact revision references", () => {
    expect(
      createPhysicalInstance({
        identityCode: "BR-M01-PS-007",
        designRevisionId: "mask-01-r1",
        finishRevisionId: "polished-silver-r1",
        fitRevisionId: "mask-fit-r1",
      }),
    ).toMatchObject({ ok: true });
    expect(
      createPhysicalInstance({
        identityCode: "temporary",
        designRevisionId: "",
        finishRevisionId: "",
        fitRevisionId: "",
      }),
    ).toMatchObject({ ok: false });
  });

  it("couples each price book market only to its canonical currency", () => {
    expect(createPriceBook({ market: "EU", currency: "EUR", revision: "eu-2026-01" })).toMatchObject({
      ok: true,
    });
    expect(createPriceBook({ market: "EU", currency: "USD", revision: "wrong" })).toMatchObject({
      ok: false,
      error: { code: "MARKET_CURRENCY_MISMATCH" },
    });
  });
});
