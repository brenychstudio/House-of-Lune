import { NextRequest, NextResponse } from "next/server";

import type { CustomerAddressInput } from "@/modules/customers/account";
import { deleteAddressForCustomer, updateAddressForCustomer } from "@/platform/db/repositories/addressRepository";
import { withTransaction } from "@/platform/db/transaction";
import { isSameOriginMutation } from "@/platform/identity/requestSecurity";
import { withAuthenticatedRequest } from "@/site/account/authenticatedRequest";

export const dynamic = "force-dynamic";

export async function PATCH(request: NextRequest, context: { params: Promise<{ addressId: string }> }) {
  if (!isSameOriginMutation(request)) return NextResponse.json({ message: "Request rejected." }, { status: 403 });
  try {
    const { addressId } = await context.params;
    const body = await request.json() as CustomerAddressInput;
    const result = await withAuthenticatedRequest(request, ({ pool, session }) =>
      withTransaction(pool, (client) => updateAddressForCustomer(client, session.customerId, addressId, body)));
    if (!result) return NextResponse.json({ message: "Address not found." }, { status: 404 });
    return NextResponse.json({ address: result }, { headers: { "Cache-Control": "no-store, private" } });
  } catch {
    return NextResponse.json({ message: "Review the address fields." }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ addressId: string }> }) {
  if (!isSameOriginMutation(request)) return NextResponse.json({ message: "Request rejected." }, { status: 403 });
  try {
    const { addressId } = await context.params;
    const deleted = await withAuthenticatedRequest(request, ({ pool, session }) =>
      withTransaction(pool, (client) => deleteAddressForCustomer(client, session.customerId, addressId)));
    if (!deleted) return NextResponse.json({ message: "Address not found." }, { status: 404 });
    return new NextResponse(null, { status: 204, headers: { "Cache-Control": "no-store, private" } });
  } catch {
    return NextResponse.json({ message: "Address unavailable." }, { status: 503 });
  }
}
