import Image from "next/image";

import { featuredPieces } from "@/content/pieces";
import { getHomeContent } from "@/content/home";
import { LinkArrow } from "@/components/ui/LinkArrow";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Locale } from "@/i18n/config";

type FeaturedCollectionProps = {
  homeContent: ReturnType<typeof getHomeContent>;
  lang: Locale;
};

export function FeaturedCollection({ homeContent, lang }: FeaturedCollectionProps) {
  return (
    <section id="collection" className="mx-auto w-full max-w-6xl px-6 pb-26 pt-16 lg:px-10">
      <SectionHeading eyebrow={homeContent.featured.eyebrow} title={homeContent.featured.title} description={homeContent.featured.description} />

      <div className="surface-frame relative mt-12 aspect-[16/7] overflow-hidden rounded-[1.65rem] border border-[var(--color-line)]">
        <Image src={homeContent.visuals.featuredCard} alt="Hero ring featured collection card" fill sizes="(min-width: 1024px) 72rem, 100vw" className="object-cover object-center opacity-72" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,3,8,0.12),rgba(2,3,8,0.68))]" />
      </div>

      <div className="mt-10 grid gap-5 md:grid-cols-2">
        {featuredPieces.map((piece) => (
          <article
            key={piece.slug}
            className="group rounded-2xl border border-[var(--color-line)] bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.015))] p-7 transition-colors duration-300 hover:border-[rgba(195,204,216,0.4)]"
          >
            <p className="text-[0.66rem] uppercase tracking-[0.17em] text-[var(--color-text-muted)]">{piece.category}</p>
            <h3 className="mt-5 font-serif text-[1.95rem] leading-tight">{piece.name}</h3>
            <p className="mt-3 max-w-sm text-[var(--color-text-muted)]">{piece.headline}</p>
            <div className="mt-7 border-t border-[var(--color-line-soft)] pt-4">
              <p className="text-sm text-[var(--color-text-muted)]">
                {piece.material} · {piece.stone}
              </p>
              <p className="mt-2 text-[0.72rem] uppercase tracking-[0.13em] text-[var(--color-accent)]">{piece.availabilityMode}</p>
            </div>
          </article>
        ))}
      </div>
      <div className="mt-8">
        <LinkArrow href={`/${lang}/collection`}>{homeContent.featured.viewCollection}</LinkArrow>
      </div>
    </section>
  );
}
