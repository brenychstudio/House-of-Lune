import type { Metadata } from "next";

import type { Locale } from "@/i18n/config";

export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  "https://house-of-lune.brenychinfo.workers.dev";

export const ogImagePath = "/og/house-of-lune-og.png";
export const ogImageUrl = `${siteUrl}${ogImagePath}`;

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
  fr: "Une demo de maison joailliere de luxe faconnee par l'ombre, la precision et une elegance editoriale contemporaine.",
  es: "Una demo de maison de joyeria de lujo definida por sombra, precision y elegancia editorial contemporanea.",
};

const baseTitle = "House of Lune";

const defaultOgAlt =
  "House of Lune - Jewels composed in shadow, light, and deliberate silence.";

type PageMetadataInput = {
  lang: Locale;
  title: string;
  description: string;
  path: string;
  image?: string;
};

function localizedPath(lang: Locale, path: string) {
  return `/${lang}${path}`;
}

function resolveImageUrl(image?: string) {
  if (!image) return ogImageUrl;
  if (image.startsWith("http://") || image.startsWith("https://")) return image;
  return `${siteUrl}${image}`;
}

function makeAlternates(lang: Locale, path: string) {
  return {
    canonical: localizedPath(lang, path),
    languages: {
      en: localizedPath("en", path),
      fr: localizedPath("fr", path),
      es: localizedPath("es", path),
      "x-default": localizedPath("en", path),
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
  keywords: [
    "House of Lune",
    "luxury jewelry",
    "haute joaillerie",
    "maison",
    "editorial showcase",
  ],
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
    title: "House of Lune — Moonlit Object Theatre",
    description: defaultDescription.en,
    type: "website",
    siteName: baseTitle,
    url: `${siteUrl}/en`,
    images: [
      {
        url: ogImageUrl,
        width: 1200,
        height: 630,
        alt: defaultOgAlt,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "House of Lune — Moonlit Object Theatre",
    description: defaultDescription.en,
    images: [ogImageUrl],
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
};

export function buildPageMetadata({
  lang,
  title,
  description,
  path,
  image,
}: PageMetadataInput): Metadata {
  const pageUrl = `${siteUrl}${localizedPath(lang, path)}`;
  const resolvedImage = resolveImageUrl(image);

  return {
    title,
    description,
    alternates: makeAlternates(lang, path),
    openGraph: {
      title: `${title} · ${siteNames[lang]}`,
      description,
      type: "website",
      locale: localeCodes[lang],
      siteName: siteNames[lang],
      url: pageUrl,
      images: [
        {
          url: resolvedImage,
          width: 1200,
          height: 630,
          alt: defaultOgAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} · ${siteNames[lang]}`,
      description,
      images: [resolvedImage],
    },
  };
}

export function getDefaultDescription(lang: Locale) {
  return defaultDescription[lang];
}
