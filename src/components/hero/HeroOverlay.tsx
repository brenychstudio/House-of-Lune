import { HeroCopy } from "@/components/hero/HeroCopy";
import type { HeroPhase } from "@/components/hero/HeroTimeline";

type HeroOverlayProps = {
  phase: HeroPhase;
  brandLine: string;
  headline: string;
  body: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
};

const phaseIndex: Record<HeroPhase, number> = {
  prelude: 0,
  trace: 1,
  contour: 2,
  emergence: 3,
  glint: 4,
  settle: 5,
  copy: 6,
  idle: 7,
};

export function HeroOverlay({ phase, brandLine, headline, body, primaryCta, secondaryCta }: HeroOverlayProps) {
  const progress = phaseIndex[phase];

  return (
    <div className="max-w-3xl">
      <HeroCopy
        brandLine={brandLine}
        headline={headline}
        body={body}
        primaryCta={primaryCta}
        secondaryCta={secondaryCta}
        showBrand={progress >= 5}
        showHeadline={progress >= 6}
        showBody={progress >= 7}
        showCtas={progress >= 7}
      />
    </div>
  );
}
