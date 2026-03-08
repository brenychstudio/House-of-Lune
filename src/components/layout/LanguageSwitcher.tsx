"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { locales, type Locale } from "@/i18n/config";

type LanguageSwitcherProps = {
  currentLang: Locale;
  labels: Record<Locale, string>;
};

export function LanguageSwitcher({ currentLang, labels }: LanguageSwitcherProps) {
  const pathname = usePathname();

  const segments = pathname.split("/").filter(Boolean);
  const rest = segments.slice(1);

  return (
    <div className="flex items-center gap-1 rounded-full border border-[var(--color-line-soft)]/90 bg-[rgba(255,255,255,0.015)] p-1">
      {locales.map((locale) => {
        const href = `/${locale}${rest.length ? `/${rest.join("/")}` : ""}`;
        const isActive = currentLang === locale;

        return (
          <Link
            key={locale}
            href={href}
            className={`rounded-full px-2 py-1 text-[0.58rem] tracking-[0.13em] transition-colors sm:px-2.5 sm:text-[0.62rem] sm:tracking-[0.14em] ${
              isActive
                ? "bg-[var(--color-accent)] text-black"
                : "text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
            }`}
            aria-current={isActive ? "page" : undefined}
          >
            {labels[locale]}
          </Link>
        );
      })}
    </div>
  );
}
