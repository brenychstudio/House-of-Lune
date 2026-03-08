import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PageShell } from "@/components/layout/PageShell";
import { PieceGallery } from "@/components/piece/PieceGallery";
import { PieceHero } from "@/components/piece/PieceHero";
import { PieceInquiry } from "@/components/piece/PieceInquiry";
import { PieceSpecs } from "@/components/piece/PieceSpecs";
import { PieceStory } from "@/components/piece/PieceStory";
import { featuredPieces } from "@/content/pieces";
import { isValidLocale, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";
import { getPieceBySlug } from "@/lib/content/getPieceBySlug";
import { buildPageMetadata } from "@/lib/seo/metadata";

export function generateStaticParams() {
  return locales.flatMap((lang) => featuredPieces.map((piece) => ({ lang, slug: piece.slug })));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string; slug: string }> }): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!isValidLocale(lang)) notFound();

  const piece = getPieceBySlug(slug);
  if (!piece) notFound();

  return buildPageMetadata({
    lang,
    path: `/piece/${piece.slug}`,
    title: piece.name,
    description: piece.shortDescription,
    image: piece.heroImage,
  });
}

export default async function PiecePage({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang, slug } = await params;
  if (!isValidLocale(lang)) notFound();

  const piece = getPieceBySlug(slug);
  if (!piece) notFound();

  const dictionary = await getDictionary(lang);

  return (
    <PageShell dictionary={dictionary} lang={lang}>
      <PieceHero piece={piece} />
      <PieceSpecs piece={piece} dictionary={dictionary} />
      <PieceGallery piece={piece} dictionary={dictionary} />
      <PieceStory piece={piece} dictionary={dictionary} />
      <PieceInquiry dictionary={dictionary} lang={lang} piece={piece} />
    </PageShell>
  );
}
