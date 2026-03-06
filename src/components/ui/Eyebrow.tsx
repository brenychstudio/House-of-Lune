import type { ReactNode } from "react";

type EyebrowProps = {
  children: ReactNode;
};

export function Eyebrow({ children }: EyebrowProps) {
  return <p className="mb-5 text-xs uppercase tracking-[0.24em] text-[var(--color-text-muted)]">{children}</p>;
}
