"use client";

import type { ReactNode } from "react";
import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import type { UseInViewOptions } from "motion/react";

type FadeInViewProps = {
  children: ReactNode;
  delay?: number;
  duration?: number;
  y?: number;
  blur?: number;
  once?: boolean;
  margin?: UseInViewOptions["margin"];
  amount?: UseInViewOptions["amount"];
  className?: string;
};

export default function FadeInView({
  children,
  delay = 0,
  duration = 1.02,
  y = 22,
  blur = 4,
  once = true,
  margin = "-8% 0px -12% 0px",
  amount = 0.2,
  className,
}: FadeInViewProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(ref, { once, margin, amount, initial: false });
  const reduceMotion = useReducedMotion();

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
              opacity: 0,
              y: reduceMotion ? 0 : y,
              filter: reduceMotion ? "blur(0px)" : `blur(${blur}px)`,
            }
      }
      transition={{
        duration: reduceMotion ? 0.3 : duration,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      style={{ willChange: "opacity, transform, filter" }}
    >
      {children}
    </motion.div>
  );
}
