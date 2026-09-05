import type { Result } from "@/modules/shared/valueObjects";

export type ReturnState =
  | "REQUESTED"
  | "AUTHORIZED"
  | "IN_TRANSIT"
  | "RECEIVED"
  | "INSPECTED"
  | "REFUNDED"
  | "EXCHANGED"
  | "SERVICE"
  | "REJECTED";

const transitions: Readonly<Record<ReturnState, readonly ReturnState[]>> = {
  REQUESTED: ["AUTHORIZED", "REJECTED"],
  AUTHORIZED: ["IN_TRANSIT", "REJECTED"],
  IN_TRANSIT: ["RECEIVED"],
  RECEIVED: ["INSPECTED"],
  INSPECTED: ["REFUNDED", "EXCHANGED", "SERVICE", "REJECTED"],
  REFUNDED: [],
  EXCHANGED: [],
  SERVICE: [],
  REJECTED: [],
};

export function transitionReturn(from: ReturnState, to: ReturnState): Result<ReturnState> {
  return transitions[from].includes(to)
    ? { ok: true, value: to }
    : { ok: false, error: { code: "ILLEGAL_TRANSITION", message: `${from} cannot transition to ${to}` } };
}

export type ServiceCase = Readonly<{
  id: string;
  physicalInstanceId: string;
  kind: "RESTORATION" | "REPAIR" | "REPLACEMENT" | "FIT_ADJUSTMENT" | "OTHER";
  state: "OPEN" | "INSPECTION" | "APPROVED" | "IN_SERVICE" | "COMPLETED" | "CLOSED";
}>;

export type WarrantyClaim = Readonly<{
  id: string;
  physicalInstanceId: string;
  coverageBasis: "LEGAL_RIGHT" | "BRENYCH_WARRANTY" | "PAID_AFTERCARE";
  state: "SUBMITTED" | "INSPECTION" | "APPROVED" | "REJECTED" | "RESOLVED";
}>;
