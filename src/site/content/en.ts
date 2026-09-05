import type { SiteContent } from "@/site/content/contracts";

export const enContent = {
  locale: "en",
  identity: {
    name: "BRENYCH",
    descriptor: "Objects for the Body",
  },
  navigation: [
    { label: "Objects", href: "/en/objects" },
    { label: "Collections", href: "/en/collections" },
    { label: "Atelier", href: "/en/atelier" },
    { label: "Journal", href: "/en/journal" },
    { label: "About", href: "/en/about" },
    { label: "Private Inquiry", href: "/en/private-inquiry" },
    { label: "Account", href: "/en/account" },
    { label: "Bag", href: "/en/bag" },
  ],
  home: {
    eyebrow: "Founder-led wearable objects",
    headline: "Sculptural objects engineered for the body.",
    introduction:
      "BRENYCH brings authorship, physical precision, and a measured digital experience to wearable form.",
    objectsCta: "Explore Objects",
    inquiryCta: "Private Inquiry",
  },
  pages: {
    objects: {
      eyebrow: "Wearable Objects",
      title: "A considered foundation for physical editions.",
      description:
        "Each object enters the public collection only after design, fit, production, and compliance review.",
    },
    collections: {
      eyebrow: "Collections",
      title: "Bodies of work, edited with restraint.",
      description:
        "Collections will group approved objects by idea and material language without obscuring their individual identity.",
    },
    atelier: {
      eyebrow: "Atelier",
      title: "Making is part of the object’s permanent record.",
      description:
        "Design revisions, fitting systems, finishing, assembly, and quality control are treated as one traceable practice.",
    },
    journal: {
      eyebrow: "Journal",
      title: "Notes on form, body, process, and material.",
      description:
        "Editorial work will be published through typed, reviewed site-native content rather than an external CMS.",
    },
    about: {
      eyebrow: "About",
      title: "BRENYCH is a name, an authorship, and a standard of work.",
      description:
        "The brand is built in Barcelona around sculptural objects that are designed to be physically lived with.",
    },
    privateInquiry: {
      eyebrow: "Private Inquiry",
      title: "A direct conversation with the studio.",
      description:
        "The verified inquiry channel will open with the first approved release; this foundation does not simulate delivery of a message.",
    },
    account: {
      eyebrow: "Collector Space",
      title: "Ownership will extend beyond an order receipt.",
      description:
        "Eligible owners will be able to access object identity, provenance, care, and service records after account activation.",
    },
    bag: {
      eyebrow: "Bag",
      title: "Your bag is empty.",
      description:
        "Acquisition controls appear only when an object has approved commercial data and can be offered truthfully.",
    },
  },
  object: {
    slug: "mask-01",
    name: "MASK 01",
    descriptor: "A development foundation for BRENYCH’s first face object.",
    statusLabel: "Development presentation — not offered for sale",
    chapters: [
      { label: "FORM", description: "Silhouette and relationship to the face." },
      { label: "MATERIAL", description: "Surface, finish, and response to controlled light." },
      { label: "FIT", description: "A replaceable system designed for secure event wear." },
      { label: "CRAFT", description: "Revision-controlled fabrication, finishing, and assembly." },
      { label: "OBJECT", description: "A future spatial examination with a complete static fallback." },
      { label: "ACQUIRE", description: "Commercial terms remain closed until they are formally approved." },
    ],
  },
  footer: {
    statement: "Wearable sculptural objects — Barcelona",
  },
} as const satisfies SiteContent;
