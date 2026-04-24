import type { ContactContent } from "@/types/contact";

export function ContactDetails({
  details,
}: {
  details: ContactContent["details"];
}) {
  return (
    <section className="border-t border-white/8 pt-7 lg:sticky lg:top-28">
      <p className="text-[0.68rem] uppercase tracking-[0.22em] text-white/40">
        Salon desk
      </p>

      <h2 className="mt-3 font-serif text-[2rem] leading-[1.02] tracking-[-0.03em] text-[var(--color-text)]">
        {details.title}
      </h2>

      <p className="mt-4 max-w-[28rem] text-[0.96rem] leading-7 text-white/64">
        {details.description}
      </p>

      <div className="mt-7 border-y border-white/8">
        {details.lines.map((line) => (
          <article
            key={line}
            className="border-b border-white/8 py-5 last:border-b-0"
          >
            <p className="max-w-[32ch] text-[0.95rem] leading-7 text-white/68">
              {line}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
