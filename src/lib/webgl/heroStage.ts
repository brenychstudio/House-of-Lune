import type { HeroPhase } from "@/components/hero/HeroTimeline";

export type HeroStagePhaseTone = {
  light: number;
  object: number;
  glint: number;
};

const phaseTone: Record<HeroPhase, HeroStagePhaseTone> = {
  prelude: { light: 0.1, object: 0.08, glint: 0 },
  trace: { light: 0.2, object: 0.16, glint: 0 },
  contour: { light: 0.34, object: 0.32, glint: 0 },
  emergence: { light: 0.46, object: 0.5, glint: 0.18 },
  glint: { light: 0.62, object: 0.62, glint: 0.62 },
  settle: { light: 0.54, object: 0.58, glint: 0.12 },
  copy: { light: 0.52, object: 0.56, glint: 0.08 },
  idle: { light: 0.52, object: 0.56, glint: 0.08 },
};

export function getHeroStageTone(phase: HeroPhase) {
  return phaseTone[phase];
}
