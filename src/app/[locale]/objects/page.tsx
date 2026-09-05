import type { Metadata } from "next";
import Link from "next/link";

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

export default function ObjectsPage() {
  return (
    <FoundationPage intro={content.pages.objects}>
      <section className="object-index" aria-labelledby="mask-01-title">
        <p className="eyebrow">Foundation object</p>
        <h2 id="mask-01-title">{content.object.name}</h2>
        <p>{content.object.descriptor}</p>
        <p className="object-status">{content.object.statusLabel}</p>
        <Link className="text-link" href="/en/objects/mask-01">
          Examine the foundation <span aria-hidden="true">↗</span>
        </Link>
      </section>
    </FoundationPage>
  );
}
