import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CraftEditorialJourney } from "@/components/craft/CraftEditorialJourney";
import { CraftHero } from "@/components/craft/CraftHero";
import { PageShell } from "@/components/layout/PageShell";
import { getCraftContent } from "@/content/craft";
import { isValidLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";
import { buildPageMetadata } from "@/lib/seo/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isValidLocale(lang)) notFound();

  const dictionary = await getDictionary(lang);

  return buildPageMetadata({
    lang,
    path: "/craftsmanship",
    title: dictionary.pages.craftsmanship.title,
    description: dictionary.pages.craftsmanship.description,
  });
}

export default async function CraftsmanshipPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isValidLocale(lang)) notFound();

  const dictionary = await getDictionary(lang);
  const content = getCraftContent(dictionary, lang);

  return (
    <PageShell dictionary={dictionary} lang={lang}>
      <CraftHero {...content.hero} />

      <CraftEditorialJourney
        processTitle={content.process.title}
        chapters={content.process.chapters}
        materialStudyTitle={content.materialStudy.title}
        materialStudyLine={content.materialStudy.line}
        materialStudyImage={content.materialStudy.image}
        precisionTitle={content.precisionNotes.title}
        precisionItems={content.precisionNotes.items}
        collectionLabel={content.cta.collectionLabel}
        collectionHref={content.cta.collectionHref}
        inquiryLabel={content.cta.inquiryLabel}
        inquiryHref={content.cta.inquiryHref}
      />
    </PageShell>
  );
}
