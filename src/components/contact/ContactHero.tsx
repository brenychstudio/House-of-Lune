import type { ContactContent } from "@/types/contact";

export function ContactHero({ hero }: { hero: ContactContent["hero"] }) {
  return (
    <section className="mx-auto max-w-6xl px-6 pb-8 pt-20 lg:px-10 lg:pt-24">
      <p className="text-xs uppercase tracking-[0.14em] text-[var(--color-text-muted)]">{hero.eyebrow}</p>
      <h1 className="mt-4 max-w-3xl font-serif text-4xl leading-tight md:text-5xl">{hero.title}</h1>
      <p className="mt-4 max-w-2xl text-[var(--color-text-muted)]">{hero.description}</p>
      <p className="mt-7 max-w-3xl text-sm leading-relaxed text-[var(--color-text-muted)]/90">{hero.intro}</p>
    </section>
  );
}
