import Image from "next/image";

import { TransitionLink } from "@/components/motion/TransitionLink";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { LinkArrow } from "@/components/ui/LinkArrow";
import { getHomeContent } from "@/content/home";
import { featuredPieces } from "@/content/pieces";
import type { Locale } from "@/i18n/config";

type FeaturedCollectionProps = {
  homeContent: ReturnType<typeof getHomeContent>;
  lang: Locale;
};

const imageReadabilityVeil =
  "absolute inset-x-0 bottom-0 h-[46%] bg-[linear-gradient(180deg,transparent_0%,rgba(2,5,11,0.38)_58%,rgba(2,5,11,0.76)_100%)]";

export function FeaturedCollection({
  homeContent,
  lang,
}: FeaturedCollectionProps) {
  const featuredPreview = featuredPieces.slice(0, 3);

  return (
    <section
      id="collection"
      className="mx-auto w-full max-w-6xl px-5 pb-24 pt-16 sm:px-6 sm:pb-28 sm:pt-20 lg:px-10 lg:pb-32 lg:pt-24"
    >
      <div className="max-w-3xl">
        <Eyebrow>{homeContent.featured.eyebrow}</Eyebrow>

        <h2 className="font-serif text-[clamp(2.25rem,4vw,4.4rem)] leading-[0.97] tracking-[-0.035em] text-[var(--color-text)]">
          {homeContent.featured.title}
        </h2>

        <p className="mt-5 max-w-2xl text-[1.02rem] leading-8 text-white/72">
          {homeContent.featured.description}
        </p>
      </div>

      <div className="mt-14 grid gap-6 md:grid-cols-3 lg:mt-18 lg:gap-8">
        {featuredPreview.map((piece) => (
          <TransitionLink
            key={piece.slug}
            href={`/${lang}/piece/${piece.slug}`}
            className="block"
          >
            <article className="group luxury-card relative overflow-hidden rounded-[1.6rem] border border-white/10 bg-[#060a12] hover:border-white/16">
              <div className="luxury-frame relative aspect-[4/5]">
                <Image
                  src={piece.featuredCardImage ?? piece.heroImage}
                  alt={piece.name}
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="object-cover object-center transition-transform duration-[1600ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.025]"
                />

                <div className={imageReadabilityVeil} />
              </div>

              <div className="absolute inset-x-0 bottom-0 z-10 p-5 lg:p-6">
                <p className="mb-2 text-[0.68rem] uppercase tracking-[0.22em] text-white/58">
                  {piece.category}
                </p>

                <h3 className="max-w-[14ch] font-serif text-[1.5rem] leading-[1.02] tracking-[-0.03em] text-[var(--color-text)]">
                  {piece.name}
                </h3>

                <p className="mt-3 max-w-[26ch] text-[0.94rem] leading-6 text-white/72">
                  {piece.shortDescription}
                </p>
              </div>
            </article>
          </TransitionLink>
        ))}
      </div>

      <div className="mt-10">
        <LinkArrow href={`/${lang}/collection`}>
          {homeContent.featured.viewCollection}
        </LinkArrow>
      </div>
    </section>
  );
}
