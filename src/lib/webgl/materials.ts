export function createHeroMetalMaterial(intensity: number) {
  return {
    color: "#8f846c",
    metalness: 0.86,
    roughness: Math.max(0.3, 0.5 - intensity * 0.16),
    envMapIntensity: 0.26 + intensity * 0.34,
  };
}

export function createHeroStoneMaterial(intensity: number) {
  return {
    color: "#b8c4d8",
    metalness: 0.05,
    roughness: Math.max(0.24, 0.5 - intensity * 0.16),
    ior: 1.28,
    reflectivity: 0.4,
    clearcoat: 0.3,
    clearcoatRoughness: 0.26,
    envMapIntensity: 0.24 + intensity * 0.24,
  };
}
