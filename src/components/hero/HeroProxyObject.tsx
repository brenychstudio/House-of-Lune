"use client";

import { useMemo } from "react";

type HeroProxyObjectProps = {
  intensity: number;
  contourStrength: number;
};

export function HeroProxyObject({ intensity, contourStrength }: HeroProxyObjectProps) {
  const outerMetal = useMemo(
    () => ({
      color: "#9ca5b8",
      metalness: 0.96,
      roughness: Math.max(0.12, 0.28 - intensity * 0.05 - contourStrength * 0.04),
      envMapIntensity: 1.15 + contourStrength * 0.35,
      clearcoat: 1,
      clearcoatRoughness: 0.14,
      emissive: "#121a2b",
      emissiveIntensity: 0.045 + intensity * 0.02,
    }),
    [intensity, contourStrength],
  );

  const innerMetal = useMemo(
    () => ({
      color: "#667086",
      metalness: 0.82,
      roughness: Math.max(0.22, 0.38 - contourStrength * 0.08),
      envMapIntensity: 0.5 + contourStrength * 0.12,
      clearcoat: 0.9,
      clearcoatRoughness: 0.2,
      emissive: "#0c1423",
      emissiveIntensity: 0.022 + contourStrength * 0.012,
    }),
    [contourStrength],
  );

  const stone = useMemo(
    () => ({
      color: "#e6ebf4",
      metalness: 0,
      roughness: Math.max(0.06, 0.14 - intensity * 0.03),
      transmission: 0.14,
      thickness: 0.55,
      ior: 1.45,
      clearcoat: 1,
      clearcoatRoughness: 0.06,
      emissive: "#1b2847",
      emissiveIntensity: 0.025 + contourStrength * 0.016,
    }),
    [intensity, contourStrength],
  );

  const prong = useMemo(
    () => ({
      color: "#8a93a6",
      metalness: 0.9,
      roughness: 0.24,
      envMapIntensity: 0.9,
      clearcoat: 1,
      clearcoatRoughness: 0.16,
      emissive: "#101827",
      emissiveIntensity: 0.02,
    }),
    [],
  );

  return (
    <group rotation={[0.38, 0.3, 0.08]}>
      {/* main band */}
      <mesh castShadow receiveShadow>
        <torusGeometry args={[0.8, 0.082, 48, 180]} />
        <meshPhysicalMaterial {...outerMetal} />
      </mesh>

      {/* inner contour - lighter and thinner so it doesn't read like a black hole */}
      <mesh position={[0, 0.02, 0.02]} scale={[1, 0.86, 1]} castShadow receiveShadow>
        <torusGeometry args={[0.44, 0.028, 28, 120]} />
        <meshPhysicalMaterial {...innerMetal} />
      </mesh>

      {/* stone moved slightly upward to read more like a ring setting */}
      <mesh position={[0, 0.24, 0.05]} scale={[0.16, 0.22, 0.16]} castShadow receiveShadow>
        <octahedronGeometry args={[1, 0]} />
        <meshPhysicalMaterial {...stone} />
      </mesh>

      {/* subtle prongs to help readability */}
      <mesh position={[-0.05, 0.16, 0.045]} rotation={[0.18, 0.04, -0.34]} castShadow receiveShadow>
        <cylinderGeometry args={[0.012, 0.014, 0.18, 12]} />
        <meshPhysicalMaterial {...prong} />
      </mesh>

      <mesh position={[0.05, 0.16, 0.045]} rotation={[0.18, -0.04, 0.34]} castShadow receiveShadow>
        <cylinderGeometry args={[0.012, 0.014, 0.18, 12]} />
        <meshPhysicalMaterial {...prong} />
      </mesh>
    </group>
  );
}