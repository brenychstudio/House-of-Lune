import { describe, expect, it } from "vitest";

import {
  AUTH_ABSOLUTE_LIFETIME_SECONDS,
  AUTH_IDLE_TIMEOUT_SECONDS,
  PASSWORDLESS_TTL_SECONDS,
  authCookieContract,
} from "@/platform/identity/cookies";
import { generateOpaqueToken, hashOpaqueToken } from "@/platform/identity/tokens";

describe("identity security primitives", () => {
  it("generates independent 256-bit opaque values and stable SHA-256 hashes", async () => {
    const first = generateOpaqueToken();
    const second = generateOpaqueToken();
    expect(first).not.toBe(second);
    expect(first).toMatch(/^[A-Za-z0-9_-]{43}$/);
    const digest = await hashOpaqueToken(first);
    expect(digest).toMatch(/^[a-f0-9]{64}$/);
    expect(await hashOpaqueToken(first)).toBe(digest);
    expect(await hashOpaqueToken(second)).not.toBe(digest);
  });

  it("centralizes passwordless and session lifetime policy", () => {
    expect(PASSWORDLESS_TTL_SECONDS).toBe(15 * 60);
    expect(AUTH_IDLE_TIMEOUT_SECONDS).toBe(30 * 24 * 60 * 60);
    expect(AUTH_ABSOLUTE_LIFETIME_SECONDS).toBe(90 * 24 * 60 * 60);
  });

  it("uses a host-prefixed secure cookie outside local HTTP", () => {
    expect(authCookieContract(true)).toEqual({
      name: "__Host-br_session",
      options: {
        httpOnly: true,
        sameSite: "lax",
        secure: true,
        path: "/",
        maxAge: AUTH_ABSOLUTE_LIFETIME_SECONDS,
      },
    });
    expect(authCookieContract(false)).toMatchObject({
      name: "br_session_dev",
      options: { httpOnly: true, sameSite: "lax", secure: false, path: "/" },
    });
    expect(authCookieContract(true).options).not.toHaveProperty("domain");
  });
});
