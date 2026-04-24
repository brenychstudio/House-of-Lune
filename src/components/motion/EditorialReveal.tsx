"use client";

import type { ReactNode } from "react";
import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import type { UseInViewOptions } from "motion/react";

type EditorialRevealVariant = "section" | "text" | "image" | "card";

type EditorialRevealProps = {
  children: ReactNode;
  variant?: EditorialRevealVariant;
  delay?: number;
  duration?: number;
  once?: boolean;
  margin?: UseInViewOptions["margin"];
  amount?: UseInViewOptions["amount"];
  className?: string;
};

const variantConfig: Record<
  EditorialRevealVariant,
  { y: number; blur: number; duration: number; amount: NonNullable<UseInViewOptions["amount"]> }
> = {
  section: { y: 26, blur: 3, duration: 1.08, amount: 0.18 },
  text: { y: 18, blur: 2, duration: 0.96, amount: 0.24 },
  image: { y: 22, blur: 2, duration: 1.12, amount: 0.18 },
  card: { y: 16, blur: 2, duration: 0.92, amount: 0.22 },
};

export function EditorialReveal({
  children,
  variant = "section",
  delay = 0,
  duration,
  once = true,
  margin = "-8% 0px -10% 0px",
  amount,
  className,
}: EditorialRevealProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const reduceMotion = useReducedMotion();
  const config = variantConfig[variant];

  const isInView = useInView(ref, {
    once,
    margin,
    amount: amount ?? config.amount,
    initial: false,
  });

  const hiddenY = reduceMotion ? 0 : config.y;
  const hiddenBlur = reduceMotion ? "blur(0px)" : `blur(${config.blur}px)`;

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={false}
      animate={
        isInView
          ? {
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
            }
          : {
              opacity: reduceMotion ? 1 : 0,
              y: hiddenY,
              filter: hiddenBlur,
            }
      }
      transition={{
        duration: reduceMotion ? 0.3 : duration ?? config.duration,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      style={{ willChange: "opacity, transform, filter" }}
    >
      {children}
    </motion.div>
  );
}
