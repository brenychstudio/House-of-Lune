"use client";

import { useEffect, useState, type ReactNode } from "react";
import { HERO_PHASE_DURATIONS_MS, HERO_PHASE_ORDER, getNextHeroPhase, type HeroPhase } from "@/components/hero/HeroTimeline";

type HeroPhaseState = {
  phase: HeroPhase;
  previousPhase: HeroPhase | null;
  isIdle: boolean;
};

type HeroPhaseControllerProps = {
  children: (state: HeroPhaseState) => ReactNode;
};

export function HeroPhaseController({ children }: HeroPhaseControllerProps) {
  const [phase, setPhase] = useState<HeroPhase>(HERO_PHASE_ORDER[0]);
  const [previousPhase, setPreviousPhase] = useState<HeroPhase | null>(null);

  useEffect(() => {
    if (phase === "idle") {
      return;
    }

    const timeout = window.setTimeout(() => {
      setPreviousPhase(phase);
      setPhase(getNextHeroPhase(phase));
    }, HERO_PHASE_DURATIONS_MS[phase]);

    return () => window.clearTimeout(timeout);
  }, [phase]);

  return children({
    phase,
    previousPhase,
    isIdle: phase === "idle",
  });
}
