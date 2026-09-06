import { NextRequest, NextResponse } from "next/server";

import { createPool } from "@/platform/db/pool";
import { logoutSession } from "@/platform/db/services/customerAccountService";
import { authCookieContract } from "@/platform/identity/cookies";
import { isSameOriginMutation, requestUsesSecureCookies } from "@/platform/identity/requestSecurity";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  if (!isSameOriginMutation(request)) return NextResponse.json({ message: "Request rejected." }, { status: 403 });
  const secure = requestUsesSecureCookies(request);
  const cookie = authCookieContract(secure);
  const rawToken = request.cookies.get(cookie.name)?.value;
  if (rawToken) {
    try {
      const pool = createPool({ max: 1, connectionTimeoutMillis: 1200, statement_timeout: 2000 });
      try { await logoutSession(pool, rawToken); }
      finally { await pool.end(); }
    } catch {
      return NextResponse.json(
        { message: "Account access is temporarily unavailable. Please retry logout." },
        {
          status: 503,
          headers: { "Cache-Control": "no-store, private", "Referrer-Policy": "no-referrer" },
        },
      );
    }
  }
  const response = NextResponse.redirect(new URL("/en/account", request.nextUrl.origin), 303);
  response.cookies.set(cookie.name, "", { ...cookie.options, maxAge: 0 });
  response.headers.set("Cache-Control", "no-store, private");
  return response;
}
