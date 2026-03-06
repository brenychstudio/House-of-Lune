import type { ReactNode } from "react";

type LinkArrowProps = {
  href: string;
  children: ReactNode;
};

export function LinkArrow({ href, children }: LinkArrowProps) {
  return (
    <a
      href={href}
      className="inline-flex items-center gap-2 text-[0.7rem] uppercase tracking-[0.16em] text-[var(--color-text)] transition-all duration-300 hover:gap-3 hover:text-[var(--color-accent)]"
    >
      <span>{children}</span>
      <span aria-hidden>→</span>
    </a>
  );
}
