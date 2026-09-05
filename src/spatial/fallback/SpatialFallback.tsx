import type { SpatialPresentationManifest } from "@/spatial/contracts/SpatialPresentationManifest";

type SpatialFallbackProps = Readonly<{
  manifest: SpatialPresentationManifest;
}>;

export function SpatialFallback({ manifest }: SpatialFallbackProps) {
  return (
    <figure className="spatial-fallback" aria-label={manifest.fallback.label}>
      <div className="spatial-fallback__form" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <figcaption>
        <span>{manifest.fallback.label}</span>
        <small>{manifest.fallback.description}</small>
      </figcaption>
    </figure>
  );
}
