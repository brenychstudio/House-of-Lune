"use client";

import { useEffect, useState } from "react";

import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import type { Locale } from "@/i18n/config";
import { getSiteContent } from "@/content/site";
import type { Dictionary } from "@/types/i18n";
import { Button } from "@/components/ui/Button";
import { TransitionLink } from "@/components/motion/TransitionLink";

type SiteHeaderProps = {
  dictionary: Dictionary;
  lang: Locale;
};

export function SiteHeader({ dictionary, lang }: SiteHeaderProps) {
  const siteContent = getSiteContent(dictionary, lang);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 42);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-30 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        isScrolled
          ? "border-b border-white/8 bg-[rgba(7,9,14,0.72)] backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.12)]"
          : "border-b border-transparent bg-[rgba(7,9,14,0.01)] backdrop-blur-[1px]"
      }`}
    >
      <div
        className={`mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-x-4 gap-y-3 px-5 sm:px-6 lg:px-10 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isScrolled ? "py-2.5" : "py-3.5"
        }`}
      >
        <TransitionLink
          aria-label={`${siteContent.brand} home`}
          href={`/${lang}`}
          className={`font-serif transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-cool)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)] ${
            isScrolled
              ? "text-[1rem] tracking-[0.11em] text-[var(--color-text)] sm:text-[1.08rem]"
              : "text-[1.03rem] tracking-[0.12em] text-[rgba(239,233,220,0.94)] sm:text-[1.12rem]"
          }`}
        >
          {siteContent.brand}
        </TransitionLink>

        <nav
          aria-label="Primary"
          className="order-3 hidden w-full items-center gap-6 text-center md:order-none md:flex md:w-auto"
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

        <div className="flex items-center gap-2 sm:gap-3">
          <div
            className={`transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              isScrolled ? "opacity-100" : "opacity-88"
            }`}
          >
            <LanguageSwitcher currentLang={lang} labels={siteContent.languages} />
          </div>

          <div
            className={`transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              isScrolled ? "opacity-100" : "opacity-92"
            }`}
          >
            <Button href={`/${lang}/contact`} variant="outline" size="sm">
              {siteContent.cta.inquiry}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
