export type EditionReservation = Readonly<{
  editionId: string;
  cartId: string;
  expiresAt: string;
  state: "ACTIVE" | "RELEASED" | "CONVERTED" | "EXPIRED";
}>;

export type CapacityWindow = Readonly<{
  id: string;
  variantId: string;
  startsAt: string;
  endsAt: string;
  totalUnits: number;
  reservedUnits: number;
}>;

export function availableCapacity(window: CapacityWindow): number {
  return window.totalUnits - window.reservedUnits;
}
