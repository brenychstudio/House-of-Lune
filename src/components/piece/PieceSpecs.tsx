import type { Piece } from "@/types/piece";
import type { Dictionary } from "@/types/i18n";

export function PieceSpecs({ piece, dictionary }: { piece: Piece; dictionary: Dictionary }) {
  const labels = dictionary.pages.piece.labels;

  const items = [
    { label: labels.material, value: piece.material },
    { label: labels.stone, value: piece.stone },
    { label: labels.edition, value: piece.edition },
    { label: labels.availability, value: piece.availabilityMode },
  ];

  return (
    <section className="mx-auto max-w-6xl px-5 py-6 sm:px-6 lg:px-10">
      <dl className="grid gap-4 rounded-[1.2rem] border border-[var(--color-line)] bg-[rgba(255,255,255,0.015)] p-5 sm:p-6 md:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => (
          <div key={item.label}>
            <dt className="text-xs uppercase tracking-[0.14em] text-[var(--color-text-muted)]">{item.label}</dt>
            <dd className="mt-2">{item.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
