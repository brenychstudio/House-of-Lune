import { assets } from "@/content/assets";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/types/i18n";

export function getHomeContent(dictionary: Dictionary, lang: Locale) {
  return {
    hero: {
      ...dictionary.home.hero,
      primaryCta: {
        label: dictionary.site.cta.explore,
        href: `/${lang}/collection`,
      },
      secondaryCta: {
        label: dictionary.site.cta.appointment,
        href: `/${lang}/contact`,
      },
      visuals: {
        poster: assets.home.hero.poster,
        teaserStill: assets.home.hero.teaserStill,
        atmosphericBackground: assets.home.hero.atmosphericBackground,
      },
    },
    manifesto: dictionary.home.manifesto,
    featured: dictionary.home.featured,
    craft: dictionary.home.craft,
    signature: dictionary.home.signature,
    maison: dictionary.home.maison,
    journal: dictionary.home.journal,
    inquiry: dictionary.home.inquiry,
    links: {
      maison: `/${lang}/maison`,
      journal: `/${lang}/journal`,
    },
    visuals: {
      featuredCard: assets.pieces.heroRing.featuredCard,
      featuredCards: [
        assets.pieces.eclipseLine.featuredCard,
        assets.pieces.velourCascade.featuredCard,
        assets.pieces.astralCuff.featuredCard,
      ],
      craft: {
        bandMacro: assets.pieces.heroRing.macroBand,
        gemstoneMacro: assets.pieces.heroRing.macroGemstone,
      },
      signatureCampaign: assets.pieces.heroRing.campaignStillLife,
      maisonAtelier: assets.maison.atelierNocturne,
      journalCampaign: assets.journal.campaignWideFrame,
    },
  };
}
