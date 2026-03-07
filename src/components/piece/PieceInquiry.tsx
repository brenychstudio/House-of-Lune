import { Button } from "@/components/ui/Button";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/types/i18n";

export function PieceInquiry({ dictionary, lang }: { dictionary: Dictionary; lang: Locale }) {
  return (
    <section className="mx-auto max-w-6xl px-6 pb-24 pt-10 lg:px-10">
      <div className="rounded-[1.3rem] border border-[var(--color-line)] bg-[rgba(255,255,255,0.015)] p-8 lg:p-10">
        <p className="text-xs uppercase tracking-[0.14em] text-[var(--color-text-muted)]">{dictionary.pages.piece.inquiry.eyebrow}</p>
        <h2 className="mt-4 max-w-2xl font-serif text-3xl leading-tight">{dictionary.pages.piece.inquiry.title}</h2>
        <p className="mt-4 max-w-2xl text-[var(--color-text-muted)]">{dictionary.pages.piece.inquiry.description}</p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Button href={`/${lang}/contact`}>{dictionary.pages.piece.inquiry.primaryCta}</Button>
          <Button href={`/${lang}/contact`} variant="outline">{dictionary.pages.piece.inquiry.secondaryCta}</Button>
        </div>
      </div>
    </section>
  );
}
