import Image from "next/image";

import type { JournalEntry } from "@/types/journal";

export function JournalFeature({ label, entry, readLabel }: { label: string; entry: JournalEntry; readLabel: string }) {
  return (
    <section className="section-divider py-16 sm:py-18 lg:py-20">
      <div className="mx-auto max-w-6xl px-5 sm:px-6 lg:px-10">
        <p className="text-xs uppercase tracking-[0.14em] text-[var(--color-accent)]">{label}</p>
        <article className="mt-4 sm:mt-5 overflow-hidden rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] lg:grid lg:grid-cols-[1.2fr_1fr]">
          <div className="relative aspect-[16/10] lg:aspect-auto">
            <Image src={entry.image} alt={entry.title} fill sizes="(min-width: 1024px) 44vw, 100vw" className="object-cover" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,3,8,0.02),rgba(2,3,8,0.52))]" />
          </div>
          <div className="p-6 sm:p-7 lg:p-9">
            <p className="text-[0.68rem] uppercase tracking-[0.14em] text-[var(--color-text-muted)]">{entry.type}</p>
            <h2 className="mt-3 font-serif text-[2rem] sm:text-3xl">{entry.title}</h2>
            <p className="mt-4 text-[var(--color-text-muted)]">{entry.line}</p>
            <p className="mt-7 text-[0.72rem] uppercase tracking-[0.14em] text-[var(--color-accent)]">{readLabel}</p>
          </div>
        </article>
      </div>
    </section>
  );
}
