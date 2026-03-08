import type { Piece } from "@/types/piece";
import type { Dictionary } from "@/types/i18n";

export function PieceStory({ piece, dictionary }: { piece: Piece; dictionary: Dictionary }) {
  const storyText = piece.story?.length ? piece.story : [piece.shortDescription];
  return (
    <section className="mx-auto max-w-6xl px-5 py-6 sm:px-6 sm:py-8 lg:px-10">
      <h2 className="font-serif text-2xl">{dictionary.pages.piece.storyTitle}</h2>
      <div className="mt-4 max-w-3xl space-y-4 text-[var(--color-text-muted)]">
        {storyText.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </section>
  );
}
