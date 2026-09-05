import type { Locale } from "@/site/i18n/config";

export type SiteIdentity = Readonly<{
  name: "BRENYCH";
  descriptor: "Objects for the Body";
}>;

export type NavigationItem = Readonly<{
  label: string;
  href: `/${Locale}/${string}`;
}>;

export type PageIntro = Readonly<{
  eyebrow: string;
  title: string;
  description: string;
}>;

export type ObjectFoundation = Readonly<{
  slug: "mask-01";
  name: "MASK 01";
  descriptor: string;
  statusLabel: string;
  chapters: readonly Readonly<{
    label: "FORM" | "MATERIAL" | "FIT" | "CRAFT" | "OBJECT" | "ACQUIRE";
    description: string;
  }>[];
}>;

export type SiteContent = Readonly<{
  locale: Locale;
  identity: SiteIdentity;
  navigation: readonly NavigationItem[];
  home: Readonly<{
    eyebrow: string;
    headline: string;
    introduction: string;
    objectsCta: string;
    inquiryCta: string;
  }>;
  pages: Readonly<{
    objects: PageIntro;
    collections: PageIntro;
    atelier: PageIntro;
    journal: PageIntro;
    about: PageIntro;
    privateInquiry: PageIntro;
    account: PageIntro;
    bag: PageIntro;
  }>;
  object: ObjectFoundation;
  footer: Readonly<{
    statement: string;
  }>;
}>;
