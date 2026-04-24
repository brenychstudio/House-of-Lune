import { Button } from "@/components/ui/Button";

type CraftPrecisionNotesProps = {
  title: string;
  items: string[];
  collectionLabel: string;
  collectionHref: string;
  inquiryLabel: string;
  inquiryHref: string;
};

export function CraftPrecisionNotes({
  title,
  items,
  collectionLabel,
  collectionHref,
  inquiryLabel,
  inquiryHref,
}: CraftPrecisionNotesProps) {
  return (
    <section className="section-divider py-16 sm:py-18 lg:py-20">
      <div className="mx-auto max-w-6xl px-5 sm:px-6 lg:px-10">
        <div className="grid gap-8 lg:grid-cols-[0.34fr_0.66fr] lg:gap-12">
          <div className="border-t border-white/8 pt-6">
            <h2 className="font-serif text-[2rem] leading-[1.02] tracking-[-0.03em] text-[var(--color-text)] sm:text-[2.4rem]">
              {title}
            </h2>
          </div>

          <div className="border-t border-white/8">
            {items.map((item, index) => (
              <div
                key={item}
                className="grid grid-cols-[2.2rem_1fr] gap-4 border-b border-white/8 py-4"
              >
                <span className="pt-[0.15rem] text-[0.64rem] uppercase tracking-[0.2em] text-white/36">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <p className="max-w-[42ch] text-[0.96rem] leading-7 text-white/68">
                  {item}
                </p>
              </div>
            ))}

            <div className="flex flex-col gap-3 pt-6 sm:flex-row">
              <Button href={collectionHref}>{collectionLabel}</Button>
              <Button href={inquiryHref} variant="outline">
                {inquiryLabel}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
