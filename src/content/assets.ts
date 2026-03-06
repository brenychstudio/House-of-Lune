const heroRingPoster = "/media/pieces/hero-ring/hero/hol-hero-ring-signature-poster-16x9-01.png";
const heroRingFeaturedCard = "/media/pieces/hero-ring/cards/hol-hero-ring-featured-card-4x5-01.png";
const heroRingMacroBand = "/media/pieces/hero-ring/macro/hol-hero-ring-band-macro-3x2-01.png";
const heroRingMacroGemstone = "/media/pieces/hero-ring/macro/hol-hero-ring-gemstone-macro-4x5-01.png";
const heroRingCampaignStillLife = "/media/pieces/hero-ring/campaign/hol-hero-ring-still-life-16x9-01.png";
const heroRingGallerySideContour = "/media/pieces/hero-ring/gallery/hol-hero-ring-side-contour-4x5-01.png";
const heroRingOnBody = "/media/pieces/hero-ring/on-body/hol-hero-ring-on-body-4x5-01.png";

export const assets = {
  home: {
    hero: {
      poster: heroRingPoster,
      teaserStill: "/media/home/hero/hol-hero-teaser-film-still-16x9-01.png",
      atmosphericBackground: "/media/home/backgrounds/hol-dark-atmospheric-background-16x9-01.png",
    },
  },
  pieces: {
    heroRing: {
      hero: heroRingPoster,
      featuredCard: heroRingFeaturedCard,
      macroBand: heroRingMacroBand,
      macroGemstone: heroRingMacroGemstone,
      campaignStillLife: heroRingCampaignStillLife,
      gallerySideContour: heroRingGallerySideContour,
      onBody: heroRingOnBody,
    },
  },
  maison: {
    atelierNocturne: "/media/maison/atelier/hol-maison-atelier-nocturne-3x2-01.png",
  },
  journal: {
    campaignWideFrame: "/media/journal/campaign-01/hol-campaign-01-wide-frame-21x9-01.png",
  },
} as const;
