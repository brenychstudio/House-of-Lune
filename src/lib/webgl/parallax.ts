export type PointerParallax = {
  x: number;
  y: number;
};

export function toPointerParallax(clientX: number, clientY: number, width: number, height: number): PointerParallax {
  if (width <= 0 || height <= 0) {
    return { x: 0, y: 0 };
  }

  const nx = (clientX / width) * 2 - 1;
  const ny = (clientY / height) * 2 - 1;

  return {
    x: Math.max(-1, Math.min(1, nx)),
    y: Math.max(-1, Math.min(1, ny)),
  };
}

export function damp(current: number, target: number, smoothing = 0.05) {
  return current + (target - current) * smoothing;
}
