"use client";

import { useState } from "react";

import { HeroFallback } from "@/components/hero/HeroFallback";
import type { HeroPhase } from "@/components/hero/HeroTimeline";
import { toPointerParallax } from "@/lib/webgl/parallax";
import { useCanUseWebGL } from "@/lib/webgl/useCanUseWebGL";
import { useReducedMotion3D } from "@/lib/webgl/useReducedMotion3D";

type HeroStageProps = {
  phase: HeroPhase;
};

export function HeroStage({ phase }: HeroStageProps) {
  const [pointer, setPointer] = useState({ x: 0, y: 0 });

  const prefersReducedMotion = useReducedMotion3D();
  const canUseWebGL = useCanUseWebGL();

  const animated = canUseWebGL && !prefersReducedMotion;

  return (
    <div
      className="absolute inset-0"
      onPointerMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();

        setPointer(
          toPointerParallax(
            event.clientX - rect.left,
            event.clientY - rect.top,
            rect.width,
            rect.height,
          ),
        );
      }}
      onPointerLeave={() => setPointer({ x: 0, y: 0 })}
    >
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          src="/media/home/backgrounds/hol-dark-atmospheric-background-16x9-01.png"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover opacity-78"
          draggable={false}
        />

        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(2,3,8,0.16),rgba(2,3,8,0.56))]" />

        {!animated ? (
          <div className="pointer-events-none absolute inset-0 opacity-34 mix-blend-screen">
            <HeroFallback phase={phase} liveActive={false} />
          </div>
        ) : null}
      </div>

      <div className="hero-object-window-enter pointer-events-none absolute inset-[12%_12%_28%] z-10 overflow-hidden rounded-[2rem] border border-[rgba(176,186,202,0.075)] bg-[#02040a]/24">
        <img
          src="/media/pieces/hero-ring/hero/hol-hero-ring-signature-poster-16x9-01.png"
          alt=""
          aria-hidden="true"
          draggable={false}
          className="hero-object-plate absolute inset-0 z-10 h-full w-full object-cover"
          style={{
            transform: `translate3d(${pointer.x * 4}px, ${pointer.y * 2}px, 0) scale(1.035)`,
          }}
        />

        <div className="hero-stage-depth pointer-events-none absolute inset-0 z-20" />
        <div className="hero-stage-sweep pointer-events-none absolute inset-0 z-30" />
        <div className="hero-stage-glint pointer-events-none absolute inset-0 z-40" />

        <div className="pointer-events-none absolute inset-0 z-50 bg-[radial-gradient(circle_at_50%_46%,transparent_0%,rgba(2,3,8,0.04)_38%,rgba(2,3,8,0.32)_100%)]" />
      </div>
    </div>
  );
}
