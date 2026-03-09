import type { ReactNode } from "react";
import Link from "next/link";

type ButtonProps = {
  children: ReactNode;
  href?: string;
  variant?: "solid" | "outline";
  size?: "sm" | "md";
};

export function Button({ children, href = "#", variant = "solid", size = "md" }: ButtonProps) {
  const base = "inline-flex items-center justify-center rounded-full border transition-all duration-300";
  const sizeClass = size === "sm" ? "h-10 px-4 text-[0.65rem] tracking-[0.13em]" : "h-11 px-6 text-[0.67rem] tracking-[0.15em]";
  const variantClass =
    variant === "outline"
      ? "border-[var(--color-line)] bg-[rgba(255,255,255,0.01)] text-[var(--color-text)] hover:border-[var(--color-accent-cool)] hover:bg-[rgba(255,255,255,0.04)]"
      : "border-[var(--color-accent)] bg-[var(--color-accent)] text-black hover:border-[#d8ccae] hover:bg-[#d8ccae]";

  return (
    <Link href={href} className={`${base} ${sizeClass} ${variantClass} uppercase`}>
      {children}
    </Link>
  );
}
