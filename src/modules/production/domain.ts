import type { Result } from "@/modules/shared/valueObjects";

export type ProductionState =
  | "QUEUED"
  | "MATERIAL_PREP"
  | "FABRICATION"
  | "CLEANUP"
  | "FINISHING"
  | "ASSEMBLY_FIT"
  | "QUALITY_CONTROL"
  | "RETURNED_TO_FINISHING"
  | "READY_FOR_PACKAGING"
  | "PACKAGED"
  | "READY_TO_SHIP";

const transitions: Readonly<Record<ProductionState, readonly ProductionState[]>> = {
  QUEUED: ["MATERIAL_PREP"],
  MATERIAL_PREP: ["FABRICATION"],
  FABRICATION: ["CLEANUP"],
  CLEANUP: ["FINISHING"],
  FINISHING: ["ASSEMBLY_FIT", "QUALITY_CONTROL"],
  ASSEMBLY_FIT: ["QUALITY_CONTROL"],
  QUALITY_CONTROL: ["READY_FOR_PACKAGING", "RETURNED_TO_FINISHING"],
  RETURNED_TO_FINISHING: ["FINISHING"],
  READY_FOR_PACKAGING: ["PACKAGED"],
  PACKAGED: ["READY_TO_SHIP"],
  READY_TO_SHIP: [],
};

export function transitionProduction(from: ProductionState, to: ProductionState): Result<ProductionState> {
  return transitions[from].includes(to)
    ? { ok: true, value: to }
    : { ok: false, error: { code: "ILLEGAL_TRANSITION", message: `${from} cannot transition to ${to}` } };
}

export type ProductionRecipe = Readonly<{
  id: string;
  productFamily: string;
  revision: string;
  stages: readonly ProductionState[];
  leadTimeDays: number;
}>;
