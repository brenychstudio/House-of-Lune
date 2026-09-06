import { NextRequest, NextResponse } from "next/server";

import { readPublicEnvironment } from "@/platform/config/environment";
import { createPool } from "@/platform/db/pool";
import { exchangePasswordlessToken } from "@/platform/db/services/customerAccountService";
import { authCookieContract, guestCookieContract } from "@/platform/identity/cookies";
import { requestUsesSecureCookies } from "@/platform/identity/requestSecurity";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest, context: { params: Promise<{ locale: string }> }) {
  const { locale } = await context.params;
  const { siteUrl } = readPublicEnvironment(process.env);
  const destination = new URL(`/${locale === "en" ? "en" : "en"}/account`, siteUrl.origin);
  const secure = requestUsesSecureCookies(request);
  const authCookie = authCookieContract(secure);
  const guestCookie = guestCookieContract(secure);
  const rawToken = request.nextUrl.searchParams.get("token") ?? "";
  let exchanged: Awaited<ReturnType<typeof exchangePasswordlessToken>> = null;
  try {
    const pool = createPool({ max: 1, connectionTimeoutMillis: 1200, statement_timeout: 2000 });
    try {
      const guestRawToken = request.cookies.get(guestCookie.name)?.value;
      exchanged = await exchangePasswordlessToken(pool, {
        rawToken,
        ...(guestRawToken ? { guestRawToken } : {}),
      });
    } finally {
      await pool.end();
    }
  } catch {
    exchanged = null;
  }
  const response = NextResponse.redirect(destination, 303);
  response.headers.set("Cache-Control", "no-store, private");
  response.headers.set("Referrer-Policy", "no-referrer");
  response.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
  if (exchanged) response.cookies.set(authCookie.name, exchanged.rawToken, authCookie.options);
  response.cookies.set(guestCookie.name, "", { ...guestCookie.options, maxAge: 0 });
  return response;
}
