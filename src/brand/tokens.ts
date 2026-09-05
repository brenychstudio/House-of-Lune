export const brandTokens = {
  color: {
    background: "#090a0c",
    backgroundSoft: "#111216",
    text: "#f1eee8",
    textSubdued: "#a8a49c",
    line: "#2b2d31",
    surface: "#15171b",
    accentMetal: "#c7bda9",
    focus: "#e5d2a9",
  },
  spacing: {
    page: "clamp(1.25rem, 4vw, 4.5rem)",
    section: "clamp(4.5rem, 9vw, 9rem)",
    compactSection: "clamp(2.75rem, 6vw, 5rem)",
  },
  layout: {
    content: "72rem",
    reading: "42rem",
  },
  typography: {
    display: "clamp(3rem, 9vw, 8.5rem)",
    heading: "clamp(2rem, 5vw, 4.5rem)",
    body: "clamp(1rem, 1.4vw, 1.2rem)",
  },
  motion: {
    quick: "160ms",
    base: "360ms",
    reveal: "900ms",
    easing: "cubic-bezier(0.22, 1, 0.36, 1)",
  },
  zIndex: {
    header: 40,
    menu: 50,
    skipLink: 60,
  },
} as const;
