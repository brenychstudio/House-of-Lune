"use client";

import { useMemo, useRef } from "react";
import { Color, Group, MathUtils } from "three";
import { useFrame } from "@react-three/fiber";

import type { HeroPhase } from "@/components/hero/HeroTimeline";
import { HeroProxyObject } from "@/components/hero/HeroProxyObject";
import { damp, type PointerParallax } from "@/lib/webgl/parallax";
import { getHeroStageTone } from "@/lib/webgl/heroStage";

type HeroSceneProps = {
  phase: HeroPhase;
  pointer: PointerParallax;
};

export function HeroScene({ phase, pointer }: HeroSceneProps) {
  const stageRef = useRef<Group>(null);
  const proxyRef = useRef<Group>(null);
  const tone = getHeroStageTone(phase);

  const background = useMemo(() => new Color("#03050b"), []);

  useFrame(({ scene, clock }) => {
    scene.background = background;

    const elapsed = clock.getElapsedTime();

    if (stageRef.current) {
      const targetX = pointer.y * 0.04;
      const targetY = pointer.x * 0.08;
      stageRef.current.rotation.x = damp(stageRef.current.rotation.x, targetX, 0.06);
      stageRef.current.rotation.y = damp(stageRef.current.rotation.y, targetY, 0.06);
    }

    if (proxyRef.current) {
      const idleY = Math.sin(elapsed * 0.4) * 0.04;
      proxyRef.current.position.y = MathUtils.lerp(proxyRef.current.position.y, idleY, 0.04);
      proxyRef.current.rotation.y += 0.0012;
    }
  });

  return (
    <group ref={stageRef}>
      <fog attach="fog" args={["#03050b", 6, 13]} />

      <ambientLight intensity={0.12 + tone.light * 0.18} color="#b5bfd1" />
      <directionalLight position={[2.8, 3.5, 2.4]} intensity={0.35 + tone.light * 0.52} color="#f4f1e9" />
      <pointLight position={[-1.6, 1.2, 2.8]} intensity={0.08 + tone.glint * 0.38} color="#fff2d6" />

      <mesh position={[0, -1.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[3.1, 48]} />
        <meshStandardMaterial color="#070b14" roughness={0.95} metalness={0.05} />
      </mesh>

      <group ref={proxyRef} scale={0.95 + tone.object * 0.08}>
        <HeroProxyObject intensity={tone.object} />
      </group>
    </group>
  );
}
