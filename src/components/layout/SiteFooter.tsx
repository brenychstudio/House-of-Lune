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
    <footer>
      <div className="mx-auto w-full max-w-[34rem] px-5 pb-8 pt-3 text-center sm:px-6 sm:pb-10 sm:pt-4">
        <div className="mx-auto mb-6 h-px w-28 bg-gradient-to-r from-transparent via-white/12 to-transparent" />

        <TransitionLink
          href={`/${lang}`}
          className="inline-block font-serif text-[1rem] tracking-[0.12em] text-[var(--color-text)] transition-colors duration-500 hover:text-white"
        >
          {siteContent.brand}
        </TransitionLink>

        <p className="mx-auto mt-3 max-w-[24rem] text-[0.6rem] uppercase leading-5 tracking-[0.17em] text-white/30">
          Private salon inquiries handled with discretion.
        </p>

        <nav
          aria-label="Footer"
          className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2"
        >
          {siteContent.footerLinks.map((item) => (
            <TransitionLink
              key={item.label}
              href={item.href}
              className="text-[0.74rem] text-white/44 transition-colors duration-500 hover:text-[var(--color-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-cool)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)]"
            >
              {item.label}
            </TransitionLink>
          ))}
        </nav>

        <p className="mx-auto mt-5 max-w-[18rem] text-[0.54rem] uppercase leading-5 tracking-[0.22em] text-white/18">
          Moonlit object theatre · private appointment maison
        </p>

        <p className="mt-4 text-[0.7rem] text-white/30">
          © {new Date().getFullYear()} {siteContent.brand}
        </p>
      </div>
    </footer>
  );
}
