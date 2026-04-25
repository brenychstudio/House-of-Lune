import Image from "next/image";

import { ImageDrift } from "@/components/motion/ImageDrift";
import { TransitionLink } from "@/components/motion/TransitionLink";
import type { Locale } from "@/i18n/config";

const entries = [
  "House notes from winter salon appointments",
  "On private iteration and the recovery of reflected light",
  "Campaign frame 01: silhouettes in quiet architecture",
];

export default function JournalPreview({ lang }: { lang: Locale }) {
  return (
    <section className="border-t border-white/6 bg-transparent">
      <div className="mx-auto max-w-[1320px] px-6 py-18 lg:px-10 lg:py-22">
        <div className="grid gap-10 lg:grid-cols-[0.56fr_1.44fr] lg:items-end lg:gap-16">
          <div className="max-w-[23rem]">
            <p className="text-[0.72rem] uppercase tracking-[0.24em] text-white/46">
              Journal
            </p>

            <h2 className="mt-5 max-w-[10ch] text-[clamp(2.25rem,3.9vw,4.4rem)] leading-[0.95] tracking-[-0.04em] text-[var(--color-text)]">
              Editorial notes from the house
            </h2>

            <p className="mt-6 max-w-[28ch] text-[1rem] leading-7 text-white/72">
              Notes on material, culture, and contemporary adornment from the
              house.
            </p>
          </div>

          <div>
            <ImageDrift>
              <figure className="luxury-card luxury-frame relative aspect-[16/8.7] overflow-hidden rounded-[1.9rem] border border-white/10 bg-white/[0.02] hover:border-white/16">
                <Image
                  src="/media/journal/campaign-01/hol-campaign-01-wide-frame-21x9-01.png"
                  alt="House of Lune editorial campaign frame"
                  fill
                  className="object-cover object-center"
                  sizes="(min-width: 1024px) 62vw, 100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#02050b]/18 via-transparent to-transparent" />
              </figure>
            </ImageDrift>

            <div className="mt-5 border-t border-white/8">
              {entries.map((entry) => (
                <div
                  key={entry}
                  className="grid grid-cols-[1fr_auto] items-center gap-6 border-b border-white/8 py-4 lg:py-5"
                >
                  <p className="text-[0.98rem] leading-6 text-white/82">
                    {entry}
                  </p>
                  <span className="text-[0.68rem] uppercase tracking-[0.2em] text-white/42">
                    Editorial
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-5">
              <TransitionLink
                href={`/${lang}/journal`}
                className="luxury-line-link inline-flex pb-1 text-[0.72rem] uppercase tracking-[0.22em] text-white/62 hover:text-[var(--color-text)]"
              >
                {"Open Journal \u2192"}
              </TransitionLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
