"use client";

import { useMemo } from "react";

import { createHeroMetalMaterial, createHeroStoneMaterial } from "@/lib/webgl/materials";

type HeroProxyObjectProps = {
  intensity: number;
  contourStrength: number;
};

export function HeroProxyObject({ intensity, contourStrength }: HeroProxyObjectProps) {
  const metal = useMemo(() => createHeroMetalMaterial(intensity), [intensity]);
  const stone = useMemo(() => createHeroStoneMaterial(intensity), [intensity]);

  return (
    <group rotation={[0.34, 0.32, 0.08]}>
      <mesh>
        <torusGeometry args={[0.8, 0.09, 48, 180]} />
        <meshStandardMaterial {...metal} />
      </mesh>

      <mesh position={[0, 0.01, 0.02]} scale={[1, 0.82, 1]}>
        <torusGeometry args={[0.42, 0.045, 32, 128]} />
        <meshStandardMaterial
          color="#3b4354"
          metalness={0.36}
          roughness={Math.max(0.32, 0.54 - contourStrength * 0.16)}
          envMapIntensity={0.28 + contourStrength * 0.16}
        />
      </mesh>

      <mesh position={[0, 0.03, 0.02]} scale={[0.18, 0.24, 0.18]}>
        <octahedronGeometry args={[1, 0]} />
        <meshPhysicalMaterial {...stone} />
      </mesh>
    </group>
  );
}
