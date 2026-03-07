import type { Piece } from "@/types/piece";
import type { Dictionary } from "@/types/i18n";

export function PieceSpecs({ piece, dictionary }: { piece: Piece; dictionary: Dictionary }) {
  const labels = dictionary.pages.piece.labels;
  return (
    <section className="mx-auto max-w-6xl px-6 py-6 lg:px-10">
      <div className="grid gap-4 rounded-[1.2rem] border border-[var(--color-line)] bg-[rgba(255,255,255,0.015)] p-6 md:grid-cols-2 lg:grid-cols-4">
        <div><p className="text-xs uppercase tracking-[0.14em] text-[var(--color-text-muted)]">{labels.material}</p><p className="mt-2">{piece.material}</p></div>
        <div><p className="text-xs uppercase tracking-[0.14em] text-[var(--color-text-muted)]">{labels.stone}</p><p className="mt-2">{piece.stone}</p></div>
        <div><p className="text-xs uppercase tracking-[0.14em] text-[var(--color-text-muted)]">{labels.edition}</p><p className="mt-2">{piece.edition}</p></div>
        <div><p className="text-xs uppercase tracking-[0.14em] text-[var(--color-text-muted)]">{labels.availability}</p><p className="mt-2">{piece.availabilityMode}</p></div>
      </div>
    </section>
  );
}
