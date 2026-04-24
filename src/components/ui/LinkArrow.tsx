import type { ReactNode } from "react";

import { TransitionLink } from "@/components/motion/TransitionLink";

type LinkArrowProps = {
  href: string;
  children: ReactNode;
};

export function LinkArrow({ href, children }: LinkArrowProps) {
  return (
    <TransitionLink
      href={href}
      className="luxury-line-link inline-flex items-center gap-2 pb-1 text-[0.7rem] uppercase tracking-[0.16em] text-[var(--color-text)]"
    >
      <span>{children}</span>
      <span aria-hidden>{"\u2192"}</span>
    </TransitionLink>
  );
}
