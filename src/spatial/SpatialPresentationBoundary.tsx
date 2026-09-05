import type { ReactNode } from "react";

import { foundationSpatialCapability } from "@/spatial/contracts/SpatialCapability";
import type { SpatialPresentationManifest } from "@/spatial/contracts/SpatialPresentationManifest";
import { SpatialFallback } from "@/spatial/fallback/SpatialFallback";

type SpatialPresentationBoundaryProps = Readonly<{
  manifest: SpatialPresentationManifest;
  children: ReactNode;
}>;

export function SpatialPresentationBoundary({
  manifest,
  children,
}: SpatialPresentationBoundaryProps) {
  return (
    <section
      className="spatial-boundary"
      data-spatial-capability={foundationSpatialCapability.state}
    >
      <div className="spatial-boundary__content">{children}</div>
      <SpatialFallback manifest={manifest} />
    </section>
  );
}
