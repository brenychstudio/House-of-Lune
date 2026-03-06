export const HERO_PHASE_ORDER = ["prelude", "trace", "contour", "emergence", "glint", "settle", "copy", "idle"] as const;

export type HeroPhase = (typeof HERO_PHASE_ORDER)[number];

export const HERO_PHASE_DURATIONS_MS: Record<HeroPhase, number> = {
  prelude: 820,
  trace: 920,
  contour: 1080,
  emergence: 1180,
  glint: 560,
  settle: 1100,
  copy: 520,
  idle: 0,
};

export const HERO_STAGE_PHASES: HeroPhase[] = ["prelude", "trace", "contour", "emergence", "glint", "settle", "idle"];

export const HERO_COPY_PHASE: HeroPhase = "copy";

export const HERO_GLINT = {
  peakDelayMs: 150,
  peakDurationMs: 180,
  fadeMs: 380,
} as const;

export function getNextHeroPhase(phase: HeroPhase): HeroPhase {
  const currentIndex = HERO_PHASE_ORDER.indexOf(phase);
  const nextIndex = Math.min(currentIndex + 1, HERO_PHASE_ORDER.length - 1);

  return HERO_PHASE_ORDER[nextIndex];
}

export function getPhaseProgress(phase: HeroPhase, elapsedMs: number) {
  const duration = HERO_PHASE_DURATIONS_MS[phase];

  if (duration <= 0) {
    return 1;
  }

  return Math.max(0, Math.min(1, elapsedMs / duration));
}
