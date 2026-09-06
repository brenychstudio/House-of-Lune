import { describe, expect, it } from "vitest";

import { clientAbuseScope, isSameOriginMutation } from "@/platform/identity/requestSecurity";

describe("mutation origin policy", () => {
  it("compares browser origin to the external host rather than an internal proxy URL", () => {
    const request = new Request("http://localhost:3000/api/account/logout", {
      method: "POST",
      headers: { origin: "http://localhost:3101", host: "localhost:3101" },
    });
    expect(isSameOriginMutation(request)).toBe(true);
  });

  it("accepts an exact same-origin referer fallback and rejects cross-origin mutations", () => {
    expect(isSameOriginMutation(new Request("http://internal/api", {
      method: "POST", headers: { referer: "https://brenych.test/en/account", host: "brenych.test", "x-forwarded-proto": "https" },
    }))).toBe(true);
    expect(isSameOriginMutation(new Request("http://internal/api", {
      method: "POST", headers: { origin: "https://attacker.test", host: "brenych.test", "x-forwarded-proto": "https" },
    }))).toBe(false);
    expect(isSameOriginMutation(new Request("http://internal/api", { method: "POST", headers: { host: "brenych.test" } }))).toBe(false);
  });

  it("accepts browser same-origin Fetch Metadata when native forms omit source headers", () => {
    expect(isSameOriginMutation(new Request("http://internal/api", {
      method: "POST", headers: { host: "brenych.test", "sec-fetch-site": "same-origin" },
    }))).toBe(true);
    expect(isSameOriginMutation(new Request("http://internal/api", {
      method: "POST", headers: { host: "brenych.test", "sec-fetch-site": "cross-site" },
    }))).toBe(false);
  });
});

describe("client abuse scope", () => {
  it("prefers Cloudflare's connecting address and normalizes it", () => {
    expect(clientAbuseScope(new Request("https://brenych.test", {
      headers: { "cf-connecting-ip": "2001:DB8::1", "x-forwarded-for": "192.0.2.1" },
    }))).toBe("network:2001:db8::1");
  });

  it("does not trust forwarded client addresses outside development", () => {
    const previous = process.env.BRENYCH_ENV;
    process.env.BRENYCH_ENV = "production";
    try {
      expect(clientAbuseScope(new Request("https://brenych.test", {
        headers: { "x-forwarded-for": "192.0.2.1" },
      }))).toBe("network:unattributed");
    } finally {
      if (previous === undefined) delete process.env.BRENYCH_ENV;
      else process.env.BRENYCH_ENV = previous;
    }
  });
});
