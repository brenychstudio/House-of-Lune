import { featuredPieces } from "@/content/pieces";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/types/i18n";

import { PieceCard } from "@/components/collection/PieceCard";

export function CollectionGrid({ lang, dictionary }: { lang: Locale; dictionary: Dictionary }) {
  return (
    <section className="mx-auto max-w-6xl px-6 pb-24 lg:px-10">
      <div className="grid gap-7 md:grid-cols-2 xl:grid-cols-3">
        {featuredPieces.map((piece) => (
          <PieceCard key={piece.slug} piece={piece} lang={lang} dictionary={dictionary} />
        ))}
      </div>
    </section>
  );
}
