import Image from "next/image";

import type { JournalEntry } from "@/types/journal";

export function JournalEntryCard({
  entry,
  readLabel,
}: {
  entry: JournalEntry;
  readLabel: string;
}) {
  return (
    <article className="group luxury-card overflow-hidden rounded-[1.35rem] border border-white/10 bg-white/[0.018] hover:border-white/18">
      <div className="luxury-frame relative aspect-[4/3] overflow-hidden">
        <Image
          src={entry.image}
          alt={entry.title}
          fill
          sizes="(min-width: 768px) 30vw, 100vw"
          className="object-cover object-center transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.025]"
        />
      </div>

      <div className="p-5 sm:p-6">
        <p className="text-[0.66rem] uppercase tracking-[0.18em] text-white/42">
          {entry.type}
        </p>

        <h3 className="mt-3 max-w-[13ch] font-serif text-[1.65rem] leading-[1.03] tracking-[-0.025em] text-[var(--color-text)] sm:text-[1.95rem]">
          {entry.title}
        </h3>

        <p className="mt-4 max-w-[28ch] text-[0.95rem] leading-7 text-white/62">
          {entry.line}
        </p>

        <p className="luxury-line-link mt-6 inline-block pb-1 text-[0.68rem] uppercase tracking-[0.18em] text-[var(--color-accent)]">
          {readLabel}
        </p>
      </div>
    </article>
  );
}
