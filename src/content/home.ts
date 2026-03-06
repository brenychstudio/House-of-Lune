import { assets } from "@/content/assets";

export const homeContent = {
  hero: {
    brandLine: "Haute Joaillerie Maison",
    headline: "Jewels composed in shadow, light, and deliberate silence.",
    body: "House of Lune presents contemporary high jewelry shaped by architectural form, lunar restraint, and a measured sense of reveal.",
    primaryCta: {
      label: "Explore Collection",
      href: "#collection",
    },
    secondaryCta: {
      label: "Request Appointment",
      href: "#inquiry",
    },
    chamberLabel: "Cinematic Chamber · Study I",
    chamberNote: "The object stage remains intentionally veiled. Light, contour, and atmosphere are composed in advance of the reveal.",
    visuals: {
      poster: assets.home.hero.poster,
      teaserStill: assets.home.hero.teaserStill,
      atmosphericBackground: assets.home.hero.atmosphericBackground,
    },
  },
  manifesto:
    "We believe rarity is not announced. It is recognized in proportion, in patience, and in pieces that remain quietly unforgettable.",
  intros: {
    featured: "A first curation, arranged as chapters rather than a catalogue.",
    craft: "From stone to silhouette, each decision is exacting and quietly observed.",
    signature: "A campaign chapter on recurring lines, intervals, and inherited tension.",
    maison: "Inside the maison where intentions are tested, then made lasting.",
    journal: "Notes on material, culture, and contemporary adornment from the house.",
  },
  visuals: {
    featuredCard: assets.pieces.heroRing.featuredCard,
    craft: {
      bandMacro: assets.pieces.heroRing.macroBand,
      gemstoneMacro: assets.pieces.heroRing.macroGemstone,
    },
    signatureCampaign: assets.pieces.heroRing.campaignStillLife,
    maisonAtelier: assets.maison.atelierNocturne,
    journalCampaign: assets.journal.campaignWideFrame,
  },
  inquiry: {
    heading: "Begin a private conversation",
    body: "For bespoke commissions, salon appointments, and discreet guidance from the house.",
    cta: "Arrange Inquiry",
  },
};
