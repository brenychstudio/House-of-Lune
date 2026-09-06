import { after, NextRequest, NextResponse } from "next/server";

import { createPool } from "@/platform/db/pool";
import { prepareAccountAccess } from "@/platform/db/services/customerAccountService";
import { passwordlessDeliveryForEnvironment } from "@/platform/identity/developmentDelivery";
import { clientAbuseScope, isSameOriginMutation } from "@/platform/identity/requestSecurity";

export const dynamic = "force-dynamic";

const generic = { message: "If this address is eligible, an access link will be sent." } as const;
const PUBLIC_ACCESS_RESPONSE_FLOOR_MS = 350;

async function waitForPublicResponseFloor(startedAt: number) {
  const remaining = PUBLIC_ACCESS_RESPONSE_FLOOR_MS - (performance.now() - startedAt);
  if (remaining > 0) await new Promise((resolve) => setTimeout(resolve, remaining));
}

export async function POST(request: NextRequest) {
  const startedAt = performance.now();
  if (!isSameOriginMutation(request)) return NextResponse.json({ message: "Request rejected." }, { status: 403 });
  try {
    const body = await request.json() as { email?: unknown; locale?: unknown };
    const pool = createPool({ max: 1, connectionTimeoutMillis: 1200, statement_timeout: 2000 });
    try {
      const prepared = await prepareAccountAccess(pool, {
        email: typeof body.email === "string" ? body.email : "",
        locale: body.locale === "en" ? "en" : "en",
        callerScope: clientAbuseScope(request),
      });
      if (prepared.delivery) {
        const delivery = passwordlessDeliveryForEnvironment();
        after(async () => {
          try { await delivery.deliverAccountLink(prepared.delivery!); }
          catch { /* Public response remains independent of provider state. */ }
        });
      }
    } finally {
      await pool.end();
    }
  } catch {
    // The public response is intentionally invariant for eligibility and delivery failures.
  }
  await waitForPublicResponseFloor(startedAt);
  return NextResponse.json(generic, {
    status: 202,
    headers: { "Cache-Control": "no-store, private", "Referrer-Policy": "no-referrer" },
  });
}
