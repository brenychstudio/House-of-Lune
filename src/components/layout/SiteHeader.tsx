import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import type { Locale } from "@/i18n/config";
import { getSiteContent } from "@/content/site";
import type { Dictionary } from "@/types/i18n";
import { Button } from "@/components/ui/Button";

type SiteHeaderProps = {
  dictionary: Dictionary;
  lang: Locale;
};

export function SiteHeader({ dictionary, lang }: SiteHeaderProps) {
  const siteContent = getSiteContent(dictionary, lang);

  return (
    <header className="sticky top-0 z-30 border-b border-[var(--color-line-soft)]/90 bg-[rgba(7,9,14,0.9)] backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-x-4 gap-y-3 px-5 py-3 sm:px-6 lg:px-10">
        <a href={`/${lang}`} className="font-serif text-[1.02rem] tracking-[0.1em] sm:text-[1.12rem] sm:tracking-[0.11em]">
          {siteContent.brand}
        </a>
        <nav className="order-3 hidden w-full items-center gap-6 border-t border-[var(--color-line-soft)]/70 pt-3 text-center md:order-none md:flex md:w-auto md:border-none md:pt-0">
          {siteContent.navigation.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-[0.68rem] uppercase tracking-[0.15em] text-[var(--color-text-muted)]/90 transition-colors duration-300 hover:text-[var(--color-text)]"
            >
              {item.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2 sm:gap-3">
          <LanguageSwitcher currentLang={lang} labels={siteContent.languages} />
          <Button href={`/${lang}/contact`} variant="outline" size="sm">
            {siteContent.cta.inquiry}
          </Button>
        </div>
      </div>
    </header>
  );
}
