import type { EntityId, Result, Sku, Slug, UtcTimestamp } from "@/modules/shared/valueObjects";

export type FulfillmentMode = "IN_STOCK" | "MADE_TO_ORDER" | "BESPOKE";
export type ScarcityMode = "UNDECIDED" | "CORE" | "LIMITED" | "UNIQUE_ATELIER";
export type AcquisitionMode = "NOT_FOR_SALE" | "PURCHASABLE" | "INQUIRY_ONLY";
export type ProductStatus = "DRAFT" | "ACTIVE" | "ARCHIVED";

export type Product = Readonly<{
  id: EntityId;
  slug: Slug;
  name: string;
  status: ProductStatus;
  scarcityMode: ScarcityMode;
  acquisitionMode: AcquisitionMode;
  createdAt: UtcTimestamp;
}>;

export type Variant = Readonly<{
  id: EntityId;
  productId: EntityId;
  sku: Sku;
  finish: string;
  finishCode: string | null;
  finishName: string;
  leadTimeMinDays: number | null;
  leadTimeMaxDays: number | null;
  fulfillmentMode: FulfillmentMode;
  active: boolean;
}>;

export type Edition = Readonly<{
  id: EntityId;
  variantId: EntityId;
  number: number;
  size: number;
  state: "AVAILABLE" | "RESERVED" | "ALLOCATED";
}>;

export type PhysicalInstance = Readonly<{
  id: EntityId;
  variantId: EntityId;
  editionId: EntityId | null;
  identityCode: string;
  designRevisionId: string;
  finishRevisionId: string;
  fitRevisionId: string;
}>;

export function createEdition(input: Readonly<{ number: number; size: number }>): Result<Readonly<{
  number: number;
  size: number;
  state: "AVAILABLE";
}>> {
  if (
    !Number.isSafeInteger(input.number) ||
    !Number.isSafeInteger(input.size) ||
    input.number < 1 ||
    input.size < 1 ||
    input.number > input.size
  ) {
    return {
      ok: false,
      error: { code: "INVALID_EDITION_BOUNDARY", message: "Edition number must be between 1 and its size" },
    };
  }
  return { ok: true, value: Object.freeze({ ...input, state: "AVAILABLE" as const }) };
}

export function createPhysicalInstance(input: Readonly<{
  identityCode: string;
  designRevisionId: string;
  finishRevisionId: string;
  fitRevisionId: string;
}>): Result<typeof input> {
  const revisions = [input.designRevisionId, input.finishRevisionId, input.fitRevisionId];
  if (!/^BR-[A-Z0-9]+-[A-Z0-9]+-\d{3,}$/.test(input.identityCode) || revisions.some((value) => value.trim() === "")) {
    return {
      ok: false,
      error: { code: "INVALID_PHYSICAL_IDENTITY", message: "Permanent identity and exact revisions are required" },
    };
  }
  return { ok: true, value: Object.freeze({ ...input }) };
}
