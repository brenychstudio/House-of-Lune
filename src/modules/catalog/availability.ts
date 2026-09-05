import type { CommercialProfile } from "./commercial";
import type { FulfillmentMode } from "./domain";

export type PublicAvailability = "NOT_FOR_SALE" | "IN_STOCK" | "MADE_TO_ORDER" | "INQUIRY" | "SOLD_OUT" | "UNAVAILABLE";
export type AvailabilityInput = CommercialProfile & Readonly<{
  variantActive: boolean;
  fulfillmentMode: FulfillmentMode;
  hasPrice: boolean;
  inventoryAvailable: number;
  capacityAvailable: number;
  editionAvailable: number;
  editionSize: number | null;
  leadTimeMinDays: number | null;
  leadTimeMaxDays: number | null;
}>;

export function deriveAvailability(input: AvailabilityInput): PublicAvailability {
  if (input.status !== "ACTIVE" || input.acquisitionMode === "NOT_FOR_SALE") return "NOT_FOR_SALE";
  if (!input.variantActive || input.scarcityMode === "UNDECIDED") return "UNAVAILABLE";
  if (input.acquisitionMode === "INQUIRY_ONLY" || input.fulfillmentMode === "BESPOKE") return "INQUIRY";
  if (!input.hasPrice) return "UNAVAILABLE";
  if (input.scarcityMode === "LIMITED" || input.scarcityMode === "UNIQUE_ATELIER") {
    if (!input.editionSize) return "UNAVAILABLE";
    if (input.editionAvailable <= 0) return "SOLD_OUT";
  }
  if (input.fulfillmentMode === "IN_STOCK") return input.inventoryAvailable > 0 ? "IN_STOCK" : "SOLD_OUT";
  if (input.fulfillmentMode === "MADE_TO_ORDER") {
    const min = input.leadTimeMinDays;
    const max = input.leadTimeMaxDays;
    return min !== null && max !== null && min > 0 && max >= min && input.capacityAvailable > 0
      ? "MADE_TO_ORDER" : "UNAVAILABLE";
  }
  return "UNAVAILABLE";
}
