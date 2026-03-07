import { assets } from "@/content/assets";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/types/i18n";
import type { MaisonMaterialNote, MaisonSection } from "@/types/maison";

const maisonCopy: Record<Locale, { heroLine: string; philosophy: MaisonSection[]; materials: MaisonMaterialNote[]; atelierLead: string; atelierNote: string }> = {
  en: {
    heroLine: "A quiet house where proportion, atmosphere, and intimacy are composed before each jewel meets the body.",
    philosophy: [
      { title: "Discretion over display", body: "The maison is built around private conversation, measured light, and gestures designed to outlast seasons." },
      { title: "Architecture of adornment", body: "Lines are studied like structures: every curve must hold tension, ease, and movement in the same form." },
    ],
    materials: [
      { label: "Metals", detail: "Warm platinum-white and soft yellow tones are balanced to preserve skin luminosity in evening light." },
      { label: "Stones", detail: "Selection favors temperament over volume: life, interval, and clarity at intimate distance." },
      { label: "Surface", detail: "Final brushing and polish are calibrated by hand to keep reflection precise, never loud." },
    ],
    atelierLead: "Within the atelier, prototypes, wax studies, and final pieces are reviewed as chapters in one continuous language.",
    atelierNote: "Appointments are received in Paris, Geneva, and Tokyo through private salons and trusted partners.",
  },
  fr: {
    heroLine: "Une maison feutrée où proportion, atmosphère et intimité sont composées avant que chaque bijou rencontre le corps.",
    philosophy: [
      { title: "La discrétion plutôt que l'effet", body: "La maison se construit autour de conversations privées, d'une lumière mesurée et de gestes pensés pour durer." },
      { title: "Architecture de l'ornement", body: "Les lignes sont étudiées comme des structures : chaque courbe doit tenir tension, aisance et mouvement." },
    ],
    materials: [
      { label: "Métaux", detail: "Les tonalités blanc-platine et jaune doux sont équilibrées pour préserver la luminosité de la peau le soir." },
      { label: "Pierres", detail: "La sélection privilégie le tempérament plutôt que le volume : vie, intervalle et clarté à distance intime." },
      { label: "Surface", detail: "Le brossage final et le poli sont réglés à la main pour garder un reflet précis, jamais démonstratif." },
    ],
    atelierLead: "À l'atelier, prototypes, études de cire et pièces finales sont relus comme des chapitres d'un même langage.",
    atelierNote: "Les rendez-vous sont accueillis à Paris, Genève et Tokyo via salons privés et partenaires de confiance.",
  },
  es: {
    heroLine: "Una casa silenciosa donde proporción, atmósfera e intimidad se componen antes de que cada joya encuentre el cuerpo.",
    philosophy: [
      { title: "Discreción antes que exhibición", body: "La maison se construye en conversación privada, luz medida y gestos diseñados para durar más que una temporada." },
      { title: "Arquitectura del adorno", body: "Las líneas se estudian como estructuras: cada curva debe sostener tensión, calma y movimiento a la vez." },
    ],
    materials: [
      { label: "Metales", detail: "Los tonos blanco-platino y amarillo suave se equilibran para conservar luminosidad en luz nocturna." },
      { label: "Piedras", detail: "La selección favorece temperamento sobre volumen: vida, intervalo y claridad en distancia íntima." },
      { label: "Superficie", detail: "El cepillado y pulido final se calibran a mano para mantener un reflejo preciso, nunca estridente." },
    ],
    atelierLead: "En el atelier, prototipos, estudios en cera y piezas finales se revisan como capítulos de un lenguaje continuo.",
    atelierNote: "Las citas se reciben en París, Ginebra y Tokio mediante salones privados y socios de confianza.",
  },
};

export function getMaisonContent(dictionary: Dictionary, lang: Locale) {
  const copy = maisonCopy[lang];

  return {
    hero: {
      eyebrow: dictionary.pages.maison.heroEyebrow,
      title: dictionary.pages.maison.title,
      description: dictionary.pages.maison.description,
      line: copy.heroLine,
      image: assets.maison.salonWide,
    },
    philosophy: {
      title: dictionary.pages.maison.philosophyTitle,
      sections: copy.philosophy,
    },
    materialLanguage: {
      title: dictionary.pages.maison.materialLanguageTitle,
      notes: copy.materials,
      image: assets.maison.salonPortrait,
    },
    atelierPreview: {
      title: dictionary.pages.maison.atelierPreviewTitle,
      lead: copy.atelierLead,
      note: copy.atelierNote,
      image: assets.maison.atelierNocturne,
    },
    cta: {
      collectionLabel: dictionary.pages.maison.ctaCollection,
      collectionHref: `/${lang}/collection`,
      inquiryLabel: dictionary.pages.maison.ctaInquiry,
      inquiryHref: `/${lang}/contact`,
    },
  };
}
