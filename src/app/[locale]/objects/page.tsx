import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { storefrontObjects, catalogMarket } from "@/site/catalog/gateway";
import { CatalogCommercialState } from "@/site/components/CatalogCommercialState";

import { FoundationPage } from "@/site/components/FoundationPage";
import { getSiteContent } from "@/site/content";
import { defaultLocale } from "@/site/i18n/config";
import { pageMetadata } from "@/site/seo/metadata";

const content = getSiteContent(defaultLocale);

export const metadata: Metadata = pageMetadata(
  "Objects",
  content.pages.objects.description,
  "/en/objects",
);

export default async function ObjectsPage({ searchParams }: { searchParams: Promise<{ market?: string | string[] }> }) {
  await connection();
  const market = catalogMarket((await searchParams).market);
  const result = await storefrontObjects(market);
  return (
    <FoundationPage intro={content.pages.objects}>
      {result.state === "READY" && result.data.map(object => (
        <section className="object-index" key={object.productId} aria-labelledby={object.productId}>
          <h2 id={object.productId}>{object.name}</h2>
          <CatalogCommercialState result={{ state: "READY", data: object }} />
          <Link className="text-link" href={`/en/objects/${object.productSlug}?market=${market}`}>Examine object</Link>
        </section>
      ))}
      {(result.state === "UNAVAILABLE" || !result.data.some(object => object.productSlug === content.object.slug)) && (
        <section className="object-index" aria-labelledby="editorial-mask-title">
          {result.state === "UNAVAILABLE" && <p className="object-status" role="status">Commercial data temporarily unavailable</p>}
          <p className="eyebrow">Studio development study</p>
          <h2 id="editorial-mask-title">{content.object.name}</h2>
          <p>{content.object.descriptor}</p>
          <Link className="text-link" href="/en/objects/mask-01">Examine the study</Link>
        </section>
      )}
    </FoundationPage>
  );
}
