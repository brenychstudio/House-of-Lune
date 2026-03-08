import type { Metadata } from "next";

import type { Locale } from "@/i18n/config";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://house-of-lune.vercel.app";

const localeCodes: Record<Locale, string> = {
  en: "en_US",
  fr: "fr_FR",
  es: "es_ES",
};

const siteNames: Record<Locale, string> = {
  en: "House of Lune",
  fr: "House of Lune",
  es: "House of Lune",
};

const defaultDescription: Record<Locale, string> = {
  en: "A luxury jewelry maison demo shaped in shadow, precision, and contemporary editorial elegance.",
  fr: "Une démo de maison joaillière de luxe façonnée par l'ombre, la précision et une élégance éditoriale contemporaine.",
  es: "Una demo de maison de joyería de lujo definida por sombra, precisión y elegancia editorial contemporánea.",
};

const baseTitle = "House of Lune";

type PageMetadataInput = {
  lang: Locale;
  title: string;
  description: string;
  path: string;
  image?: string;
};

function makeAlternates(path: string) {
  return {
    canonical: path,
    languages: {
      en: `/en${path}`,
      fr: `/fr${path}`,
      es: `/es${path}`,
      "x-default": `/en${path}`,
    },
  };
}

export const globalMetadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: baseTitle,
    template: `%s · ${baseTitle}`,
  },
  description: defaultDescription.en,
  applicationName: baseTitle,
  keywords: ["House of Lune", "luxury jewelry", "haute joaillerie", "maison", "editorial showcase"],
  alternates: {
    canonical: "/en",
    languages: {
      en: "/en",
      fr: "/fr",
      es: "/es",
      "x-default": "/en",
    },
  },
  openGraph: {
    title: baseTitle,
    description: defaultDescription.en,
    type: "website",
    siteName: baseTitle,
    url: "/en",
    images: [{ url: "/opengraph-image" }],
  },
  twitter: {
    card: "summary_large_image",
    title: baseTitle,
    description: defaultDescription.en,
    images: ["/twitter-image"],
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
};

export function buildPageMetadata({ lang, title, description, path, image = "/opengraph-image" }: PageMetadataInput): Metadata {
  const localizedPath = `/${lang}${path}`;

  return {
    title,
    description,
    alternates: makeAlternates(path),
    openGraph: {
      title: `${title} · ${siteNames[lang]}`,
      description,
      type: "website",
      locale: localeCodes[lang],
      siteName: siteNames[lang],
      url: localizedPath,
      images: [{ url: image }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} · ${siteNames[lang]}`,
      description,
      images: [image],
    },
  };
}

export function getDefaultDescription(lang: Locale) {
  return defaultDescription[lang];
}
