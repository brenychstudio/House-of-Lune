import { homeContent } from "@/content/home";
import { LinkArrow } from "@/components/ui/LinkArrow";
import { SectionHeading } from "@/components/ui/SectionHeading";

const entries = [
  "On the language of antique cuts in contemporary settings",
  "Why proportion determines perceived brilliance",
  "A quiet guide to collecting modern high jewelry",
];

export function JournalPreview() {
  return (
    <section id="journal" className="mx-auto w-full max-w-6xl px-6 pb-18 pt-24 lg:px-10">
      <SectionHeading eyebrow="Journal" title="Editorial notes from the house" description={homeContent.intros.journal} />
      <ul className="mt-10 space-y-5 border-t border-[var(--color-line-soft)] pt-6">
        {entries.map((entry) => (
          <li key={entry} className="flex items-start justify-between gap-6 border-b border-[var(--color-line-soft)] pb-4">
            <p className="max-w-3xl">{entry}</p>
            <span className="text-[0.72rem] uppercase tracking-[0.12em] text-[var(--color-text-muted)]">Essay</span>
          </li>
        ))}
      </ul>
      <div className="mt-8">
        <LinkArrow href="#">Open journal</LinkArrow>
      </div>
    </section>
  );
}
