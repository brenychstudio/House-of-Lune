import type { AcquisitionMode, FulfillmentMode, ProductStatus, ScarcityMode } from "./domain";
import type { PublicAvailability } from "./availability";
import type { Currency, Market } from "@/modules/shared/valueObjects";

export type PublicPrice = Readonly<{
  priceBookId: string; revision: string; market: Market; currency: Currency; minorUnits: string;
}>;
export type PublicVariant = Readonly<{
  variantId: string;
  finishCode: string;
  finishName: string;
  fulfillmentMode: FulfillmentMode;
  price: PublicPrice | null;
  availability: PublicAvailability;
  madeToOrder: { minDays: number; maxDays: number } | null;
  edition: { size: number; remaining: number } | null;
}>;
export type PublicObject = Readonly<{
  productId: string;
  productSlug: string;
  name: string;
  status: ProductStatus;
  scarcityMode: ScarcityMode;
  acquisitionMode: AcquisitionMode;
  availability: PublicAvailability;
  variants: readonly PublicVariant[];
}>;
