import type { Dictionary } from "@/types/i18n";

export function CollectionHero({ dictionary }: { dictionary: Dictionary }) {
  return (
    <section className="mx-auto max-w-6xl px-5 pb-10 pt-16 sm:px-6 sm:pt-18 lg:px-10 lg:pb-12 lg:pt-24">
      <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-end lg:gap-12">
        <div className="max-w-[22rem]">
          <p className="text-[0.68rem] uppercase tracking-[0.2em] text-white/42">
            {dictionary.pages.collection.eyebrow}
          </p>

          <h1 className="mt-5 max-w-[10ch] font-serif text-[2.5rem] leading-[0.94] tracking-[-0.04em] sm:text-[3rem] md:text-[4.2rem]">
            {dictionary.pages.collection.title}
          </h1>
        </div>

        <div className="max-w-[40rem] lg:justify-self-end">
          <p className="text-[1rem] leading-7 text-[var(--color-text-muted)] sm:text-[1.04rem]">
            {dictionary.pages.collection.description}
          </p>

          <p className="mt-6 text-[0.68rem] uppercase tracking-[0.22em] text-[var(--color-accent)]">
            {dictionary.pages.collection.editorialLine}
          </p>
        </div>
      </div>
    </section>
  );
}
