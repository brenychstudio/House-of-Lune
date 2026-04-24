import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";

import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { RouteTransitionController } from "@/components/motion/RouteTransitionController";
import { isValidLocale, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";

const siteUrl = "https://house-of-lune.pages.dev";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "House of Lune — Moonlit Object Theatre",
    template: "%s — House of Lune",
  },
  description:
    "Contemporary high jewelry shaped by architectural form, lunar restraint, and a measured sense of reveal.",
  openGraph: {
    type: "website",
    siteName: "House of Lune",
    title: "House of Lune — Moonlit Object Theatre",
    description:
      "Contemporary high jewelry shaped by architectural form, lunar restraint, and a measured sense of reveal.",
    images: [
      {
        url: "/og/house-of-lune-og.png",
        width: 1200,
        height: 630,
        alt: "House of Lune — Jewels composed in shadow, light, and deliberate silence.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "House of Lune — Moonlit Object Theatre",
    description:
      "Contemporary high jewelry shaped by architectural form, lunar restraint, and a measured sense of reveal.",
    images: ["/og/house-of-lune-og.png"],
  },
};

type LocaleLayoutProps = {
  children: ReactNode;
  params: Promise<{ lang: string }>;
};

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
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
