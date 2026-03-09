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
  const featuredPreview = featuredPieces.slice(0, 3);

  return (
    <section id="collection" className="mx-auto w-full max-w-6xl px-5 pb-20 pt-14 sm:px-6 sm:pb-24 sm:pt-16 lg:px-10 lg:pb-26">
      <SectionHeading eyebrow={homeContent.featured.eyebrow} title={homeContent.featured.title} description={homeContent.featured.description} />

      <div className="mt-9 grid gap-4 sm:mt-12 sm:gap-5 md:grid-cols-3">
        {featuredPreview.map((piece) => (
          <a key={piece.slug} href={`/${lang}/piece/${piece.slug}`} className="group relative block overflow-hidden rounded-[1.35rem] border border-[var(--color-line)]">
            <div className="relative aspect-[4/5]">
              <Image src={piece.featuredCardImage ?? piece.heroImage} alt={piece.name} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover transition duration-500 group-hover:scale-[1.02]" />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,3,8,0.04),rgba(2,3,8,0.62))]" />
            </div>
            <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
              <p className="text-[0.66rem] uppercase tracking-[0.17em] text-[var(--color-text-muted)]">{piece.category}</p>
              <h3 className="mt-2 font-serif text-xl leading-tight">{piece.name}</h3>
            </div>
          </a>
        ))}
      </div>

      <div className="mt-8 grid gap-4 sm:mt-10 sm:gap-5 md:grid-cols-2">
        {featuredPieces.map((piece) => (
          <article
            key={piece.slug}
            className="group rounded-2xl border border-[var(--color-line)] bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.015))] p-6 sm:p-7 transition-colors duration-300 hover:border-[rgba(195,204,216,0.4)]"
          >
            <a href={`/${lang}/piece/${piece.slug}`} className="block">
              <p className="text-[0.66rem] uppercase tracking-[0.17em] text-[var(--color-text-muted)]">{piece.category}</p>
              <h3 className="mt-5 font-serif text-[1.95rem] leading-tight">{piece.name}</h3>
              <p className="mt-3 max-w-sm text-[var(--color-text-muted)]">{piece.headline}</p>
              <div className="mt-7 border-t border-[var(--color-line-soft)] pt-4">
                <p className="text-sm text-[var(--color-text-muted)]">
                  {piece.material} · {piece.stone}
                </p>
                <p className="mt-2 text-[0.72rem] uppercase tracking-[0.13em] text-[var(--color-accent)]">{piece.availabilityMode}</p>
              </div>
            </a>
          </article>
        ))}
      </div>
      <div className="mt-8">
        <LinkArrow href={`/${lang}/collection`}>{homeContent.featured.viewCollection}</LinkArrow>
      </div>
    </section>
  );
}
