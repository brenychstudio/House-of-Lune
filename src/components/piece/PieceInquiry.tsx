import { Button } from "@/components/ui/Button";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/types/i18n";
import type { Piece } from "@/types/piece";

export function PieceInquiry({
  dictionary,
  lang,
  piece,
}: {
  dictionary: Dictionary;
  lang: Locale;
  piece: Piece;
}) {
  const encodedPiece = encodeURIComponent(piece.name);

  return (
    <section className="mx-auto max-w-6xl px-5 pb-12 pt-10 sm:px-6 sm:pb-14 sm:pt-12 lg:px-10 lg:pb-16 lg:pt-14">
      <div className="overflow-hidden rounded-[1.55rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.032),rgba(255,255,255,0.014))] p-6 sm:p-8 lg:p-10">
        <div className="grid gap-8 lg:grid-cols-[0.7fr_0.3fr] lg:items-end">
          <div>
            <p className="text-[0.68rem] uppercase tracking-[0.2em] text-white/42">
              {dictionary.pages.piece.inquiry.eyebrow}
            </p>
            <h2 className="mt-4 max-w-[16ch] font-serif text-[2.05rem] leading-[0.98] tracking-[-0.03em] sm:text-[2.45rem]">
              {dictionary.pages.piece.inquiry.title.replace("{piece}", piece.name)}
            </h2>
            <p className="mt-5 max-w-[38rem] text-[0.98rem] leading-7 text-white/66">
              {dictionary.pages.piece.inquiry.description.replace(
                "{piece}",
                piece.name,
              )}
            </p>

            <div className="mt-6 flex flex-wrap gap-2 text-[0.66rem] uppercase tracking-[0.16em] text-white/46">
              <span className="rounded-full border border-white/10 px-3 py-1.5">
                {dictionary.pages.contact.modes.availability}
              </span>
              <span className="rounded-full border border-white/10 px-3 py-1.5">
                {dictionary.pages.contact.modes.privateViewing}
              </span>
              <span className="rounded-full border border-white/10 px-3 py-1.5">
                {dictionary.pages.contact.modes.appointment}
              </span>
              <span className="rounded-full border border-white/10 px-3 py-1.5">
                {dictionary.pages.contact.modes.bespoke}
              </span>
            </div>
          </div>

          <div className="flex flex-col items-start gap-3 lg:items-end">
            <Button href={`/${lang}/contact?piece=${encodedPiece}&type=availability`}>
              {dictionary.pages.piece.inquiry.primaryCta}
            </Button>
            <Button
              href={`/${lang}/contact?piece=${encodedPiece}&type=appointment`}
              variant="outline"
            >
              {dictionary.pages.piece.inquiry.secondaryCta}
            </Button>

            <p className="mt-2 max-w-[16rem] text-[0.62rem] uppercase leading-5 tracking-[0.18em] text-white/28 lg:text-right">
              {`${piece.availabilityMode} \u00b7 Private viewing \u00b7 Bespoke conversation`}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
