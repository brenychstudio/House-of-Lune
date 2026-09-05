import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import { SiteFooter } from "@/site/components/SiteFooter";
import { SiteHeader } from "@/site/components/SiteHeader";
import { getSiteContent } from "@/site/content";
import { isLocale, locales } from "@/site/i18n/config";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const content = getSiteContent(locale);

  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <SiteHeader content={content} />
      {children}
      <SiteFooter content={content} />
    </>
  );
}
