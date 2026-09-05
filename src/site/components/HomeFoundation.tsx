import Link from "next/link";

import type { SiteContent } from "@/site/content";
import { SpatialPresentationBoundary } from "@/spatial/SpatialPresentationBoundary";
import type { SpatialPresentationManifest } from "@/spatial/contracts/SpatialPresentationManifest";

const homeSpatialManifest: SpatialPresentationManifest = {
  id: "home-mask-01-foundation",
  objectSlug: "mask-01",
  version: 1,
  fallback: {
    label: "MASK 01 — spatial preview foundation",
    description: "A static, accessible study stands in for the future progressive spatial layer.",
  },
};

type HomeFoundationProps = Readonly<{
  content: SiteContent;
}>;

export function HomeFoundation({ content }: HomeFoundationProps) {
  return (
    <main id="main-content" className="home-foundation">
      <SpatialPresentationBoundary manifest={homeSpatialManifest}>
        <div className="home-hero__copy">
          <p className="eyebrow">{content.home.eyebrow}</p>
          <h1>{content.home.headline}</h1>
          <p className="lede">{content.home.introduction}</p>
          <div className="home-hero__actions">
            <Link className="button button--primary" href={`/${content.locale}/objects`}>
              {content.home.objectsCta}
            </Link>
            <Link className="button" href={`/${content.locale}/private-inquiry`}>
              {content.home.inquiryCta}
            </Link>
          </div>
        </div>
      </SpatialPresentationBoundary>

      <section className="foundation-statement">
        <p className="eyebrow">A restrained beginning</p>
        <p>
          The foundation establishes authorship, truthful product states, and a complete
          non-spatial experience before commerce or richer presentation layers are opened.
        </p>
      </section>
    </main>
  );
}
