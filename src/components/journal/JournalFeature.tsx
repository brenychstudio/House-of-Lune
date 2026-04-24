import Image from "next/image";

import type { JournalEntry } from "@/types/journal";

export function JournalFeature({
  label,
  entry,
  readLabel,
}: {
  label: string;
  entry: JournalEntry;
  readLabel: string;
}) {
  return (
    <section className="section-divider py-16 sm:py-18 lg:py-20">
      <div className="mx-auto max-w-6xl px-5 sm:px-6 lg:px-10">
        <div className="border-t border-white/8 pt-8">
          <p className="text-[0.68rem] uppercase tracking-[0.2em] text-[var(--color-accent)]">
            {label}
          </p>

          <article className="group luxury-card mt-6 overflow-hidden rounded-[1.6rem] border border-white/10 bg-white/[0.018] hover:border-white/16 lg:grid lg:grid-cols-[1.15fr_0.85fr]">
            <div className="luxury-frame relative aspect-[16/10] lg:aspect-auto lg:min-h-[18rem]">
              <Image
                src={entry.image}
                alt={entry.title}
                fill
                sizes="(min-width: 1024px) 44vw, 100vw"
                className="object-cover object-center"
              />
            </div>

            <div className="flex flex-col justify-center border-t border-white/8 p-6 sm:p-7 lg:border-l lg:border-t-0 lg:p-10">
              <p className="text-[0.68rem] uppercase tracking-[0.18em] text-white/42">
                {entry.type}
              </p>

              <h2 className="mt-4 max-w-[15ch] font-serif text-[2rem] leading-[1.04] tracking-[-0.03em] text-[var(--color-text)] sm:text-[2.35rem]">
                {entry.title}
              </h2>

              <p className="mt-5 max-w-[34ch] text-[0.98rem] leading-7 text-white/64">
                {entry.line}
              </p>

              <p className="luxury-line-link mt-8 inline-block pb-1 text-[0.7rem] uppercase tracking-[0.18em] text-[var(--color-accent)]">
                {readLabel}
              </p>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
