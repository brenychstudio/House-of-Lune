import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CollectionGrid } from "@/components/collection/CollectionGrid";
import { CollectionHero } from "@/components/collection/CollectionHero";
import { PageShell } from "@/components/layout/PageShell";
import { EditorialReveal } from "@/components/motion/EditorialReveal";
import { ImageDrift } from "@/components/motion/ImageDrift";
import { isValidLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";
import { buildPageMetadata } from "@/lib/seo/metadata";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!isValidLocale(lang)) notFound();

  const dictionary = await getDictionary(lang);

  return buildPageMetadata({
    lang,
    path: "/collection",
    title: dictionary.pages.collection.title,
    description: dictionary.pages.collection.description,
  });
}

export default async function CollectionPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isValidLocale(lang)) notFound();

  const dictionary = await getDictionary(lang);

  return (
    <PageShell dictionary={dictionary} lang={lang}>
      <EditorialReveal variant="image">
        <ImageDrift>
          <CollectionHero dictionary={dictionary} />
        </ImageDrift>
      </EditorialReveal>
      <EditorialReveal variant="section" delay={0.05}>
        <CollectionGrid lang={lang} dictionary={dictionary} />
      </EditorialReveal>
    </PageShell>
  );
}
