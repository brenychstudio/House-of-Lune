import type { Result } from "@/modules/shared/valueObjects";

export type CustomerIdentityEvidence = Readonly<{
  name?: string;
  verifiedEmail?: string;
  verifiedExternalSubject?: string;
}>;

export function canMergeCustomerRecords(
  left: CustomerIdentityEvidence,
  right: CustomerIdentityEvidence,
): Result<true> {
  const matchingEmail =
    left.verifiedEmail !== undefined && left.verifiedEmail === right.verifiedEmail;
  const matchingSubject =
    left.verifiedExternalSubject !== undefined &&
    left.verifiedExternalSubject === right.verifiedExternalSubject;

  if (!matchingEmail && !matchingSubject) {
    return {
      ok: false,
      error: {
        code: "INSUFFICIENT_IDENTITY_EVIDENCE",
        message: "Customer records require a shared verified identifier; names are not identity proof",
      },
    };
  }
  return { ok: true, value: true };
}

export type Customer = Readonly<{
  id: string;
  email: string;
  accountState: "GUEST" | "INVITED" | "ACTIVE" | "DISABLED";
  displayName: string | null;
}>;
