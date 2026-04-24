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
      const rimFloor = isFinalState ? 0.34 : 0.2;
      rimRef.current.intensity = damp(rimRef.current.intensity, rimFloor + tone.rim * 0.62, 0.06);
    }

    if (fillRef.current) {
      const fillFloor = isFinalState ? 0.17 : 0.08;
      fillRef.current.intensity = damp(fillRef.current.intensity, fillFloor + tone.fill * 0.46 + breath, 0.05);
    }

    if (accentRef.current) {
      const accentTarget = 0.05 + tone.accent * 0.24 + glintBoost * 0.22;
      accentRef.current.intensity = damp(accentRef.current.intensity, accentTarget, 0.14);
    }

    if (floorRef.current) {
      const floorFloor = isFinalState ? 0.13 : 0.08;
      floorRef.current.intensity = damp(floorRef.current.intensity, floorFloor + tone.floor * 0.18, 0.05);
    }
  });

  const tone = getHeroStageTone(phase);

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.09 + tone.ambient * 0.28} color="#b7c0cf" />

      <spotLight
        ref={rimRef}
        position={[2.2, 1.55, 2.45]}
        angle={0.34}
        penumbra={0.92}
        distance={9}
        color="#efe6d6"
      />

      <spotLight
        ref={fillRef}
        position={[-1.45, 1.14, 2.18]}
        angle={0.48}
        penumbra={1}
        distance={8}
        color="#aebbd0"
      />

      <pointLight
        ref={accentRef}
        position={[0.22, 0.28, 1.26]}
        distance={2.8}
        decay={2}
        color="#f7edd9"
      />

      <spotLight
        ref={floorRef}
        position={[0, -0.76, 0.62]}
        angle={0.68}
        penumbra={1}
        distance={6}
        color="#7688a2"
      />
    </group>
  );
}