"use client";

import { HeroOverlay } from "@/components/hero/HeroOverlay";
import { HeroPhaseController } from "@/components/hero/HeroPhaseController";
import { HeroStage } from "@/components/hero/HeroStage";
import { HeroStageFrame } from "@/components/hero/HeroStageFrame";

type HeroShellProps = {
  brandLine: string;
  headline: string;
  body: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  chamberLabel: string;
  chamberNote: string;
};

export function HeroShell({ brandLine, headline, body, primaryCta, secondaryCta, chamberLabel, chamberNote }: HeroShellProps) {
  return (
    <HeroPhaseController>
      {({ phase }) => (
        <div className="mx-auto grid w-full max-w-6xl gap-14 px-6 pb-24 pt-16 lg:grid-cols-[1.1fr_0.9fr] lg:px-10 lg:pb-30 lg:pt-26">
          <HeroOverlay
            phase={phase}
            brandLine={brandLine}
            headline={headline}
            body={body}
            primaryCta={primaryCta}
            secondaryCta={secondaryCta}
          />
          <HeroStageFrame chamberLabel={chamberLabel} chamberNote={chamberNote}>
            <HeroStage phase={phase} />
          </HeroStageFrame>
        </div>
      )}
    </HeroPhaseController>
  );
}
