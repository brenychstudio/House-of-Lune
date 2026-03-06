"use client";

import type { ReactNode } from "react";
import { Canvas } from "@react-three/fiber";

type SceneCanvasProps = {
  children: ReactNode;
  onReady?: () => void;
};

export function SceneCanvas({ children, onReady }: SceneCanvasProps) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 0.25, 4], fov: 38, near: 0.1, far: 100 }}
      onCreated={() => onReady?.()}
      className="h-full w-full"
    >
      {children}
    </Canvas>
  );
}
