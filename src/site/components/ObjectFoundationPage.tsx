import type { ObjectFoundation } from "@/site/content/contracts";
import { SpatialPresentationBoundary } from "@/spatial/SpatialPresentationBoundary";
import type { SpatialPresentationManifest } from "@/spatial/contracts/SpatialPresentationManifest";

type ObjectFoundationPageProps = Readonly<{
  object: ObjectFoundation;
}>;

export function ObjectFoundationPage({ object }: ObjectFoundationPageProps) {
  const manifest: SpatialPresentationManifest = {
    id: `${object.slug}-foundation`,
    objectSlug: object.slug,
    version: 1,
    fallback: {
      label: `${object.name} — spatial object foundation`,
      description: "The complete static view remains available regardless of device capability.",
    },
  };

  return (
    <main id="main-content" className="object-page">
      <SpatialPresentationBoundary manifest={manifest}>
        <div className="object-hero__copy">
          <p className="eyebrow">Wearable Object</p>
          <h1>{object.name}</h1>
          <p className="lede">{object.descriptor}</p>
          <p className="object-status">{object.statusLabel}</p>
        </div>
      </SpatialPresentationBoundary>

      <ol className="object-chapters" aria-label={`${object.name} chapters`}>
        {object.chapters.map((chapter, index) => (
          <li key={chapter.label}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <h2>{chapter.label}</h2>
            <p>{chapter.description}</p>
          </li>
        ))}
      </ol>
    </main>
  );
}
