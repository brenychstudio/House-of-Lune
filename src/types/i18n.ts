export type Dictionary = {
  site: {
    brand: string;
    navigation: {
      collection: string;
      craft: string;
      maison: string;
      journal: string;
      contact: string;
    };
    cta: {
      inquiry: string;
      explore: string;
      appointment: string;
    };
    footer: {
      privacy: string;
      terms: string;
      contact: string;
    };
    languages: {
      en: string;
      fr: string;
      es: string;
    };
  };
  home: {
    hero: {
      brandLine: string;
      headline: string;
      body: string;
      chamberLabel: string;
      chamberNote: string;
    };
    manifesto: string;
    featured: {
      eyebrow: string;
      title: string;
      description: string;
      viewCollection: string;
    };
    craft: {
      eyebrow: string;
      title: string;
      description: string;
      bodyOne: string;
      bodyTwo: string;
      detailLine: string;
    };
    signature: {
      eyebrow: string;
      title: string;
      description: string;
      body: string;
      cta: string;
    };
    maison: {
      eyebrow: string;
      title: string;
      description: string;
      body: string;
      cta: string;
    };
    journal: {
      eyebrow: string;
      title: string;
      description: string;
      entries: [string, string, string];
      entryTag: string;
      cta: string;
    };
    inquiry: {
      eyebrow: string;
      heading: string;
      body: string;
      cta: string;
    };
  };
  pages: {
    placeholderLabel: string;
    collection: { title: string; description: string };
    maison: { title: string; description: string };
    craftsmanship: { title: string; description: string };
    journal: { title: string; description: string };
    contact: { title: string; description: string };
    piece: { titlePrefix: string; description: string };
  };
};
