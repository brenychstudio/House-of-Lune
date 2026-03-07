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
      secondaryCta: string;
    };

  };
  pages: {
    placeholderLabel: string;
    collection: {
      eyebrow: string;
      title: string;
      description: string;
      editorialLine: string;
    };
    maison: {
      title: string;
      description: string;
      heroEyebrow: string;
      philosophyTitle: string;
      materialLanguageTitle: string;
      atelierPreviewTitle: string;
      ctaCollection: string;
      ctaInquiry: string;
    };
    craftsmanship: {
      title: string;
      description: string;
      heroEyebrow: string;
      processTitle: string;
      materialStudyTitle: string;
      precisionNotesTitle: string;
      ctaCollection: string;
      ctaInquiry: string;
    };
    journal: {
      title: string;
      description: string;
      heroEyebrow: string;
      featuredLabel: string;
      latestLabel: string;
      entryReadLabel: string;
      ctaMaison: string;
      ctaCollection: string;
    };
    contact: {
      title: string;
      description: string;
      intro: string;
      optionsTitle: string;
      formTitle: string;
      formDescription: string;
      detailsTitle: string;
      detailsDescription: string;
      appointmentTitle: string;
      appointmentDescription: string;
      appointmentCta: string;
      modes: {
        privateViewing: string;
        availability: string;
        bespoke: string;
        appointment: string;
      };
      modeDescriptions: {
        privateViewing: string;
        availability: string;
        bespoke: string;
        appointment: string;
      };
      form: {
        name: string;
        email: string;
        inquiryType: string;
        piece: string;
        timing: string;
        message: string;
        submit: string;
        success: string;
        error: string;
      };
    };
    piece: {
      titlePrefix: string;
      description: string;
      galleryTitle: string;
      storyTitle: string;
      labels: {
        material: string;
        stone: string;
        edition: string;
        availability: string;
      };
      inquiry: {
        eyebrow: string;
        title: string;
        description: string;
        primaryCta: string;
        secondaryCta: string;
      };
    };
  };
};
