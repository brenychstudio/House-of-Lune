import { enContent } from "@/site/content/en";
import type { Locale } from "@/site/i18n/config";

const contentByLocale = {
  en: enContent,
} as const;

export function getSiteContent(locale: Locale) {
  return contentByLocale[locale];
}

export type { ObjectFoundation, PageIntro, SiteContent } from "@/site/content/contracts";
