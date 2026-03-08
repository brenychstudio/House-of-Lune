import { Button } from "@/components/ui/Button";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/types/i18n";
import type { Piece } from "@/types/piece";

export function PieceInquiry({ dictionary, lang, piece }: { dictionary: Dictionary; lang: Locale; piece: Piece }) {
  const encodedPiece = encodeURIComponent(piece.name);

  return (
    <section className="mx-auto max-w-6xl px-5 pb-18 pt-8 sm:px-6 sm:pb-24 sm:pt-10 lg:px-10">
      <div className="rounded-[1.3rem] border border-[var(--color-line)] bg-[rgba(255,255,255,0.015)] p-6 sm:p-8 lg:p-10">
        <p className="text-xs uppercase tracking-[0.14em] text-[var(--color-text-muted)]">{dictionary.pages.piece.inquiry.eyebrow}</p>
        <h2 className="mt-4 max-w-3xl font-serif text-[2rem] leading-tight sm:text-3xl">{dictionary.pages.piece.inquiry.title.replace("{piece}", piece.name)}</h2>
        <p className="mt-4 max-w-2xl text-[var(--color-text-muted)]">{dictionary.pages.piece.inquiry.description.replace("{piece}", piece.name)}</p>
        <div className="mt-6 flex flex-wrap gap-2 text-[0.68rem] uppercase tracking-[0.12em] text-[var(--color-text-muted)]">
          <span className="rounded-full border border-[var(--color-line)] px-3 py-1">{dictionary.pages.contact.modes.availability}</span>
          <span className="rounded-full border border-[var(--color-line)] px-3 py-1">{dictionary.pages.contact.modes.privateViewing}</span>
          <span className="rounded-full border border-[var(--color-line)] px-3 py-1">{dictionary.pages.contact.modes.appointment}</span>
          <span className="rounded-full border border-[var(--color-line)] px-3 py-1">{dictionary.pages.contact.modes.bespoke}</span>
        </div>
        <div className="mt-7 flex flex-wrap gap-3">
          <Button href={`/${lang}/contact?piece=${encodedPiece}&type=availability`}>{dictionary.pages.piece.inquiry.primaryCta}</Button>
          <Button href={`/${lang}/contact?piece=${encodedPiece}&type=appointment`} variant="outline">
            {dictionary.pages.piece.inquiry.secondaryCta}
          </Button>
        </div>
      </div>
    </section>
  );
}
