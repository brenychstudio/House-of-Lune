import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";

import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { RouteTransitionController } from "@/components/motion/RouteTransitionController";
import { isValidLocale, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";
import { getDefaultDescription } from "@/lib/seo/metadata";

type LocaleLayoutProps = {
  children: ReactNode;
  params: Promise<{ lang: string }>;
};

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;

  if (!isValidLocale(lang)) {
    notFound();
  }

  const dictionary = await getDictionary(lang);

  return {
    title: {
      default: dictionary.site.brand,
      template: `%s · ${dictionary.site.brand}`,
    },
    description: getDefaultDescription(lang),
    openGraph: {
      locale: lang === "en" ? "en_US" : lang === "fr" ? "fr_FR" : "es_ES",
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { lang } = await params;

  if (!isValidLocale(lang)) {
    notFound();
  }

  const dictionary = await getDictionary(lang);

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
      <SiteHeader dictionary={dictionary} lang={lang} />
      <RouteTransitionController />

      <main id="main-content" className="min-h-[70vh]">
        {children}
      </main>

      <SiteFooter dictionary={dictionary} lang={lang} />
    </div>
  );
}
