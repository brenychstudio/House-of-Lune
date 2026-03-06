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
    <header className="sticky top-0 z-20 border-b border-[var(--color-line-soft)]/90 bg-[rgba(7,9,14,0.86)] backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-6 py-4 lg:px-10">
        <a href={`/${lang}`} className="font-serif text-[1.12rem] tracking-[0.11em]">
          {siteContent.brand}
        </a>
        <nav className="hidden items-center gap-8 md:flex">
          {siteContent.navigation.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-[0.7rem] uppercase tracking-[0.16em] text-[var(--color-text-muted)]/90 transition-colors duration-300 hover:text-[var(--color-text)]"
            >
              {item.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <LanguageSwitcher currentLang={lang} labels={siteContent.languages} />
          <Button href={`/${lang}/contact`} variant="outline" size="sm">
            {siteContent.cta.inquiry}
          </Button>
        </div>
      </div>
    </header>
  );
}
