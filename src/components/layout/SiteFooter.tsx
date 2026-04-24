import { TransitionLink } from "@/components/motion/TransitionLink";
import { getSiteContent } from "@/content/site";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/types/i18n";

type SiteFooterProps = {
  dictionary: Dictionary;
  lang: Locale;
};

export function SiteFooter({ dictionary, lang }: SiteFooterProps) {
  const siteContent = getSiteContent(dictionary, lang);

  return (
    <footer className="border-t border-white/8">
      <div className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-6 sm:py-12 lg:px-10 lg:py-14">
        <div className="grid gap-8 md:grid-cols-[0.48fr_0.52fr] md:items-end">
          <div>
            <TransitionLink
              href={`/${lang}`}
              className="font-serif text-[1.05rem] tracking-[0.12em] text-[var(--color-text)] transition-colors duration-300 hover:text-white"
            >
              {siteContent.brand}
            </TransitionLink>

            <p className="mt-4 max-w-[28rem] text-[0.72rem] uppercase leading-6 tracking-[0.16em] text-white/36">
              Private salon inquiries handled with discretion.
            </p>

            <p className="mt-5 text-[0.82rem] text-white/42">
              {"\u00a9"} {new Date().getFullYear()} {siteContent.brand}
            </p>
          </div>

          <div className="flex flex-col gap-5 md:items-end">
            <nav
              aria-label="Footer"
              className="flex flex-wrap items-center gap-x-6 gap-y-2"
            >
              {siteContent.footerLinks.map((item) => (
                <TransitionLink
                  key={item.label}
                  href={item.href}
                  className="text-[0.82rem] text-white/48 transition-colors duration-300 hover:text-[var(--color-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-cool)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)]"
                >
                  {item.label}
                </TransitionLink>
              ))}
            </nav>

            <p className="max-w-[22rem] text-left text-[0.68rem] uppercase leading-5 tracking-[0.18em] text-white/28 md:text-right">
              {"Moonlit object theatre \u00b7 private appointment maison"}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
