"use client";

import { MeshTransmissionMaterial } from "@react-three/drei";

type HeroProxyObjectProps = {
  intensity: number;
};

export function HeroProxyObject({ intensity }: HeroProxyObjectProps) {
  return (
    <group rotation={[0.35, 0.42, 0.1]}>
      <mesh>
        <torusGeometry args={[0.92, 0.12, 64, 180]} />
        <meshStandardMaterial
          color="#c2b28f"
          metalness={0.88}
          roughness={0.25}
          envMapIntensity={0.55 + intensity * 0.75}
        />
      </mesh>

      <mesh position={[0, 0.02, 0.03]}>
        <cylinderGeometry args={[0.19, 0.19, 0.18, 44]} />
        <MeshTransmissionMaterial
          transmission={0.9}
          thickness={0.24}
          roughness={0.15}
          chromaticAberration={0.01}
          ior={1.35}
          color="#e5edf8"
          attenuationColor="#8ca1c8"
          attenuationDistance={1.2}
        />
      </mesh>
    </group>
  );
}
