"use client";

import { useEffect, useState } from "react";
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

type RevealState = {
  brand: boolean;
  headline: boolean;
  body: boolean;
  ctas: boolean;
};

export function HeroOverlay({
  phase: _phase,
  brandLine,
  headline,
  body,
  primaryCta,
  secondaryCta,
}: HeroOverlayProps) {
  void _phase;

  const [reveal, setReveal] = useState<RevealState>({
    brand: false,
    headline: false,
    body: false,
    ctas: false,
  });

  useEffect(() => {
    const timers = [
      window.setTimeout(() => {
        setReveal((prev) => ({ ...prev, brand: true }));
      }, 120),

      window.setTimeout(() => {
        setReveal((prev) => ({ ...prev, headline: true }));
      }, 260),

      window.setTimeout(() => {
        setReveal((prev) => ({ ...prev, body: true }));
      }, 470),

      window.setTimeout(() => {
        setReveal((prev) => ({ ...prev, ctas: true }));
      }, 680),
    ];

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, []);

  return (
    <div className="max-w-3xl lg:pb-4">
      <HeroCopy
        brandLine={brandLine}
        headline={headline}
        body={body}
        primaryCta={primaryCta}
        secondaryCta={secondaryCta}
        showBrand={reveal.brand}
        showHeadline={reveal.headline}
        showBody={reveal.body}
        showCtas={reveal.ctas}
      />
    </div>
  );
}
