import Image from "next/image";

import { TransitionLink } from "@/components/motion/TransitionLink";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/types/i18n";
import type { Piece } from "@/types/piece";

type PieceCardLayout = "feature" | "stack" | "bridge";

type PieceCardProps = {
  piece: Piece;
  lang: Locale;
  dictionary: Dictionary;
  layout?: PieceCardLayout;
};

const imageReadabilityVeil =
  "absolute inset-x-0 bottom-0 h-[46%] bg-[linear-gradient(180deg,transparent_0%,rgba(2,5,11,0.42)_58%,rgba(2,5,11,0.78)_100%)]";

export function PieceCard({
  piece,
  lang,
  dictionary,
  layout = "stack",
}: PieceCardProps) {
  const href = `/${lang}/piece/${piece.slug}`;

  if (layout === "bridge") {
    return (
      <article className="group luxury-card overflow-hidden rounded-[1.55rem] border border-white/10 bg-white/[0.02] hover:border-white/16">
        <TransitionLink href={href} className="block">
          <div className="grid lg:grid-cols-[0.52fr_0.48fr]">
            <div className="luxury-frame relative aspect-[16/10] overflow-hidden">
              <Image
                src={piece.featuredCardImage ?? piece.heroImage}
                alt={piece.name}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover object-center transition duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.025]"
              />
            </div>

            <div className="flex flex-col justify-between border-t border-white/8 p-6 sm:p-7 lg:border-l lg:border-t-0">
              <div>
                <p className="text-[0.66rem] uppercase tracking-[0.18em] text-white/48">
                  {piece.category}
                </p>

                <h3 className="mt-4 max-w-[13ch] font-serif text-[1.95rem] leading-[0.98] tracking-[-0.03em] text-[var(--color-text)]">
                  {piece.name}
                </h3>

                <p className="mt-4 max-w-[30ch] text-[0.98rem] leading-7 text-white/70">
                  {piece.shortDescription}
                </p>
              </div>

              <div className="mt-7 border-t border-white/8 pt-5">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[0.9rem] text-[var(--color-text-muted)]">
                  <span>{piece.material}</span>
                  <span className="text-white/22">{"\u00b7"}</span>
                  <span>{piece.stone}</span>
                </div>

                <div className="mt-4 flex items-center justify-between gap-4">
                  <p className="text-[0.68rem] uppercase tracking-[0.18em] text-[var(--color-accent)]">
                    {dictionary.pages.piece.labels.availability}:{" "}
                    {piece.availabilityMode}
                  </p>

                  <span className="luxury-line-link text-[0.68rem] uppercase tracking-[0.18em] text-white/56 group-hover:text-[var(--color-text)]">
                    {"View Piece \u2192"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </TransitionLink>
      </article>
    );
  }

  if (layout === "feature") {
    return (
      <article className="group luxury-card overflow-hidden rounded-[1.55rem] border border-white/10 bg-white/[0.02] hover:border-white/16">
        <TransitionLink href={href} className="block">
          <div className="luxury-frame relative aspect-[4/5] overflow-hidden lg:aspect-[5/6]">
            <Image
              src={piece.featuredCardImage ?? piece.heroImage}
              alt={piece.name}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover object-center transition duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.025]"
            />

            <div className={imageReadabilityVeil} />

            <div className="absolute inset-x-0 bottom-0 z-10 p-6 sm:p-7">
              <p className="mb-2 text-[0.66rem] uppercase tracking-[0.18em] text-white/58">
                {piece.category}
              </p>

              <h3 className="max-w-[12ch] font-serif text-[2rem] leading-[0.98] tracking-[-0.03em] text-[var(--color-text)] sm:text-[2.2rem]">
                {piece.name}
              </h3>

              <p className="mt-4 max-w-[26ch] text-[0.98rem] leading-7 text-white/74">
                {piece.shortDescription}
              </p>
            </div>
          </div>

          <div className="border-t border-white/8 p-6 sm:p-7">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[0.9rem] text-[var(--color-text-muted)]">
              <span>{piece.material}</span>
              <span className="text-white/22">{"\u00b7"}</span>
              <span>{piece.stone}</span>
            </div>

            <div className="mt-5 flex items-center justify-between gap-4">
              <p className="text-[0.68rem] uppercase tracking-[0.18em] text-[var(--color-accent)]">
                {dictionary.pages.piece.labels.availability}:{" "}
                {piece.availabilityMode}
              </p>

              <span className="luxury-line-link text-[0.68rem] uppercase tracking-[0.18em] text-white/56 group-hover:text-[var(--color-text)]">
                {"View Piece \u2192"}
              </span>
            </div>
          </div>
        </TransitionLink>
      </article>
    );
  }

  return (
    <article className="group luxury-card overflow-hidden rounded-[1.55rem] border border-white/10 bg-white/[0.02] hover:border-white/16">
      <TransitionLink href={href} className="block">
        <div className="luxury-frame relative aspect-[4/5] overflow-hidden">
          <Image
            src={piece.featuredCardImage ?? piece.heroImage}
            alt={piece.name}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover object-center transition duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
          />

          <div className={imageReadabilityVeil} />

          <div className="absolute inset-x-0 bottom-0 z-10 p-5 sm:p-6">
            <p className="mb-2 text-[0.66rem] uppercase tracking-[0.18em] text-white/58">
              {piece.category}
            </p>

            <h3 className="max-w-[13ch] font-serif text-[1.8rem] leading-[1.02] tracking-[-0.03em] text-[var(--color-text)]">
              {piece.name}
            </h3>

            <p className="mt-3 max-w-[24ch] text-[0.96rem] leading-6 text-white/74">
              {piece.shortDescription}
            </p>
          </div>
        </div>

        <div className="border-t border-white/8 p-5 sm:p-6">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[0.9rem] text-[var(--color-text-muted)]">
            <span>{piece.material}</span>
            <span className="text-white/22">{"\u00b7"}</span>
            <span>{piece.stone}</span>
          </div>

          <div className="mt-4 flex items-center justify-between gap-4">
            <p className="text-[0.68rem] uppercase tracking-[0.18em] text-[var(--color-accent)]">
              {dictionary.pages.piece.labels.availability}:{" "}
              {piece.availabilityMode}
            </p>

            <span className="luxury-line-link text-[0.68rem] uppercase tracking-[0.18em] text-white/56 group-hover:text-[var(--color-text)]">
              {"View Piece \u2192"}
            </span>
          </div>
        </div>
      </TransitionLink>
    </article>
  );
}
