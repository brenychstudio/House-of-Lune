export const motion = {
  duration: {
    quick: "180ms",
    base: "300ms",
    slow: "520ms",
    cinematic: "820ms",
    cinematicSlow: "1200ms",
  },
  easing: {
    standard: "cubic-bezier(0.22, 1, 0.36, 1)",
    soft: "cubic-bezier(0.33, 1, 0.68, 1)",
    tension: "cubic-bezier(0.2, 0.82, 0.24, 1)",
    cinematic: "cubic-bezier(0.22, 1, 0.28, 1)",
    cinematicSoft: "cubic-bezier(0.3, 1, 0.35, 1)",
  },
  hero: {
    stageSettleMs: 1200,
    copyDelayMs: 520,
    glintMs: 560,
  },
} as const;
