"use client";

import { useState } from "react";

import { HeroFallback } from "@/components/hero/HeroFallback";
import { HeroScene } from "@/components/hero/HeroScene";
import type { HeroPhase } from "@/components/hero/HeroTimeline";
import { SceneCanvas } from "@/components/r3f/SceneCanvas";
import { toPointerParallax } from "@/lib/webgl/parallax";
import { useCanUseWebGL } from "@/lib/webgl/useCanUseWebGL";
import { useReducedMotion3D } from "@/lib/webgl/useReducedMotion3D";

type HeroStageProps = {
  phase: HeroPhase;
};

export function HeroStage({ phase }: HeroStageProps) {
  const [isSceneReady, setIsSceneReady] = useState(false);
  const [pointer, setPointer] = useState({ x: 0, y: 0 });

  const prefersReducedMotion = useReducedMotion3D();
  const canUseWebGL = useCanUseWebGL();

  const showCanvas = canUseWebGL && !prefersReducedMotion;

  return (
    <div
      className="absolute inset-0"
      onPointerMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        setPointer(toPointerParallax(event.clientX - rect.left, event.clientY - rect.top, rect.width, rect.height));
      }}
      onPointerLeave={() => setPointer({ x: 0, y: 0 })}
    >
      <div className="absolute inset-0 z-0">
        <HeroFallback phase={phase} />
      </div>

      {showCanvas ? (
        <div
          className={`absolute inset-[10%_11%_14%] z-10 overflow-hidden rounded-[2rem] border border-[rgba(190,198,212,0.18)]/70 transition-opacity duration-[1200ms] ease-[cubic-bezier(0.22,1,0.28,1)] ${isSceneReady ? "opacity-94" : "opacity-0"}`}
        >
          <SceneCanvas onReady={() => setIsSceneReady(true)}>
            <HeroScene phase={phase} pointer={pointer} />
          </SceneCanvas>
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(5,7,12,0.04),rgba(2,3,8,0.38))]" />
        </div>
      ) : null}
    </div>
  );
}
