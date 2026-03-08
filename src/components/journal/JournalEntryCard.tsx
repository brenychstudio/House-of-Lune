import Image from "next/image";

import type { JournalEntry } from "@/types/journal";

export function JournalEntryCard({ entry, readLabel }: { entry: JournalEntry; readLabel: string }) {
  return (
    <article className="overflow-hidden rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)]">
      <div className="relative aspect-[4/3]">
        <Image src={entry.image} alt={entry.title} fill sizes="(min-width: 768px) 30vw, 100vw" className="object-cover opacity-74" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,3,8,0.06),rgba(2,3,8,0.58))]" />
      </div>
      <div className="p-5 sm:p-6">
        <p className="text-[0.68rem] uppercase tracking-[0.14em] text-[var(--color-text-muted)]">{entry.type}</p>
        <h3 className="mt-2 font-serif text-[1.7rem] sm:text-2xl leading-tight">{entry.title}</h3>
        <p className="mt-3 text-[var(--color-text-muted)]">{entry.line}</p>
        <p className="mt-5 text-[0.7rem] uppercase tracking-[0.14em] text-[var(--color-accent)]">{readLabel}</p>
      </div>
    </article>
  );
}
