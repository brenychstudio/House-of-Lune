import { assets } from "@/content/assets";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/types/i18n";

const craftCopy: Record<Locale, { heroLine: string; chapters: { title: string; body: string; image: string }[]; studyLine: string; precision: string[] }> = {
  en: {
    heroLine: "Craft is treated as choreography: selection, setting, and finishing refined until intention reads without explanation.",
    chapters: [
      { title: "Stone temperament", body: "Each stone is viewed in cold and warm light to evaluate rhythm, depth, and response before placement.", image: assets.craft.processChapterOne },
      { title: "Structure and setting", body: "Mount geometry is adjusted through micro-prototypes so the jewel feels inevitable on the hand.", image: assets.craft.processChapterTwo },
      { title: "Final balance", body: "Polish, weight, and clasp resistance are tuned for grace in movement and confidence in wear.", image: assets.craft.precisionDetail },
    ],
    studyLine: "Macro study of grain, edge, and light-return used to validate each surface.",
    precision: ["Micron-level seat adjustments for stone security.", "Edge finishing tuned to avoid hard glare under evening conditions.", "Final quality review performed across motion, touch, and profile."],
  },
  fr: {
    heroLine: "Le savoir-faire est traité comme une chorégraphie : sélection, sertissage et finition affinés jusqu'à une lecture évidente.",
    chapters: [
      { title: "Tempérament de la pierre", body: "Chaque pierre est observée en lumière froide et chaude pour juger rythme, profondeur et réponse avant la pose.", image: assets.craft.processChapterOne },
      { title: "Structure et serti", body: "La géométrie de monture est ajustée par micro-prototypes pour que le bijou paraisse naturel sur la main.", image: assets.craft.processChapterTwo },
      { title: "Équilibre final", body: "Poli, poids et résistance du fermoir sont réglés pour allier grâce du mouvement et assurance au porté.", image: assets.craft.precisionDetail },
    ],
    studyLine: "Étude macro du grain, de l'arête et du retour de lumière pour valider chaque surface.",
    precision: ["Ajustements au micron pour la sécurité du serti.", "Finition des arêtes calibrée pour éviter un éclat dur en lumière du soir.", "Contrôle final réalisé sur mouvement, toucher et profil."],
  },
  es: {
    heroLine: "El oficio se trata como coreografía: selección, engaste y acabado refinados hasta que la intención se lea sin explicación.",
    chapters: [
      { title: "Temperamento de la piedra", body: "Cada piedra se observa en luz fría y cálida para evaluar ritmo, profundidad y respuesta antes del montaje.", image: assets.craft.processChapterOne },
      { title: "Estructura y engaste", body: "La geometría de la montura se ajusta con micro-prototipos para que la joya se sienta inevitable en la mano.", image: assets.craft.processChapterTwo },
      { title: "Balance final", body: "Pulido, peso y resistencia de cierre se afinan para gracia en movimiento y confianza de uso.", image: assets.craft.precisionDetail },
    ],
    studyLine: "Estudio macro de grano, borde y retorno de luz para validar cada superficie.",
    precision: ["Ajustes a nivel de micras para seguridad del engaste.", "Acabado de bordes calibrado para evitar brillo duro en condiciones nocturnas.", "Revisión final realizada en movimiento, tacto y perfil."],
  },
};

export function getCraftContent(dictionary: Dictionary, lang: Locale) {
  const copy = craftCopy[lang];

  return {
    hero: {
      eyebrow: dictionary.pages.craftsmanship.heroEyebrow,
      title: dictionary.pages.craftsmanship.title,
      description: dictionary.pages.craftsmanship.description,
      line: copy.heroLine,
      image: assets.craft.processHero,
    },
    process: {
      title: dictionary.pages.craftsmanship.processTitle,
      chapters: copy.chapters,
    },
    materialStudy: {
      title: dictionary.pages.craftsmanship.materialStudyTitle,
      line: copy.studyLine,
      image: assets.craft.materialStudyWide,
    },
    precisionNotes: {
      title: dictionary.pages.craftsmanship.precisionNotesTitle,
      items: copy.precision,
    },
    cta: {
      collectionLabel: dictionary.pages.craftsmanship.ctaCollection,
      collectionHref: `/${lang}/collection`,
      inquiryLabel: dictionary.pages.craftsmanship.ctaInquiry,
      inquiryHref: `/${lang}/contact`,
    },
  };
}
