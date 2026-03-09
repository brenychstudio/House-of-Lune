import Image from "next/image";

import type { Locale } from "@/i18n/config";
import type { Piece } from "@/types/piece";
import type { Dictionary } from "@/types/i18n";

type PieceCardProps = {
  piece: Piece;
  lang: Locale;
  dictionary: Dictionary;
  emphasized?: boolean;
};

export function PieceCard({ piece, lang, dictionary, emphasized = false }: PieceCardProps) {
  return (
    <article className={`group overflow-hidden rounded-[1.35rem] border border-[var(--color-line)] bg-[rgba(255,255,255,0.02)] ${emphasized ? "md:col-span-2 xl:col-span-1" : ""}`}>
      <a href={`/${lang}/piece/${piece.slug}`} className="block">
        <div className={`relative overflow-hidden ${emphasized ? "aspect-[16/10] md:aspect-[16/9] xl:aspect-[4/5]" : "aspect-[4/5]"}`}>
          <Image src={piece.featuredCardImage ?? piece.heroImage} alt={piece.name} fill sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw" className="object-cover transition duration-500 group-hover:scale-[1.02]" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,7,10,0.02),rgba(5,7,10,0.6))]" />
        </div>
        <div className="space-y-3 p-5 sm:p-6">
          <p className="text-[0.66rem] uppercase tracking-[0.17em] text-[var(--color-text-muted)]">{piece.category}</p>
          <h2 className="font-serif text-[1.6rem] leading-tight sm:text-2xl">{piece.name}</h2>
          <p className="text-[var(--color-text-muted)]">{piece.shortDescription}</p>
          <p className="text-sm text-[var(--color-text-muted)]">
            {piece.material} · {piece.stone}
          </p>
          <p className="text-[0.7rem] uppercase tracking-[0.14em] text-[var(--color-accent)]">
            {dictionary.pages.piece.labels.availability}: {piece.availabilityMode}
          </p>
        </div>
      </a>
    </article>
  );
}
