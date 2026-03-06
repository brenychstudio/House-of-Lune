export function createHeroMetalMaterial(intensity: number) {
  return {
    color: "#8f846c",
    metalness: 0.86,
    roughness: Math.max(0.28, 0.48 - intensity * 0.2),
    envMapIntensity: 0.22 + intensity * 0.4,
  };
}

export function createHeroStoneMaterial(intensity: number) {
  return {
    color: "#b8c4d8",
    metalness: 0.05,
    roughness: Math.max(0.22, 0.48 - intensity * 0.18),
    ior: 1.28,
    reflectivity: 0.4,
    clearcoat: 0.28,
    clearcoatRoughness: 0.26,
    envMapIntensity: 0.2 + intensity * 0.28,
  };
}
