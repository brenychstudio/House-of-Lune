import type { MaisonSection } from "@/types/maison";

export function MaisonPhilosophy({ title, sections }: { title: string; sections: MaisonSection[] }) {
  return (
    <section className="section-divider py-16 sm:py-18 lg:py-20">
      <div className="mx-auto max-w-6xl px-5 sm:px-6 lg:px-10">
        <h2 className="font-serif text-3xl">{title}</h2>
        <div className="mt-7 grid gap-5 sm:mt-8 sm:gap-6 lg:grid-cols-2">
          {sections.map((section) => (
            <article key={section.title} className="rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] p-6 sm:p-7">
              <h3 className="font-serif text-2xl">{section.title}</h3>
              <p className="mt-3 text-[var(--color-text-muted)]">{section.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
