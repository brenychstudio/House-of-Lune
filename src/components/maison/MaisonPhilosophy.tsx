import type { MaisonSection } from "@/types/maison";

export function MaisonPhilosophy({
  title,
  sections,
}: {
  title: string;
  sections: MaisonSection[];
}) {
  return (
    <section className="section-divider py-18 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-6 lg:px-10">
        <div className="border-t border-white/8 pt-8">
          <h2 className="font-serif text-[2rem] leading-[1.02] tracking-[-0.03em] text-[var(--color-text)] sm:text-[2.4rem]">
            {title}
          </h2>

          <div className="mt-8 grid gap-5 sm:gap-6 lg:grid-cols-2">
            {sections.map((section) => (
              <article
                key={section.title}
                className="luxury-card rounded-[1.35rem] border border-white/10 bg-white/[0.025] p-6 hover:border-white/16 sm:p-7 lg:p-8"
              >
                <h3 className="font-serif text-[1.45rem] leading-[1.05] tracking-[-0.02em] text-[var(--color-text)]">
                  {section.title}
                </h3>
                <p className="mt-4 max-w-[42ch] text-[0.98rem] leading-7 text-white/62">
                  {section.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
