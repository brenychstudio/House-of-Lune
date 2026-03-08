import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { JournalFeature } from "@/components/journal/JournalFeature";
import { JournalHero } from "@/components/journal/JournalHero";
import { JournalList } from "@/components/journal/JournalList";
import { PageShell } from "@/components/layout/PageShell";
import { getJournalContent } from "@/content/journal";
import { isValidLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";
import { buildPageMetadata } from "@/lib/seo/metadata";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!isValidLocale(lang)) notFound();

  const dictionary = await getDictionary(lang);

  return buildPageMetadata({
    lang,
    path: "/journal",
    title: dictionary.pages.journal.title,
    description: dictionary.pages.journal.description,
  });
}

export default async function JournalPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isValidLocale(lang)) notFound();

  const dictionary = await getDictionary(lang);
  const content = getJournalContent(dictionary, lang);

  return (
    <PageShell dictionary={dictionary} lang={lang}>
      <JournalHero {...content.hero} />
      <JournalFeature label={content.featuredLabel} entry={content.featured} readLabel={content.entryReadLabel} />
      <JournalList
        title={content.latestLabel}
        entries={content.list}
        readLabel={content.entryReadLabel}
        maisonLabel={content.cta.maisonLabel}
        maisonHref={content.cta.maisonHref}
        collectionLabel={content.cta.collectionLabel}
        collectionHref={content.cta.collectionHref}
      />
    </PageShell>
  );
}
