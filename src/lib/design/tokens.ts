export const designTokens = {
  colors: {
    bg: "#07090e",
    bgSoft: "#0f1420",
    text: "#efe9dc",
    textMuted: "#b8b2a3",
    line: "#2a3242",
    lineSoft: "#1c2331",
    accent: "#cfbf9d",
    accentCool: "#c3ccd8",
  },
  spacing: {
    section: "clamp(4.5rem, 8vw, 9rem)",
    sectionTight: "clamp(3.5rem, 6vw, 6.5rem)",
    content: "clamp(1rem, 3vw, 2rem)",
  },
  radii: {
    sm: "0.375rem",
    md: "0.75rem",
    lg: "1.25rem",
  },
  surfaces: {
    base: "rgba(255, 255, 255, 0.018)",
    raised: "rgba(255, 255, 255, 0.036)",
    glow: "rgba(207, 191, 157, 0.08)",
  },
} as const;
