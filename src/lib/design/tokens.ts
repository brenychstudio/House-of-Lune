export const designTokens = {
  colors: {
    bg: "#080a0f",
    bgSoft: "#0d1119",
    text: "#f0ecdf",
    textMuted: "#b8b1a0",
    line: "#242a37",
    accent: "#d5c8a8",
  },
  spacing: {
    section: "clamp(4rem, 8vw, 8rem)",
    content: "clamp(1rem, 3vw, 2rem)",
  },
  radii: {
    sm: "0.375rem",
    md: "0.75rem",
    lg: "1.25rem",
  },
  surfaces: {
    base: "rgba(255, 255, 255, 0.01)",
    raised: "rgba(255, 255, 255, 0.03)",
  },
} as const;
