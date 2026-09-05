export type SpatialCapability = Readonly<{
  state: "fallback-only" | "eligible" | "unavailable" | "failed";
  reason: "foundation" | "reduced-motion" | "save-data" | "device" | "runtime-error";
}>;

export const foundationSpatialCapability: SpatialCapability = {
  state: "fallback-only",
  reason: "foundation",
};
