export type CartBinding =
  | Readonly<{ kind: "guest"; guestToken: string }>
  | Readonly<{ kind: "customer"; customerId: string }>;

export function createCartBinding(input: { guestToken: string }): CartBinding {
  if (!/^guest_[A-Za-z0-9]{16,}$/.test(input.guestToken)) {
    throw new Error("Guest token is invalid");
  }
  return Object.freeze({ kind: "guest", guestToken: input.guestToken });
}

export function linkCartToCustomer(_binding: CartBinding, customerId: string): CartBinding {
  return Object.freeze({ kind: "customer", customerId });
}

export type Cart = Readonly<{
  id: string;
  binding: CartBinding;
  market: "EU" | "UK" | "US";
  state: "OPEN" | "CONVERTED" | "ABANDONED";
}>;
