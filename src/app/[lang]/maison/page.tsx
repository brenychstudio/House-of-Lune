import { notFound } from "next/navigation";

import { PageShell } from "@/components/layout/PageShell";
import { MaisonAtelierPreview } from "@/components/maison/MaisonAtelierPreview";
import { MaisonHero } from "@/components/maison/MaisonHero";
import { MaisonMaterialLanguage } from "@/components/maison/MaisonMaterialLanguage";
import { MaisonPhilosophy } from "@/components/maison/MaisonPhilosophy";
import { getMaisonContent } from "@/content/maison";
import { isValidLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";

export default async function MaisonPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isValidLocale(lang)) notFound();

  const dictionary = await getDictionary(lang);
  const content = getMaisonContent(dictionary, lang);

  return (
    <PageShell dictionary={dictionary} lang={lang}>
      <MaisonHero {...content.hero} />
      <MaisonPhilosophy title={content.philosophy.title} sections={content.philosophy.sections} />
      <MaisonMaterialLanguage title={content.materialLanguage.title} notes={content.materialLanguage.notes} image={content.materialLanguage.image} />
      <MaisonAtelierPreview
        title={content.atelierPreview.title}
        lead={content.atelierPreview.lead}
        note={content.atelierPreview.note}
        image={content.atelierPreview.image}
        collectionLabel={content.cta.collectionLabel}
        collectionHref={content.cta.collectionHref}
        inquiryLabel={content.cta.inquiryLabel}
        inquiryHref={content.cta.inquiryHref}
      />
    </PageShell>
  );
}
