import { PageShell } from "@/components/layout/PageShell";
import { CraftInDetail } from "@/components/sections/CraftInDetail";
import { FeaturedCollection } from "@/components/sections/FeaturedCollection";
import { HomeHero } from "@/components/sections/HomeHero";
import { IntroManifesto } from "@/components/sections/IntroManifesto";
import { JournalPreview } from "@/components/sections/JournalPreview";
import { MaisonPreview } from "@/components/sections/MaisonPreview";
import { PrivateInquiry } from "@/components/sections/PrivateInquiry";
import { SignatureStory } from "@/components/sections/SignatureStory";

export default function Home() {
  return (
    <PageShell>
      <HomeHero />
      <IntroManifesto />
      <FeaturedCollection />
      <CraftInDetail />
      <SignatureStory />
      <MaisonPreview />
      <JournalPreview />
      <PrivateInquiry />
    </PageShell>
  );
}
