import { assets } from "@/content/assets";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/types/i18n";
import type { JournalEntry } from "@/types/journal";

const entriesByLocale: Record<Locale, JournalEntry[]> = {
  en: [
    { id: "antique-cuts", title: "The Antique Cut in Contemporary Light", type: "Essay", line: "How old-cut rhythm informs present silhouettes without nostalgia.", image: assets.journal.featureFrame },
    { id: "salon-notes", title: "Salon Notes, Winter Appointments", type: "House Notes", line: "On pacing a private viewing so the jewel arrives before language.", image: assets.journal.entryPortrait },
    { id: "macro-language", title: "Macro Language of the Mount", type: "Material Study", line: "Edges, grain, and polish choices that disappear into wear comfort.", image: assets.journal.entryMacro },
    { id: "campaign-observation", title: "Campaign Frame No. 01", type: "Campaign", line: "A study in restraint, profile tension, and evening atmosphere.", image: assets.journal.entryContour },
  ],
  fr: [
    { id: "antique-cuts", title: "La taille ancienne dans la lumière contemporaine", type: "Essai", line: "Comment le rythme des tailles anciennes informe les silhouettes actuelles sans nostalgie.", image: assets.journal.featureFrame },
    { id: "salon-notes", title: "Notes de salon, rendez-vous d'hiver", type: "Notes de maison", line: "Sur l'art d'un rendez-vous privé où le bijou précède les mots.", image: assets.journal.entryPortrait },
    { id: "macro-language", title: "Langage macro de la monture", type: "Étude matière", line: "Arêtes, grain et choix de poli qui disparaissent dans le confort du porté.", image: assets.journal.entryMacro },
    { id: "campaign-observation", title: "Cadre de campagne n°01", type: "Campagne", line: "Étude de retenue, tension de profil et atmosphère du soir.", image: assets.journal.entryContour },
  ],
  es: [
    { id: "antique-cuts", title: "El corte antiguo en luz contemporánea", type: "Ensayo", line: "Cómo el ritmo de cortes antiguos informa siluetas actuales sin nostalgia.", image: assets.journal.featureFrame },
    { id: "salon-notes", title: "Notas de salón, citas de invierno", type: "Notas de casa", line: "Sobre el ritmo de una cita privada para que la joya llegue antes que el lenguaje.", image: assets.journal.entryPortrait },
    { id: "macro-language", title: "Lenguaje macro de la montura", type: "Estudio material", line: "Bordes, grano y pulidos que desaparecen dentro del confort de uso.", image: assets.journal.entryMacro },
    { id: "campaign-observation", title: "Marco de campaña n.º 01", type: "Campaña", line: "Un estudio de contención, tensión de perfil y atmósfera nocturna.", image: assets.journal.entryContour },
  ],
};

export function getJournalContent(dictionary: Dictionary, lang: Locale) {
  const entries = entriesByLocale[lang];

  return {
    hero: {
      eyebrow: dictionary.pages.journal.heroEyebrow,
      title: dictionary.pages.journal.title,
      description: dictionary.pages.journal.description,
      image: assets.journal.campaignWideFrame,
    },
    featuredLabel: dictionary.pages.journal.featuredLabel,
    latestLabel: dictionary.pages.journal.latestLabel,
    entryReadLabel: dictionary.pages.journal.entryReadLabel,
    featured: entries[0],
    list: entries.slice(1),
    cta: {
      maisonLabel: dictionary.pages.journal.ctaMaison,
      maisonHref: `/${lang}/maison`,
      collectionLabel: dictionary.pages.journal.ctaCollection,
      collectionHref: `/${lang}/collection`,
    },
  };
}
