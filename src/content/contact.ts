import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/types/i18n";
import type { ContactContent } from "@/types/contact";

const detailsByLocale: Record<Locale, string[]> = {
  en: [
    "Private salon appointments by arrangement in Paris, Geneva, and Tokyo.",
    "Inquiries are reviewed discreetly, with responses generally within one business day.",
    "For urgent press or maison matters, include a subject reference in your message.",
  ],
  fr: [
    "Rendez-vous en salon privé sur arrangement à Paris, Genève et Tokyo.",
    "Chaque demande est étudiée avec discrétion, avec réponse sous un jour ouvré en général.",
    "Pour les demandes urgentes presse ou maison, ajoutez une référence d'objet en message.",
  ],
  es: [
    "Citas en salón privado con coordinación previa en París, Ginebra y Tokio.",
    "Cada consulta se estudia con discreción y suele recibir respuesta en un día hábil.",
    "Para temas urgentes de prensa o maison, incluya una referencia en su mensaje.",
  ],
};

export function getContactContent(dictionary: Dictionary, lang: Locale): ContactContent {
  return {
    hero: {
      eyebrow: dictionary.home.inquiry.eyebrow,
      title: dictionary.pages.contact.title,
      description: dictionary.pages.contact.description,
      intro: dictionary.pages.contact.intro,
    },
    options: {
      title: dictionary.pages.contact.optionsTitle,
      modes: [
        {
          value: "private-viewing",
          label: dictionary.pages.contact.modes.privateViewing,
          description: dictionary.pages.contact.modeDescriptions.privateViewing,
        },
        {
          value: "availability",
          label: dictionary.pages.contact.modes.availability,
          description: dictionary.pages.contact.modeDescriptions.availability,
        },
        {
          value: "bespoke",
          label: dictionary.pages.contact.modes.bespoke,
          description: dictionary.pages.contact.modeDescriptions.bespoke,
        },
        {
          value: "appointment",
          label: dictionary.pages.contact.modes.appointment,
          description: dictionary.pages.contact.modeDescriptions.appointment,
        },
      ],
    },
    form: {
      title: dictionary.pages.contact.formTitle,
      description: dictionary.pages.contact.formDescription,
      fields: {
        name: dictionary.pages.contact.form.name,
        email: dictionary.pages.contact.form.email,
        inquiryType: dictionary.pages.contact.form.inquiryType,
        piece: dictionary.pages.contact.form.piece,
        timing: dictionary.pages.contact.form.timing,
        message: dictionary.pages.contact.form.message,
      },
      submitLabel: dictionary.pages.contact.form.submit,
      successLabel: dictionary.pages.contact.form.success,
      errorLabel: dictionary.pages.contact.form.error,
    },
    details: {
      title: dictionary.pages.contact.detailsTitle,
      description: dictionary.pages.contact.detailsDescription,
      lines: detailsByLocale[lang],
    },
    appointmentNote: {
      title: dictionary.pages.contact.appointmentTitle,
      description: dictionary.pages.contact.appointmentDescription,
      cta: dictionary.pages.contact.appointmentCta,
    },
  };
}
