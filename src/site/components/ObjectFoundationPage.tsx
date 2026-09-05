import type { ObjectFoundation } from "@/site/content/contracts";
import type { PublicObject } from "@/modules/catalog/readModel";
import type { CatalogRead } from "@/site/catalog/readCatalog";
import { CatalogCommercialState } from "./CatalogCommercialState";
import { SpatialPresentationBoundary } from "@/spatial/SpatialPresentationBoundary";
import type { SpatialPresentationManifest } from "@/spatial/contracts/SpatialPresentationManifest";

type ObjectFoundationPageProps = Readonly<{
  object: ObjectFoundation;
  result: CatalogRead<PublicObject | null>;
}>;

export function ObjectFoundationPage({ object, result }: ObjectFoundationPageProps) {
  const canonical = result.state === "READY" ? result.data : null;
  const name = canonical?.name ?? object.name;
  const slug = canonical?.productSlug ?? object.slug;
  const hasEditorial = slug === object.slug;
  const manifest: SpatialPresentationManifest = {
    id: `${slug}-foundation`,
    objectSlug: slug,
    version: 1,
    fallback: {
      label: `${name} — spatial object foundation`,
      description: "The complete static view remains available regardless of device capability.",
    },
  };

  return (
    <main id="main-content" className="object-page">
      <SpatialPresentationBoundary manifest={manifest}>
        <div className="object-hero__copy">
          <p className="eyebrow">Wearable Object</p>
          <h1>{name}</h1>
          {hasEditorial && <p className="lede">{object.descriptor}</p>}
          <CatalogCommercialState result={result} />
        </div>
      </SpatialPresentationBoundary>

      {hasEditorial && <ol className="object-chapters" aria-label={`${name} chapters`}>
        {object.chapters.map((chapter, index) => (
          <li key={chapter.label}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <h2>{chapter.label}</h2>
            <p>{chapter.description}</p>
          </li>
        ))}
      </ol>}
    </main>
  );
}
