import Image from "next/image";

import { getHomeContent } from "@/content/home";
import { LinkArrow } from "@/components/ui/LinkArrow";
import { SectionHeading } from "@/components/ui/SectionHeading";
type JournalPreviewProps = {
  homeContent: ReturnType<typeof getHomeContent>;
};

export function JournalPreview({ homeContent }: JournalPreviewProps) {
  return (
    <section id="journal" className="mx-auto w-full max-w-6xl px-5 pb-16 pt-18 sm:px-6 sm:pb-18 sm:pt-22 lg:px-10 lg:pt-24">
      <SectionHeading eyebrow={homeContent.journal.eyebrow} title={homeContent.journal.title} description={homeContent.journal.description} />
      <div className="surface-frame relative mt-10 aspect-[21/9] overflow-hidden rounded-2xl">
        <Image src={homeContent.visuals.journalCampaign} alt="Wide campaign frame previewing the journal" fill sizes="(min-width: 1024px) 72rem, 100vw" className="object-cover" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,3,8,0.05),rgba(2,3,8,0.58))]" />
      </div>
      <ul className="mt-8 space-y-4 sm:mt-10 sm:space-y-5 border-t border-[var(--color-line-soft)] pt-6">
        {homeContent.journal.entries.map((entry) => (
          <li key={entry} className="flex items-start justify-between flex-wrap gap-6 border-b border-[var(--color-line-soft)] pb-4">
            <p className="max-w-3xl">{entry}</p>
            <span className="text-[0.72rem] uppercase tracking-[0.12em] text-[var(--color-text-muted)]">{homeContent.journal.entryTag}</span>
          </li>
        ))}
      </ul>
      <div className="mt-8">
        <LinkArrow href={homeContent.links.journal}>{homeContent.journal.cta}</LinkArrow>
      </div>
    </section>
  );
}
