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
    const isFinalState = phase === "settle" || phase === "copy" || phase === "idle";

    if (stageRef.current) {
      const parallaxFactor = isFinalState ? 0.58 : 0.92;
      const targetX = pointer.y * 0.018 * parallaxFactor;
      const targetY = pointer.x * 0.038 * parallaxFactor;

      stageRef.current.rotation.x = damp(stageRef.current.rotation.x, targetX, 0.04);
      stageRef.current.rotation.y = damp(stageRef.current.rotation.y, targetY, 0.04);
    }

    if (proxyRef.current) {
      const floatY = Math.sin(elapsed * 0.34) * (isFinalState ? 0.01 : 0.016);
      const settleBase = 0.22;
      const spin = elapsed * (isFinalState ? 0.055 : 0.082);
      const wobble = Math.sin(elapsed * 0.22) * (isFinalState ? 0.03 : 0.05);

      const targetYRotation = settleBase + spin + wobble;
      const targetXRotation = 0.01 + Math.sin(elapsed * 0.18) * (isFinalState ? 0.012 : 0.02);

      proxyRef.current.position.y = MathUtils.lerp(proxyRef.current.position.y, floatY, isFinalState ? 0.022 : 0.03);
      proxyRef.current.rotation.x = damp(proxyRef.current.rotation.x, targetXRotation, 0.035);
      proxyRef.current.rotation.y = damp(proxyRef.current.rotation.y, targetYRotation, 0.022);
    }
  });

  return (
    <group ref={stageRef}>
      <fog attach="fog" args={["#02040a", 5.8, 12.4]} />
      <HeroLights phase={phase} glintBoost={glintBoost + tone.glint * 0.18} />

      <mesh position={[0, -1.02, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[3.1, 48]} />
        <meshStandardMaterial color="#05070f" roughness={0.98} metalness={0.02} />
      </mesh>

      <group ref={proxyRef} scale={0.94 + tone.object * 0.1}>
        <HeroProxyObject intensity={tone.object} contourStrength={tone.contour} />
        <GemGlint phase={phase} onStrength={setGlintBoost} />
      </group>
    </group>
  );
}