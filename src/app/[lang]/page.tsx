import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PageShell } from "@/components/layout/PageShell";
import { EditorialReveal } from "@/components/motion/EditorialReveal";
import { FeaturedCollection } from "@/components/sections/FeaturedCollection";
import { HomeHero } from "@/components/sections/HomeHero";
import { IntroManifesto } from "@/components/sections/IntroManifesto";
import JournalPreview from "@/components/sections/JournalPreview";
import MaisonPreview from "@/components/sections/MaisonPreview";
import HomeEditorialStage from "@/components/sections/HomeEditorialStage";
import PrivateInquiry from "@/components/sections/PrivateInquiry";
import { getHomeContent } from "@/content/home";
import { isValidLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";
import { buildPageMetadata, getDefaultDescription } from "@/lib/seo/metadata";

type LocaleHomePageProps = {
  params: Promise<{ lang: string }>;
};

export async function generateMetadata({
  params,
}: LocaleHomePageProps): Promise<Metadata> {
  const { lang } = await params;
  if (!isValidLocale(lang)) notFound();

  const dictionary = await getDictionary(lang);

  return buildPageMetadata({
    lang,
    path: "",
    title: dictionary.site.brand,
    description: dictionary.home.hero.body || getDefaultDescription(lang),
  });
}

export default async function LocaleHomePage({
  params,
}: LocaleHomePageProps) {
  const { lang } = await params;

  if (!isValidLocale(lang)) {
    notFound();
  }

  const dictionary = await getDictionary(lang);
  const homeContent = getHomeContent(dictionary, lang);

  return (
    <PageShell dictionary={dictionary} lang={lang}>
      <div className="relative isolate">
        <div className="bg-[radial-gradient(circle_at_50%_8%,rgba(255,255,255,0.06),transparent_50%)]">
          <HomeHero homeContent={homeContent} />
        </div>

        <EditorialReveal variant="text" delay={0.04} className="relative z-10">
          <IntroManifesto homeContent={homeContent} />
        </EditorialReveal>

        <EditorialReveal
          variant="section"
          delay={0.08}
          className="relative z-10"
        >
          <FeaturedCollection homeContent={homeContent} lang={lang} />
        </EditorialReveal>

        <div className="relative z-10">
          <HomeEditorialStage />
        </div>

        <EditorialReveal
          variant="image"
          delay={0.04}
          className="relative z-10"
        >
          <MaisonPreview />
        </EditorialReveal>

        <EditorialReveal
          variant="section"
          delay={0.06}
          className="relative z-10"
        >
          <JournalPreview />
        </EditorialReveal>

        <EditorialReveal
          variant="section"
          delay={0.05}
          className="relative z-10 pb-8 sm:pb-10 lg:pb-14"
        >
          <PrivateInquiry />
        </EditorialReveal>
      </div>
    </PageShell>
  );
}
