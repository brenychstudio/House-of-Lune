import type { ReactNode } from "react";

import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/types/i18n";

type PageShellProps = {
  children: ReactNode;
  dictionary: Dictionary;
  lang: Locale;
};

export function PageShell({ children, dictionary, lang }: PageShellProps) {
  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
      <SiteHeader dictionary={dictionary} lang={lang} />
      <main>{children}</main>
      <SiteFooter dictionary={dictionary} lang={lang} />
    </div>
  );
}
