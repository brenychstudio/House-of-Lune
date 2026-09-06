import { normalizeEmail, type Result } from "@/modules/shared/valueObjects";

export type AccountState = "GUEST" | "INVITED" | "ACTIVE" | "DISABLED";
export type PasswordlessPurpose = "ACCOUNT_ACTIVATION" | "SIGN_IN";

export type CustomerAddressInput = Readonly<{
  kind: "SHIPPING" | "BILLING";
  recipientName: string;
  line1: string;
  line2?: string | null;
  city: string;
  region?: string | null;
  postalCode: string;
  countryCode: string;
}>;

function failure(code: string, message: string): Result<never> {
  return { ok: false, error: { code, message } };
}

export const normalizeCustomerEmail = normalizeEmail;

export function canTransitionAccount(from: AccountState, to: AccountState): Result<true> {
  if (from === to) return { ok: true, value: true };
  const allowed =
    (from === "GUEST" && to === "INVITED") ||
    (from === "INVITED" && to === "ACTIVE") ||
    (from !== "DISABLED" && to === "DISABLED");
  return allowed
    ? { ok: true, value: true }
    : failure("INVALID_ACCOUNT_TRANSITION", `Cannot transition account from ${from} to ${to}`);
}

export function evaluateSession(
  session: Readonly<{
    revokedAt: Date | null;
    idleExpiresAt: Date;
    absoluteExpiresAt: Date;
    accountState: AccountState;
  }>,
  now = new Date(),
): Result<true> {
  if (session.accountState !== "ACTIVE") {
    return failure("ACCOUNT_NOT_ACTIVE", "Authenticated account access is unavailable");
  }
  if (session.revokedAt !== null) return failure("SESSION_REVOKED", "Session is revoked");
  if (now >= session.idleExpiresAt) return failure("SESSION_IDLE_EXPIRED", "Session expired");
  if (now >= session.absoluteExpiresAt) return failure("SESSION_ABSOLUTE_EXPIRED", "Session expired");
  return { ok: true, value: true };
}

export function validateAddress(input: CustomerAddressInput): Result<CustomerAddressInput> {
  const required = [input.recipientName, input.line1, input.city, input.postalCode];
  if (required.some((value) => value.trim().length === 0)) {
    return failure("INVALID_ADDRESS", "Complete every required address field");
  }
  if (!/^[A-Z]{2}$/.test(input.countryCode)) {
    return failure("INVALID_COUNTRY_CODE", "Country must use a two-letter code");
  }
  if (!(["SHIPPING", "BILLING"] as const).includes(input.kind)) {
    return failure("INVALID_ADDRESS_KIND", "Address kind is invalid");
  }
  return {
    ok: true,
    value: Object.freeze({
      ...input,
      recipientName: input.recipientName.trim(),
      line1: input.line1.trim(),
      line2: input.line2?.trim() || null,
      city: input.city.trim(),
      region: input.region?.trim() || null,
      postalCode: input.postalCode.trim(),
    }),
  };
}

export function canReadOwnedOrder(authenticatedCustomerId: string, orderCustomerId: string | null) {
  return orderCustomerId !== null && orderCustomerId === authenticatedCustomerId;
}

export function canClaimGuestOrder(input: Readonly<{
  currentOwnerId: string | null;
  guestEmail: string | null;
  verifiedEmails: readonly string[];
}>): Result<true> {
  if (input.currentOwnerId !== null) {
    return failure("ORDER_ALREADY_OWNED", "Order ownership cannot be reassigned automatically");
  }
  if (input.guestEmail === null) {
    return failure("ORDER_HAS_NO_GUEST_EMAIL", "Order has no verified claim evidence");
  }
  const guest = normalizeCustomerEmail(input.guestEmail);
  const matches = guest.ok && input.verifiedEmails.some((email) => {
    const verified = normalizeCustomerEmail(email);
    return verified.ok && verified.value === guest.value;
  });
  return matches
    ? { ok: true, value: true }
    : failure("VERIFIED_EMAIL_MISMATCH", "Verified identity does not match the guest order");
}
