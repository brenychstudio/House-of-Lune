"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  HERO_PHASE_DURATIONS_MS,
  HERO_PHASE_ORDER,
  getNextHeroPhase,
  getPhaseProgress,
  type HeroPhase,
} from "@/lib/webgl/heroTiming";

type HeroPhaseState = {
  phase: HeroPhase;
  previousPhase: HeroPhase | null;
  isIdle: boolean;
  phaseProgress: number;
};

type HeroPhaseControllerProps = {
  children: (state: HeroPhaseState) => ReactNode;
};

export function HeroPhaseController({ children }: HeroPhaseControllerProps) {
  const [phase, setPhase] = useState<HeroPhase>(HERO_PHASE_ORDER[0]);
  const [previousPhase, setPreviousPhase] = useState<HeroPhase | null>(null);
  const [phaseStartTime, setPhaseStartTime] = useState(() => Date.now());
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (phase === "idle") {
      return;
    }

    const timeout = window.setTimeout(() => {
      setPreviousPhase(phase);
      setPhase(getNextHeroPhase(phase));
      setPhaseStartTime(Date.now());
    }, HERO_PHASE_DURATIONS_MS[phase]);

    return () => window.clearTimeout(timeout);
  }, [phase]);

  useEffect(() => {
    if (phase === "idle") {
      return;
    }

    const interval = window.setInterval(() => setNow(Date.now()), 60);
    return () => window.clearInterval(interval);
  }, [phase]);

  const phaseProgress = useMemo(() => getPhaseProgress(phase, now - phaseStartTime), [now, phase, phaseStartTime]);

  return children({
    phase,
    previousPhase,
    isIdle: phase === "idle",
    phaseProgress,
  });
}
