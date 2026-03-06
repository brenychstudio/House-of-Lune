import Image from "next/image";

import { getHomeContent } from "@/content/home";
import { LinkArrow } from "@/components/ui/LinkArrow";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Locale } from "@/i18n/config";

type SignatureStoryProps = {
  homeContent: ReturnType<typeof getHomeContent>;
  lang: Locale;
};

export function SignatureStory({ homeContent, lang }: SignatureStoryProps) {
  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-30 lg:px-10">
      <SectionHeading eyebrow={homeContent.signature.eyebrow} title={homeContent.signature.title} description={homeContent.signature.description} />
      <div className="mt-10 grid items-end gap-8 lg:grid-cols-[1fr_1.1fr]">
        <div className="max-w-3xl text-[var(--color-text-muted)]">
          <p>{homeContent.signature.body}</p>
        </div>
        <div className="surface-frame relative aspect-[16/9] overflow-hidden rounded-2xl">
          <Image src={homeContent.visuals.signatureCampaign} alt="Hero ring still-life campaign frame" fill sizes="(min-width: 1024px) 44vw, 100vw" className="object-cover opacity-74" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,3,8,0.08),rgba(2,3,8,0.56))]" />
        </div>
      </div>
      <div className="mt-10">
        <LinkArrow href={`/${lang}/journal`}>{homeContent.signature.cta}</LinkArrow>
      </div>
    </section>
  );
}
