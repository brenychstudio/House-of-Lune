import { notFound } from "next/navigation";

import { PageShell } from "@/components/layout/PageShell";
import { CraftInDetail } from "@/components/sections/CraftInDetail";
import { FeaturedCollection } from "@/components/sections/FeaturedCollection";
import { HomeHero } from "@/components/sections/HomeHero";
import { IntroManifesto } from "@/components/sections/IntroManifesto";
import { JournalPreview } from "@/components/sections/JournalPreview";
import { MaisonPreview } from "@/components/sections/MaisonPreview";
import { PrivateInquiry } from "@/components/sections/PrivateInquiry";
import { SignatureStory } from "@/components/sections/SignatureStory";
import { getHomeContent } from "@/content/home";
import { isValidLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";

type LocaleHomePageProps = {
  params: Promise<{ lang: string }>;
};

export default async function LocaleHomePage({ params }: LocaleHomePageProps) {
  const { lang } = await params;

  if (!isValidLocale(lang)) {
    notFound();
  }

  const dictionary = await getDictionary(lang);
  const homeContent = getHomeContent(dictionary, lang);

  return (
    <PageShell dictionary={dictionary} lang={lang}>
      <div className="bg-[radial-gradient(circle_at_50%_8%,rgba(255,255,255,0.06),transparent_50%)]">
        <HomeHero homeContent={homeContent} />
      </div>
      <IntroManifesto homeContent={homeContent} />
      <FeaturedCollection homeContent={homeContent} lang={lang} />
      <div className="bg-[linear-gradient(180deg,rgba(255,255,255,0.01),rgba(255,255,255,0))]">
        <CraftInDetail homeContent={homeContent} />
      </div>
      <SignatureStory homeContent={homeContent} lang={lang} />
      <div className="bg-[linear-gradient(180deg,rgba(255,255,255,0.012),rgba(255,255,255,0))]">
        <MaisonPreview homeContent={homeContent} />
      </div>
      <JournalPreview homeContent={homeContent} />
      <PrivateInquiry homeContent={homeContent} lang={lang} />
    </PageShell>
  );
}
