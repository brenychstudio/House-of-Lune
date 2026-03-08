import { Button } from "@/components/ui/Button";
import { JournalEntryCard } from "@/components/journal/JournalEntryCard";
import type { JournalEntry } from "@/types/journal";

type JournalListProps = {
  title: string;
  entries: JournalEntry[];
  readLabel: string;
  maisonLabel: string;
  maisonHref: string;
  collectionLabel: string;
  collectionHref: string;
};

export function JournalList({ title, entries, readLabel, maisonLabel, maisonHref, collectionLabel, collectionHref }: JournalListProps) {
  return (
    <section className="section-divider py-16 sm:py-18 lg:py-20">
      <div className="mx-auto max-w-6xl px-5 sm:px-6 lg:px-10">
        <h2 className="font-serif text-[2rem] sm:text-3xl">{title}</h2>
        <div className="mt-7 grid gap-5 sm:mt-8 sm:gap-6 md:grid-cols-3">
          {entries.map((entry) => (
            <JournalEntryCard key={entry.id} entry={entry} readLabel={readLabel} />
          ))}
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button href={maisonHref} variant="outline">
            {maisonLabel}
          </Button>
          <Button href={collectionHref}>{collectionLabel}</Button>
        </div>
      </div>
    </section>
  );
}
