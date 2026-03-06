import type { ReactNode } from "react";

type ButtonProps = {
  children: ReactNode;
  href?: string;
  variant?: "solid" | "outline";
  size?: "sm" | "md";
};

export function Button({ children, href = "#", variant = "solid", size = "md" }: ButtonProps) {
  const base = "inline-flex items-center justify-center rounded-full border transition-colors";
  const sizeClass = size === "sm" ? "h-10 px-4 text-xs tracking-[0.12em]" : "h-11 px-6 text-xs tracking-[0.14em]";
  const variantClass =
    variant === "outline"
      ? "border-[var(--color-line)] text-[var(--color-text)] hover:border-[var(--color-text-muted)]"
      : "border-[var(--color-accent)] bg-[var(--color-accent)] text-black hover:bg-[#e2d8be]";

  return (
    <a href={href} className={`${base} ${sizeClass} ${variantClass} uppercase`}>
      {children}
    </a>
  );
}
