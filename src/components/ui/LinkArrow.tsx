import type { ReactNode } from "react";

type LinkArrowProps = {
  href: string;
  children: ReactNode;
};

export function LinkArrow({ href, children }: LinkArrowProps) {
  return (
    <a href={href} className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.14em] text-[var(--color-text)] hover:text-[var(--color-accent)]">
      <span>{children}</span>
      <span aria-hidden>→</span>
    </a>
  );
}
