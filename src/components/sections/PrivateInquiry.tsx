import Link from "next/link";

import type { Locale } from "@/i18n/config";

export default function PrivateInquiry({ lang }: { lang: Locale }) {
  return (
    <section className="border-t border-white/6 bg-transparent">
      <div className="mx-auto max-w-[1320px] px-6 py-14 lg:px-10 lg:py-18">
        <div className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.028),rgba(255,255,255,0.014))] shadow-[0_0_0_1px_rgba(255,255,255,0.015)]">
          <div className="grid gap-8 px-6 py-7 sm:px-7 sm:py-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-end lg:gap-10 lg:px-10 lg:py-10">
            <div className="max-w-[19rem]">
              <p className="text-[0.68rem] uppercase tracking-[0.24em] text-white/44">
                Private Inquiry
              </p>

              <h2 className="mt-4 max-w-[8ch] text-[clamp(2rem,3.4vw,3.6rem)] leading-[0.95] tracking-[-0.045em] text-[var(--color-text)]">
                Begin a private conversation with the maison
              </h2>
            </div>

            <div className="max-w-[34rem] lg:justify-self-end">
              <p className="text-[0.98rem] leading-7 text-white/72">
                For private viewings, availability guidance, bespoke commissions,
                and appointment requests.
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link
                  href={`/${lang}/contact`}
                  className="inline-flex items-center justify-center rounded-full bg-[rgba(228,214,178,0.92)] px-5 py-3 text-[0.7rem] uppercase tracking-[0.18em] text-[#0d1017] transition-opacity duration-300 hover:opacity-90"
                >
                  Arrange Private Appointment
                </Link>

                <Link
                  href={`/${lang}/contact?mode=bespoke`}
                  className="inline-flex items-center justify-center rounded-full border border-white/12 px-5 py-3 text-[0.7rem] uppercase tracking-[0.18em] text-white/78 transition-colors duration-300 hover:border-white/20 hover:text-[var(--color-text)]"
                >
                  Discuss Bespoke Commission
                </Link>
              </div>

              <div className="mt-6 border-t border-white/8 pt-4">
                <p className="text-[0.72rem] uppercase tracking-[0.22em] text-white/40">
                  Private salon inquiries handled with discretion
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
