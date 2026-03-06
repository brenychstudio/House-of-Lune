"use client";

import { useEffect, useRef, useState } from "react";
import { Group } from "three";
import { useFrame } from "@react-three/fiber";

import type { HeroPhase } from "@/lib/webgl/heroTiming";
import { HERO_GLINT } from "@/lib/webgl/heroTiming";
import { damp } from "@/lib/webgl/parallax";

type GemGlintProps = {
  phase: HeroPhase;
  onStrength?: (value: number) => void;
};

export function GemGlint({ phase, onStrength }: GemGlintProps) {
  const [strength, setStrength] = useState(0);
  const startedAtRef = useRef<number | null>(null);
  const flareRef = useRef<Group>(null);

  useEffect(() => {
    if (phase === "glint") {
      startedAtRef.current = performance.now();
    }
  }, [phase]);

  useFrame(() => {
    if (startedAtRef.current === null) {
      setStrength((prev) => damp(prev, 0, 0.08));
      return;
    }

    const elapsed = performance.now() - startedAtRef.current;
    const { peakDelayMs, peakDurationMs, fadeMs } = HERO_GLINT;
    const peakEnd = peakDelayMs + peakDurationMs;
    const fadeEnd = peakEnd + fadeMs;

    let next = 0;

    if (elapsed <= peakDelayMs) {
      next = elapsed / peakDelayMs;
    } else if (elapsed <= peakEnd) {
      next = 1;
    } else if (elapsed <= fadeEnd) {
      next = 1 - (elapsed - peakEnd) / fadeMs;
    }

    if (elapsed > fadeEnd && phase !== "glint") {
      startedAtRef.current = null;
    }

    setStrength((prev) => damp(prev, next, 0.22));
  });

  useEffect(() => {
    onStrength?.(strength);
  }, [onStrength, strength]);

  return (
    <group ref={flareRef} position={[0.21, 0.18, 0.62]} scale={0.08 + strength * 0.22}>
      <mesh>
        <planeGeometry args={[0.45, 0.015]} />
        <meshBasicMaterial color="#f8edd8" transparent opacity={strength * 0.44} depthWrite={false} />
      </mesh>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <planeGeometry args={[0.18, 0.012]} />
        <meshBasicMaterial color="#dce7ff" transparent opacity={strength * 0.26} depthWrite={false} />
      </mesh>
    </group>
  );
}
