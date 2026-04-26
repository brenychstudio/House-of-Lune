"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { TransitionLink } from "@/components/motion/TransitionLink";
import { Button } from "@/components/ui/Button";
import { getSiteContent } from "@/content/site";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/types/i18n";

type SiteHeaderProps = {
  dictionary: Dictionary;
  lang: Locale;
};

export function SiteHeader({ dictionary, lang }: SiteHeaderProps) {
  const siteContent = getSiteContent(dictionary, lang);
  const pathname = usePathname();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 42);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        isScrolled || isMenuOpen
          ? "border-b border-white/8 bg-[rgba(7,9,14,0.84)] shadow-[0_10px_40px_rgba(0,0,0,0.18)] backdrop-blur-xl"
          : "border-b border-transparent bg-[rgba(7,9,14,0.01)] backdrop-blur-[1px]"
      }`}
    >
      <div
        className={`mx-auto grid w-full max-w-6xl grid-cols-[1fr_auto] items-center gap-x-4 px-5 sm:px-6 lg:px-10 xl:grid-cols-[auto_1fr_auto] transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isScrolled || isMenuOpen ? "py-2.5" : "py-3.5"
        }`}
      >
        <TransitionLink
          aria-label={`${siteContent.brand} home`}
          href={`/${lang}`}
          className={`min-w-0 font-serif transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-cool)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)] ${
            isScrolled || isMenuOpen
              ? "text-[1rem] tracking-[0.11em] text-[var(--color-text)] sm:text-[1.08rem]"
              : "text-[1.03rem] tracking-[0.12em] text-[rgba(239,233,220,0.94)] sm:text-[1.12rem]"
          }`}
        >
          {siteContent.brand}
        </TransitionLink>

        <nav
          aria-label="Primary"
          className="hidden items-center justify-center gap-6 xl:flex"
        >
          {siteContent.navigation.map((item) => (
            <TransitionLink
              key={item.label}
              href={item.href}
              className={`text-[0.68rem] uppercase tracking-[0.15em] transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-cool)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)] ${
                isScrolled
                  ? "text-white/70 hover:text-[var(--color-text)]"
                  : "text-white/58 hover:text-[rgba(239,233,220,0.9)]"
              }`}
            >
              {item.label}
            </TransitionLink>
          ))}
        </nav>

        <div className="flex min-w-0 shrink-0 items-center justify-end gap-2 sm:gap-3">
          <div
            className={`hidden transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] sm:block ${
              isScrolled || isMenuOpen ? "opacity-100" : "opacity-88"
            }`}
          >
            <LanguageSwitcher
              currentLang={lang}
              labels={siteContent.languages}
            />
          </div>

          <div className="hidden xl:block">
            <Button href={`/${lang}/contact`} variant="outline" size="sm">
              {siteContent.cta.inquiry}
            </Button>
          </div>

          <button
            type="button"
            aria-expanded={isMenuOpen}
            aria-controls="site-mobile-menu"
            onClick={() => setIsMenuOpen((current) => !current)}
            className="inline-flex h-10 items-center justify-center rounded-full border border-[var(--color-line)] bg-[rgba(255,255,255,0.01)] px-4 text-[0.64rem] uppercase tracking-[0.16em] text-[var(--color-text)] transition-colors duration-300 hover:border-[rgba(195,204,216,0.42)] hover:bg-[rgba(255,255,255,0.04)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-cool)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)] xl:hidden"
          >
            {isMenuOpen ? "Close" : "Menu"}
          </button>
        </div>
      </div>

      {isMenuOpen ? (
        <div
          id="site-mobile-menu"
          className="mx-auto w-full max-w-6xl px-5 pb-5 sm:px-6 lg:px-10 xl:hidden"
        >
          <div className="border-t border-white/8 pt-4 sm:hidden">
            <LanguageSwitcher
              currentLang={lang}
              labels={siteContent.languages}
            />
          </div>

          <nav
            aria-label="Mobile primary"
            className="mt-4 grid gap-2 sm:grid-cols-2"
          >
            {siteContent.navigation.map((item) => (
              <TransitionLink
                key={item.label}
                href={item.href}
                className="rounded-2xl border border-white/8 bg-white/[0.018] px-4 py-3 text-[0.68rem] uppercase tracking-[0.18em] text-white/70 transition-colors duration-300 hover:border-white/14 hover:text-[var(--color-text)]"
              >
                {item.label}
              </TransitionLink>
            ))}

            <TransitionLink
              href={`/${lang}/contact`}
              className="rounded-2xl border border-[rgba(228,214,178,0.32)] bg-[rgba(228,214,178,0.08)] px-4 py-3 text-[0.68rem] uppercase tracking-[0.18em] text-[var(--color-text)] transition-colors duration-300 hover:border-[rgba(228,214,178,0.55)] sm:col-span-2"
            >
              {siteContent.cta.inquiry}
            </TransitionLink>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
