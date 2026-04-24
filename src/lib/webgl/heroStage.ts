import type { HeroPhase } from "@/lib/webgl/heroTiming";

export type HeroStagePhaseTone = {
  ambient: number;
  rim: number;
  fill: number;
  accent: number;
  floor: number;
  object: number;
  contour: number;
  glint: number;
};

const phaseTone: Record<HeroPhase, HeroStagePhaseTone> = {
  prelude: { ambient: 0.1, rim: 0.08, fill: 0.05, accent: 0, floor: 0.08, object: 0.1, contour: 0.05, glint: 0 },
  trace: { ambient: 0.12, rim: 0.28, fill: 0.09, accent: 0.02, floor: 0.12, object: 0.18, contour: 0.24, glint: 0 },
  contour: { ambient: 0.14, rim: 0.4, fill: 0.16, accent: 0.06, floor: 0.2, object: 0.3, contour: 0.5, glint: 0 },
  emergence: { ambient: 0.18, rim: 0.5, fill: 0.3, accent: 0.12, floor: 0.28, object: 0.52, contour: 0.42, glint: 0.04 },
  glint: { ambient: 0.2, rim: 0.56, fill: 0.36, accent: 0.32, floor: 0.32, object: 0.66, contour: 0.34, glint: 0.85 },

  // ПІДНЯТІ ФІНАЛЬНІ СТАНИ — саме тут була головна проблема
  settle: { ambient: 0.2, rim: 0.5, fill: 0.34, accent: 0.12, floor: 0.32, object: 0.68, contour: 0.3, glint: 0.08 },
  copy:   { ambient: 0.2, rim: 0.46, fill: 0.31, accent: 0.1,  floor: 0.30, object: 0.66, contour: 0.26, glint: 0.04 },
  idle:   { ambient: 0.2, rim: 0.44, fill: 0.30, accent: 0.08, floor: 0.30, object: 0.66, contour: 0.26, glint: 0.02 },
};

export function getHeroStageTone(phase: HeroPhase) {
  return phaseTone[phase];
}