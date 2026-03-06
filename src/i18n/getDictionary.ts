import { defaultLocale, isValidLocale, type Locale } from "@/i18n/config";
import { en } from "@/i18n/dictionaries/en";
import { es } from "@/i18n/dictionaries/es";
import { fr } from "@/i18n/dictionaries/fr";

const dictionaries = { en, fr, es };

export async function getDictionary(locale: string) {
  const safeLocale: Locale = isValidLocale(locale) ? locale : defaultLocale;
  return dictionaries[safeLocale];
}
