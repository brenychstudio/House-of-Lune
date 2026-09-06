import { NextRequest, NextResponse } from "next/server";

import type { CustomerAddressInput } from "@/modules/customers/account";
import { createAddress } from "@/platform/db/repositories/addressRepository";
import { withTransaction } from "@/platform/db/transaction";
import { isSameOriginMutation } from "@/platform/identity/requestSecurity";
import { withAuthenticatedRequest } from "@/site/account/authenticatedRequest";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  if (!isSameOriginMutation(request)) return NextResponse.json({ message: "Request rejected." }, { status: 403 });
  try {
    const body = await request.json() as CustomerAddressInput;
    const result = await withAuthenticatedRequest(request, ({ pool, session }) =>
      withTransaction(pool, (client) => createAddress(client, session.customerId, body)));
    if (!result) return NextResponse.json({ message: "Address not found." }, { status: 404 });
    return NextResponse.json({ address: result }, { status: 201, headers: { "Cache-Control": "no-store, private" } });
  } catch {
    return NextResponse.json({ message: "Review the address fields." }, { status: 400 });
  }
}
