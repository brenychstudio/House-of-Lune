import type { ContactContent } from "@/types/contact";

export function InquiryOptions({ options }: { options: ContactContent["options"] }) {
  return (
    <section className="mx-auto max-w-6xl px-5 py-8 sm:px-6 sm:py-10 lg:px-10">
      <h2 className="font-serif text-2xl">{options.title}</h2>
      <div className="mt-5 grid gap-4 md:mt-6 md:grid-cols-2">
        {options.modes.map((mode) => (
          <article key={mode.value} className="rounded-2xl border border-[var(--color-line)] bg-[rgba(255,255,255,0.015)] p-5 sm:p-6">
            <p className="text-xs uppercase tracking-[0.12em] text-[var(--color-text-muted)]">{mode.label}</p>
            <p className="mt-3 text-sm leading-relaxed text-[var(--color-text-muted)]">{mode.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
