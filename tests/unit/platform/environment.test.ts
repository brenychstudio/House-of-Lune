import { describe, expect, it } from "vitest";

import { readPublicEnvironment } from "@/platform/config/environment";

describe("public environment", () => {
  it("defaults to a non-indexable local development origin", () => {
    expect(readPublicEnvironment({})).toEqual({
      environment: "development",
      siteUrl: new URL("http://localhost:3000"),
      indexable: false,
    });
  });

  it("allows indexing only for an explicit secure production origin", () => {
    expect(
      readPublicEnvironment({
        BRENYCH_ENV: "production",
        NEXT_PUBLIC_SITE_URL: "https://brenych.com",
      }),
    ).toEqual({
      environment: "production",
      siteUrl: new URL("https://brenych.com"),
      indexable: true,
    });
  });

  it("rejects malformed and insecure production origins", () => {
    expect(() =>
      readPublicEnvironment({ NEXT_PUBLIC_SITE_URL: "not a URL" }),
    ).toThrowError("NEXT_PUBLIC_SITE_URL must be an absolute URL");

    expect(() =>
      readPublicEnvironment({
        BRENYCH_ENV: "production",
        NEXT_PUBLIC_SITE_URL: "http://brenych.com",
      }),
    ).toThrowError("Production site URL must use HTTPS");
  });
});
