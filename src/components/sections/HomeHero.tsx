import { HeroShell } from "@/components/hero/HeroShell";
import { homeContent } from "@/content/home";

export function HomeHero() {
  return (
    <section>
      <HeroShell
        brandLine={homeContent.hero.brandLine}
        headline={homeContent.hero.headline}
        body={homeContent.hero.body}
        primaryCta={homeContent.hero.primaryCta}
        secondaryCta={homeContent.hero.secondaryCta}
        chamberLabel={homeContent.hero.chamberLabel}
        chamberNote={homeContent.hero.chamberNote}
      />
    </section>
  );
}
