import { addMoney, subtractMoney } from "@/modules/shared/valueObjects";
import type { Money, Result } from "@/modules/shared/valueObjects";

export type OrderState = "PENDING" | "PAID" | "FULFILLMENT" | "COMPLETED" | "CANCELLED" | "REFUNDED";

const allowedTransitions: Readonly<Record<OrderState, readonly OrderState[]>> = {
  PENDING: ["PAID", "CANCELLED"],
  PAID: ["FULFILLMENT", "REFUNDED"],
  FULFILLMENT: ["COMPLETED", "REFUNDED"],
  COMPLETED: ["REFUNDED"],
  CANCELLED: [],
  REFUNDED: [],
};

export function transitionOrder(from: OrderState, to: OrderState): Result<OrderState> {
  return allowedTransitions[from].includes(to)
    ? { ok: true, value: to }
    : { ok: false, error: { code: "ILLEGAL_TRANSITION", message: `${from} cannot transition to ${to}` } };
}

export type OrderSnapshotInput = Readonly<{
  productId: string;
  productName: string;
  variantId: string;
  sku: string;
  finish: string;
  editionNumber: number | null;
  unitPrice: Money;
  quantity: number;
  tax: Money;
  duties: Money;
  shipping: Money;
  discount: Money;
  priceBookRevision: string;
  designRevisionId: string;
}>;

export type OrderSnapshot = Readonly<OrderSnapshotInput & { subtotal: Money; total: Money }>;

export function buildOrderSnapshot(input: OrderSnapshotInput): Result<OrderSnapshot> {
  if (!Number.isSafeInteger(input.quantity) || input.quantity < 1) {
    return { ok: false, error: { code: "INVALID_QUANTITY", message: "Quantity must be a positive integer" } };
  }

  const values = [input.tax, input.duties, input.shipping, input.discount];
  if (values.some((value) => value.currency !== input.unitPrice.currency)) {
    return { ok: false, error: { code: "CURRENCY_MISMATCH", message: "Snapshot money currencies must match" } };
  }

  const subtotal: Money = Object.freeze({
    minorUnits: input.unitPrice.minorUnits * BigInt(input.quantity),
    currency: input.unitPrice.currency,
  });
  const plusTax = addMoney(subtotal, input.tax);
  const plusDuties = plusTax.ok ? addMoney(plusTax.value, input.duties) : plusTax;
  const plusShipping = plusDuties.ok ? addMoney(plusDuties.value, input.shipping) : plusDuties;
  const total = plusShipping.ok ? subtractMoney(plusShipping.value, input.discount) : plusShipping;
  if (!total.ok) return total;

  const snapshot: OrderSnapshot = {
    ...input,
    unitPrice: Object.freeze({ ...input.unitPrice }),
    tax: Object.freeze({ ...input.tax }),
    duties: Object.freeze({ ...input.duties }),
    shipping: Object.freeze({ ...input.shipping }),
    discount: Object.freeze({ ...input.discount }),
    subtotal,
    total: Object.freeze({ ...total.value }),
  };
  return { ok: true, value: Object.freeze(snapshot) };
}

export type PaymentState = "REQUIRES_ACTION" | "AUTHORIZED" | "CAPTURED" | "FAILED" | "REFUNDED";
export type RefundState = "REQUESTED" | "PROCESSING" | "SUCCEEDED" | "FAILED";
