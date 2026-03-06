"use client";

import { useEffect, useState } from "react";

function detectWebGLSupport() {
  try {
    const canvas = document.createElement("canvas");

    return Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl") || canvas.getContext("experimental-webgl"));
  } catch {
    return false;
  }
}

export function useCanUseWebGL() {
  const [canUseWebGL, setCanUseWebGL] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setCanUseWebGL(detectWebGLSupport());
    });

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, []);

  return canUseWebGL;
}
