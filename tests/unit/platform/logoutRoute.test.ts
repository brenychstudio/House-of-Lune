import { NextRequest } from "next/server";
import { beforeEach, expect, it, vi } from "vitest";

const end = vi.fn();

vi.mock("@/platform/db/pool", () => ({
  createPool: () => ({
    connect: async () => { throw new Error("database unavailable"); },
    end,
  }),
}));

beforeEach(() => end.mockClear());

it("keeps the authenticated cookie when durable logout revocation cannot be confirmed", async () => {
  const { POST } = await import("@/app/api/account/logout/route");
  const request = new NextRequest("http://localhost/api/account/logout", {
    method: "POST",
    headers: {
      cookie: "br_session_dev=opaque-session-token",
      host: "localhost",
      origin: "http://localhost",
    },
  });
  const response = await POST(request);
  expect(response.status).toBe(503);
  expect(response.headers.get("set-cookie")).toBeNull();
  expect(await response.json()).toEqual({
    message: "Account access is temporarily unavailable. Please retry logout.",
  });
  expect(end).toHaveBeenCalledOnce();
});
