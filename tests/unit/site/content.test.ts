import { describe, expect, it } from "vitest";

import { getSiteContent } from "@/site/content";

describe("BRENYCH site content", () => {
  it("exposes the canonical identity and navigation for the development locale", () => {
    const content = getSiteContent("en");

    expect(content.identity).toEqual({
      name: "BRENYCH",
      descriptor: "Objects for the Body",
    });
    expect(content.navigation.map(({ label, href }) => [label, href])).toEqual([
      ["Objects", "/en/objects"],
      ["Collections", "/en/collections"],
      ["Atelier", "/en/atelier"],
      ["Journal", "/en/journal"],
      ["About", "/en/about"],
      ["Private Inquiry", "/en/private-inquiry"],
      ["Account", "/en/account"],
      ["Bag", "/en/bag"],
    ]);
  });

  it("keeps unapproved commercial claims out of public foundation data", () => {
    const serialized = JSON.stringify(getSiteContent("en"));

    expect(serialized).not.toMatch(/"(price|stock|editionSize|availability)"/i);
    expect(serialized).not.toMatch(/[€£$]\s?\d/);
  });
});
