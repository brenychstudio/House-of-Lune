import { Button } from "@/components/ui/Button";

type CraftPrecisionNotesProps = {
  title: string;
  items: string[];
  collectionLabel: string;
  collectionHref: string;
  inquiryLabel: string;
  inquiryHref: string;
};

export function CraftPrecisionNotes({ title, items, collectionLabel, collectionHref, inquiryLabel, inquiryHref }: CraftPrecisionNotesProps) {
  return (
    <section className="section-divider py-20">
      <div className="mx-auto max-w-6xl px-6 lg:px-10">
        <h2 className="font-serif text-3xl">{title}</h2>
        <ul className="mt-8 space-y-4">
          {items.map((item) => (
            <li key={item} className="rounded-xl border border-[var(--color-line-soft)] bg-[var(--color-surface)] px-5 py-4 text-[var(--color-text-muted)]">
              {item}
            </li>
          ))}
        </ul>
        <div className="mt-7 flex flex-wrap gap-3">
          <Button href={collectionHref}>{collectionLabel}</Button>
          <Button href={inquiryHref} variant="outline">
            {inquiryLabel}
          </Button>
        </div>
      </div>
    </section>
  );
}
