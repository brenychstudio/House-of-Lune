import "server-only";

import type { Pool } from "pg";
import type { NextRequest } from "next/server";

import { createPool } from "@/platform/db/pool";
import { findActiveSession } from "@/platform/db/repositories/customerRepository";
import { authCookieContract } from "@/platform/identity/cookies";
import { requestUsesSecureCookies } from "@/platform/identity/requestSecurity";
import { hashOpaqueToken } from "@/platform/identity/tokens";

export async function withAuthenticatedRequest<T>(
  request: NextRequest,
  work: (input: Readonly<{ pool: Pool; session: NonNullable<Awaited<ReturnType<typeof findActiveSession>>> }>) => Promise<T>,
) {
  const cookie = authCookieContract(requestUsesSecureCookies(request));
  const rawToken = request.cookies.get(cookie.name)?.value;
  if (!rawToken) return null;
  const pool = createPool({ max: 1, connectionTimeoutMillis: 1200, statement_timeout: 2000 });
  try {
    const session = await findActiveSession(pool, await hashOpaqueToken(rawToken), new Date());
    return session ? await work({ pool, session }) : null;
  } finally {
    await pool.end();
  }
}
