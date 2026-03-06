export const HERO_PHASE_ORDER = ["prelude", "trace", "contour", "emergence", "glint", "settle", "copy", "idle"] as const;

export type HeroPhase = (typeof HERO_PHASE_ORDER)[number];

export const HERO_PHASE_DURATIONS_MS: Record<HeroPhase, number> = {
  prelude: 780,
  trace: 860,
  contour: 980,
  emergence: 1100,
  glint: 720,
  settle: 980,
  copy: 520,
  idle: 0,
};

export const HERO_COPY_PHASE: HeroPhase = "copy";

export const HERO_STAGE_PHASES: HeroPhase[] = ["prelude", "trace", "contour", "emergence", "glint", "settle", "idle"];

export function getNextHeroPhase(phase: HeroPhase): HeroPhase {
  const currentIndex = HERO_PHASE_ORDER.indexOf(phase);
  const nextIndex = Math.min(currentIndex + 1, HERO_PHASE_ORDER.length - 1);

  return HERO_PHASE_ORDER[nextIndex];
}
