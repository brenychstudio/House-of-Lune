import type { Dictionary } from "@/types/i18n";
import type { Locale } from "@/i18n/config";

export function getSiteContent(dictionary: Dictionary, lang: Locale) {
  return {
    brand: dictionary.site.brand,
    navigation: [
      { label: dictionary.site.navigation.collection, href: `/${lang}/collection` },
      { label: dictionary.site.navigation.craft, href: `/${lang}/craftsmanship` },
      { label: dictionary.site.navigation.maison, href: `/${lang}/maison` },
      { label: dictionary.site.navigation.journal, href: `/${lang}/journal` },
      { label: dictionary.site.navigation.contact, href: `/${lang}/contact` },
    ],
    footerLinks: [
      { label: dictionary.site.footer.privacy, href: `/${lang}/contact` },
      { label: dictionary.site.footer.terms, href: `/${lang}/contact` },
      { label: dictionary.site.footer.contact, href: `/${lang}/contact` },
    ],
    cta: {
      inquiry: dictionary.site.cta.inquiry,
      explore: dictionary.site.cta.explore,
      appointment: dictionary.site.cta.appointment,
    },
    languages: dictionary.site.languages,
  };
}
