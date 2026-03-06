"use client";

import { useRef } from "react";
import { Group, PointLight, SpotLight } from "three";
import { useFrame } from "@react-three/fiber";

import type { HeroPhase } from "@/lib/webgl/heroTiming";
import { damp } from "@/lib/webgl/parallax";
import { getHeroStageTone } from "@/lib/webgl/heroStage";

type HeroLightsProps = {
  phase: HeroPhase;
  glintBoost: number;
};

export function HeroLights({ phase, glintBoost }: HeroLightsProps) {
  const rimRef = useRef<SpotLight>(null);
  const fillRef = useRef<SpotLight>(null);
  const accentRef = useRef<PointLight>(null);
  const floorRef = useRef<SpotLight>(null);
  const groupRef = useRef<Group>(null);

  useFrame(({ clock }) => {
    const tone = getHeroStageTone(phase);
    const breath = phase === "idle" ? Math.sin(clock.getElapsedTime() * 0.18) * 0.01 : 0;
    const isFinalState = phase === "settle" || phase === "copy" || phase === "idle";

    if (groupRef.current) {
      groupRef.current.position.y = breath * 0.2;
    }

    if (rimRef.current) {
      const rimFloor = isFinalState ? 0.19 : 0.16;
      rimRef.current.intensity = damp(rimRef.current.intensity, rimFloor + tone.rim * 0.55, 0.06);
    }

    if (fillRef.current) {
      const fillFloor = isFinalState ? 0.065 : 0.05;
      fillRef.current.intensity = damp(fillRef.current.intensity, fillFloor + tone.fill * 0.35 + breath, 0.05);
    }

    if (accentRef.current) {
      const accentTarget = 0.03 + tone.accent * 0.24 + glintBoost * 0.28;
      accentRef.current.intensity = damp(accentRef.current.intensity, accentTarget, 0.15);
    }

    if (floorRef.current) {
      const floorFloor = isFinalState ? 0.06 : 0.05;
      floorRef.current.intensity = damp(floorRef.current.intensity, floorFloor + tone.floor * 0.13, 0.05);
    }
  });

  const tone = getHeroStageTone(phase);

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.045 + tone.ambient * 0.18} color="#9ea8bb" />

      <spotLight
        ref={rimRef}
        position={[2.3, 1.6, 2.6]}
        angle={0.3}
        penumbra={0.92}
        distance={9}
        color="#e9e2d2"
      />

      <spotLight
        ref={fillRef}
        position={[-1.4, 1.1, 2.3]}
        angle={0.44}
        penumbra={1}
        distance={8}
        color="#a8b6cc"
      />

      <pointLight ref={accentRef} position={[0.24, 0.26, 1.28]} distance={2.6} decay={2} color="#f7edd5" />

      <spotLight
        ref={floorRef}
        position={[0, -0.85, 0.5]}
        angle={0.65}
        penumbra={1}
        distance={5.6}
        color="#6f7f96"
      />
    </group>
  );
}
