"use client";

import { useMemo, useRef, useState } from "react";
import { Color, Group, MathUtils } from "three";
import { useFrame } from "@react-three/fiber";

import { GemGlint } from "@/components/hero/GemGlint";
import { HeroLights } from "@/components/hero/HeroLights";
import { HeroProxyObject } from "@/components/hero/HeroProxyObject";
import type { HeroPhase } from "@/lib/webgl/heroTiming";
import { damp, type PointerParallax } from "@/lib/webgl/parallax";
import { getHeroStageTone } from "@/lib/webgl/heroStage";

type HeroSceneProps = {
  phase: HeroPhase;
  pointer: PointerParallax;
};

export function HeroScene({ phase, pointer }: HeroSceneProps) {
  const stageRef = useRef<Group>(null);
  const proxyRef = useRef<Group>(null);
  const [glintBoost, setGlintBoost] = useState(0);
  const tone = getHeroStageTone(phase);

  const background = useMemo(() => new Color("#02040a"), []);

  useFrame(({ scene, clock }) => {
    scene.background = background;

    const elapsed = clock.getElapsedTime();

    if (stageRef.current) {
      const targetX = pointer.y * 0.02;
      const targetY = pointer.x * 0.045;
      stageRef.current.rotation.x = damp(stageRef.current.rotation.x, targetX, 0.04);
      stageRef.current.rotation.y = damp(stageRef.current.rotation.y, targetY, 0.04);
    }

    if (proxyRef.current) {
      const idleY = Math.sin(elapsed * 0.24) * 0.015;
      proxyRef.current.position.y = MathUtils.lerp(proxyRef.current.position.y, idleY, 0.03);
      proxyRef.current.rotation.y += 0.00045;
    }
  });

  return (
    <group ref={stageRef}>
      <fog attach="fog" args={["#02040a", 5.8, 12.4]} />
      <HeroLights phase={phase} glintBoost={glintBoost + tone.glint * 0.2} />

      <mesh position={[0, -1.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[3.1, 48]} />
        <meshStandardMaterial color="#05070f" roughness={0.98} metalness={0.02} />
      </mesh>

      <group ref={proxyRef} scale={0.92 + tone.object * 0.1}>
        <HeroProxyObject intensity={tone.object} contourStrength={tone.contour} />
        <GemGlint phase={phase} onStrength={setGlintBoost} />
      </group>
    </group>
  );
}
