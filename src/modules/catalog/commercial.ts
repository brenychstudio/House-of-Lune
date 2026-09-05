import type { AcquisitionMode, FulfillmentMode, ProductStatus, ScarcityMode } from "./domain";

export type CommercialProfile = Readonly<{
  status: ProductStatus;
  scarcityMode: ScarcityMode;
  acquisitionMode: AcquisitionMode;
}>;

export type VariantConfiguration = Readonly<{
  finishCode: string;
  finishName: string;
  fulfillmentMode: FulfillmentMode;
  leadTimeMinDays: number | null;
  leadTimeMaxDays: number | null;
}>;

export function validateCommercialProfile(input: CommercialProfile): void {
  if (!["DRAFT", "ACTIVE", "ARCHIVED"].includes(input.status) ||
      !["UNDECIDED", "CORE", "LIMITED", "UNIQUE_ATELIER"].includes(input.scarcityMode) ||
      !["NOT_FOR_SALE", "PURCHASABLE", "INQUIRY_ONLY"].includes(input.acquisitionMode)) {
    throw new Error("Invalid commercial profile");
  }
  if (input.status !== "ACTIVE" && input.acquisitionMode !== "NOT_FOR_SALE") {
    throw new Error("Non-active products must be NOT_FOR_SALE");
  }
  if (input.status === "ACTIVE" && input.scarcityMode === "UNDECIDED") {
    throw new Error("UNDECIDED scarcity cannot be activated");
  }
}

export function validateVariantConfiguration(input: VariantConfiguration): void {
  if (!/^[A-Z0-9]+(?:-[A-Z0-9]+)*$/.test(input.finishCode) || !input.finishName.trim()) {
    throw new Error("Stable finish code and display name are required");
  }
  if (!["IN_STOCK", "MADE_TO_ORDER", "BESPOKE"].includes(input.fulfillmentMode)) {
    throw new Error("Invalid fulfillment mode");
  }
  const { leadTimeMinDays: min, leadTimeMaxDays: max } = input;
  if (min === null && max === null) return;
  if (min === null || max === null || !Number.isSafeInteger(min) || !Number.isSafeInteger(max) ||
      min <= 0 || max < min || input.fulfillmentMode !== "MADE_TO_ORDER") {
    throw new Error("Invalid production lead-time promise");
  }
}
