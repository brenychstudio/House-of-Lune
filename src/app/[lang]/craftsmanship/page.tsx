import { notFound } from "next/navigation";

import { CraftHero } from "@/components/craft/CraftHero";
import { CraftMaterialStudy } from "@/components/craft/CraftMaterialStudy";
import { CraftPrecisionNotes } from "@/components/craft/CraftPrecisionNotes";
import { CraftProcessChapters } from "@/components/craft/CraftProcessChapters";
import { PageShell } from "@/components/layout/PageShell";
import { getCraftContent } from "@/content/craft";
import { isValidLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";

export default async function CraftsmanshipPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isValidLocale(lang)) notFound();

  const dictionary = await getDictionary(lang);
  const content = getCraftContent(dictionary, lang);

  return (
    <PageShell dictionary={dictionary} lang={lang}>
      <CraftHero {...content.hero} />
      <CraftProcessChapters title={content.process.title} chapters={content.process.chapters} />
      <CraftMaterialStudy title={content.materialStudy.title} line={content.materialStudy.line} image={content.materialStudy.image} />
      <CraftPrecisionNotes
        title={content.precisionNotes.title}
        items={content.precisionNotes.items}
        collectionLabel={content.cta.collectionLabel}
        collectionHref={content.cta.collectionHref}
        inquiryLabel={content.cta.inquiryLabel}
        inquiryHref={content.cta.inquiryHref}
      />
    </PageShell>
  );
}
