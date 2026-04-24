"use client";

import type { ReactNode } from "react";
import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import type { UseInViewOptions } from "motion/react";

type ImageDriftProps = {
  children: ReactNode;
  delay?: number;
  duration?: number;
  once?: boolean;
  margin?: UseInViewOptions["margin"];
  amount?: UseInViewOptions["amount"];
  className?: string;
};

export function ImageDrift({
  children,
  delay = 0,
  duration = 1.14,
  once = true,
  margin = "-6% 0px -12% 0px",
  amount = 0.24,
  className,
}: ImageDriftProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const reduceMotion = useReducedMotion();
  const isInView = useInView(ref, {
    once,
    margin,
    amount,
    initial: false,
  });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={false}
      animate={
        isInView
          ? {
              scale: 1,
              y: 0,
              opacity: 1,
            }
          : {
              scale: reduceMotion ? 1 : 1.015,
              y: reduceMotion ? 0 : 10,
              opacity: reduceMotion ? 1 : 0.96,
            }
      }
      transition={{
        duration: reduceMotion ? 0.3 : duration,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      style={{ willChange: "transform, opacity" }}
    >
      {children}
    </motion.div>
  );
}
