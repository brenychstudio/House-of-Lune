import type { ContactContent } from "@/types/contact";

export function ContactDetails({ details }: { details: ContactContent["details"] }) {
  return (
    <section className="rounded-3xl border border-[var(--color-line)] bg-[rgba(255,255,255,0.01)] p-7 lg:p-8">
      <h2 className="font-serif text-2xl">{details.title}</h2>
      <p className="mt-3 text-sm text-[var(--color-text-muted)]">{details.description}</p>
      <ul className="mt-6 space-y-3 text-sm text-[var(--color-text-muted)]">
        {details.lines.map((line) => (
          <li key={line} className="border-l border-[var(--color-line)] pl-4">
            {line}
          </li>
        ))}
      </ul>
    </section>
  );
}
