import type { Dictionary } from "@/types/i18n";

export function CollectionHero({ dictionary }: { dictionary: Dictionary }) {
  return (
    <section className="mx-auto max-w-6xl px-6 pb-10 pt-20 lg:px-10 lg:pt-24">
      <p className="text-xs uppercase tracking-[0.14em] text-[var(--color-text-muted)]">{dictionary.pages.collection.eyebrow}</p>
      <h1 className="mt-4 max-w-4xl font-serif text-4xl leading-tight md:text-5xl">{dictionary.pages.collection.title}</h1>
      <p className="mt-6 max-w-3xl text-[var(--color-text-muted)]">{dictionary.pages.collection.description}</p>
      <p className="mt-5 max-w-3xl text-sm uppercase tracking-[0.14em] text-[var(--color-accent)]">{dictionary.pages.collection.editorialLine}</p>
    </section>
  );
}
