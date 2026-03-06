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
  prelude: { ambient: 0.08, rim: 0.06, fill: 0.04, accent: 0, floor: 0.08, object: 0.08, contour: 0.04, glint: 0 },
  trace: { ambient: 0.1, rim: 0.24, fill: 0.08, accent: 0.02, floor: 0.12, object: 0.14, contour: 0.22, glint: 0 },
  contour: { ambient: 0.12, rim: 0.36, fill: 0.14, accent: 0.06, floor: 0.2, object: 0.28, contour: 0.5, glint: 0 },
  emergence: { ambient: 0.14, rim: 0.42, fill: 0.24, accent: 0.12, floor: 0.24, object: 0.46, contour: 0.42, glint: 0.04 },
  glint: { ambient: 0.16, rim: 0.48, fill: 0.28, accent: 0.32, floor: 0.26, object: 0.58, contour: 0.32, glint: 0.85 },
  settle: { ambient: 0.14, rim: 0.38, fill: 0.23, accent: 0.12, floor: 0.25, object: 0.54, contour: 0.26, glint: 0.08 },
  copy: { ambient: 0.145, rim: 0.33, fill: 0.2, accent: 0.1, floor: 0.22, object: 0.51, contour: 0.2, glint: 0.04 },
  idle: { ambient: 0.15, rim: 0.32, fill: 0.205, accent: 0.08, floor: 0.22, object: 0.53, contour: 0.2, glint: 0.02 },
};

export function getHeroStageTone(phase: HeroPhase) {
  return phaseTone[phase];
}
