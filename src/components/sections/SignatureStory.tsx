import Image from "next/image";
import Link from "next/link";

import { getHomeContent } from "@/content/home";
import { Eyebrow } from "@/components/ui/Eyebrow";
import type { Locale } from "@/i18n/config";

type SignatureStoryProps = {
  homeContent: ReturnType<typeof getHomeContent>;
  lang: Locale;
};

export function SignatureStory({ homeContent, lang }: SignatureStoryProps) {
  const signatureBlurb =
    homeContent.signature.body.includes(". ") ? `${homeContent.signature.body.split(". ")[0]}.` : homeContent.signature.body;

  return (
    <section className="mx-auto w-full max-w-6xl px-5 pb-20 pt-24 sm:px-6 sm:pb-24 sm:pt-28 lg:px-10 lg:pt-32">
      <div className="max-w-3xl">
        <Eyebrow>{homeContent.signature.eyebrow}</Eyebrow>
        <h2 className="max-w-[11ch] font-serif text-[clamp(2.4rem,4.6vw,4.8rem)] leading-[0.95] tracking-[-0.04em]">{homeContent.signature.title}</h2>
      </div>
      <div className="mt-10 grid items-end gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:gap-16">
        <div className="max-w-[23rem] text-[0.96rem] leading-7 text-white/72">
          <p>{signatureBlurb}</p>
        </div>
        <div className="relative w-full max-w-[44rem] justify-self-end overflow-hidden rounded-[1.8rem] border border-white/10">
          <div className="relative min-h-[19rem] sm:min-h-[23rem] lg:min-h-[28rem]">
            <Image src={homeContent.visuals.signatureCampaign} alt="Hero ring still-life campaign frame" fill sizes="(min-width: 1024px) 52vw, 100vw" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#02050b]/18 via-transparent to-transparent" />
          </div>
        </div>
      </div>
      <div className="pt-8">
        <Link href={`/${lang}/journal`} className="inline-flex items-center gap-2 text-[0.82rem] uppercase tracking-[0.18em] text-white/78 transition-colors duration-300 hover:text-[var(--color-accent)]">
          <span>{homeContent.signature.cta}</span>
          <span aria-hidden>&rarr;</span>
        </Link>
      </div>
    </section>
  );
}
