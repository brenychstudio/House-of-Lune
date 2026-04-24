import { featuredPieces } from "@/content/pieces";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/types/i18n";

import { PieceCard } from "@/components/collection/PieceCard";

export function CollectionGrid({
  lang,
  dictionary,
}: {
  lang: Locale;
  dictionary: Dictionary;
}) {
  return (
    <section
      className="mx-auto max-w-6xl px-5 pb-18 pt-2 sm:px-6 sm:pb-22 lg:px-10 lg:pb-24"
      aria-labelledby="collection-grid-heading"
    >
      <h2 id="collection-grid-heading" className="sr-only">
        Collection pieces
      </h2>

      <div className="grid gap-7 md:grid-cols-2 lg:gap-9">
        {featuredPieces.map((piece) => (
          <PieceCard
            key={piece.slug}
            piece={piece}
            lang={lang}
            dictionary={dictionary}
            layout="stack"
          />
        ))}
      </div>
    </section>
  );
}
