const heroRingPoster = "/media/pieces/hero-ring/hero/hol-hero-ring-signature-poster-16x9-01.png";
const heroRingFeaturedCard = "/media/pieces/hero-ring/cards/hol-hero-ring-featured-card-4x5-01.png";
const heroRingMacroBand = "/media/pieces/hero-ring/macro/hol-hero-ring-band-macro-3x2-01.png";
const heroRingMacroGemstone = "/media/pieces/hero-ring/macro/hol-hero-ring-gemstone-macro-4x5-01.png";
const heroRingCampaignStillLife = "/media/pieces/hero-ring/campaign/hol-hero-ring-still-life-16x9-01.png";
const heroRingGallerySideContour = "/media/pieces/hero-ring/gallery/hol-hero-ring-side-contour-4x5-01.png";
const heroRingOnBody = "/media/pieces/hero-ring/on-body/hol-hero-ring-on-body-4x5-01.png";

const eclipseLineFeaturedCard = "/media/pieces/eclipse-line/cards/hol-eclipse-line-featured-card-4x5-01.png";
const eclipseLineEditorialDetail = "/media/pieces/eclipse-line/editorial/hol-eclipse-line-editorial-detail-3x2-01.png";
const eclipseLineMacroDetail = "/media/pieces/eclipse-line/macro/hol-eclipse-line-macro-detail-4x5-01.png";
const eclipseLineOnBody = "/media/pieces/eclipse-line/on-body/hol-eclipse-line-on-body-4x5-01.png";

const velourCascadeFeaturedCard = "/media/pieces/velour-cascade/cards/hol-velour-cascade-featured-card-4x5-01.png";
const velourCascadeEditorialDetail = "/media/pieces/velour-cascade/editorial/hol-velour-cascade-editorial-detail-16x9-01.png";
const velourCascadeMacroDetail = "/media/pieces/velour-cascade/macro/hol-velour-cascade-macro-detail-4x5-01.png";
const velourCascadeOnBody = "/media/pieces/velour-cascade/on-body/hol-velour-cascade-on-body-4x5-01.png";

const astralCuffFeaturedCard = "/media/pieces/astral-cuff/cards/hol-astral-cuff-featured-card-4x5-01.png";
const astralCuffEditorialDetail = "/media/pieces/astral-cuff/editorial/hol-astral-cuff-editorial-detail-16x9-01.png";
const astralCuffMacroDetail = "/media/pieces/astral-cuff/macro/hol-astral-cuff-macro-detail-3x2-01.png";
const astralCuffOnBody = "/media/pieces/astral-cuff/on-body/hol-astral-cuff-on-body-4x5-01.png";

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
    eclipseLine: {
      hero: eclipseLineEditorialDetail,
      featuredCard: eclipseLineFeaturedCard,
      macroBand: eclipseLineMacroDetail,
      macroGemstone: eclipseLineMacroDetail,
      campaignStillLife: eclipseLineEditorialDetail,
      gallerySideContour: eclipseLineFeaturedCard,
      onBody: eclipseLineOnBody,
    },
    velourCascade: {
      hero: velourCascadeEditorialDetail,
      featuredCard: velourCascadeFeaturedCard,
      macroBand: velourCascadeMacroDetail,
      macroGemstone: velourCascadeMacroDetail,
      campaignStillLife: velourCascadeEditorialDetail,
      gallerySideContour: velourCascadeFeaturedCard,
      onBody: velourCascadeOnBody,
    },
    astralCuff: {
      hero: astralCuffEditorialDetail,
      featuredCard: astralCuffFeaturedCard,
      macroBand: astralCuffMacroDetail,
      macroGemstone: astralCuffMacroDetail,
      campaignStillLife: astralCuffEditorialDetail,
      gallerySideContour: astralCuffFeaturedCard,
      onBody: astralCuffOnBody,
    },
  },
  maison: {
    atelierNocturne: "/media/maison/atelier/hol-maison-atelier-nocturne-3x2-01.png",
    salonPortrait: heroRingOnBody,
    salonWide: heroRingCampaignStillLife,
  },
  craft: {
    processHero: heroRingMacroBand,
    processChapterOne: heroRingMacroGemstone,
    processChapterTwo: heroRingMacroBand,
    materialStudyWide: heroRingCampaignStillLife,
    precisionDetail: heroRingGallerySideContour,
  },
  journal: {
    campaignWideFrame: "/media/journal/campaign-01/hol-campaign-01-wide-frame-21x9-01.png",
    featureFrame: heroRingCampaignStillLife,
    entryPortrait: heroRingOnBody,
    entryMacro: heroRingMacroGemstone,
    entryContour: heroRingGallerySideContour,
  },
} as const;
