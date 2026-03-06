export type PointerParallax = {
  x: number;
  y: number;
};

const PARALLAX_LIMIT = 0.46;

export function toPointerParallax(clientX: number, clientY: number, width: number, height: number): PointerParallax {
  if (width <= 0 || height <= 0) {
    return { x: 0, y: 0 };
  }

  const nx = (clientX / width) * 2 - 1;
  const ny = (clientY / height) * 2 - 1;

  return {
    x: softenParallax(nx),
    y: softenParallax(ny),
  };
}

function softenParallax(value: number) {
  const clamped = Math.max(-1, Math.min(1, value));
  const eased = Math.sign(clamped) * Math.pow(Math.abs(clamped), 1.35);
  return Math.max(-PARALLAX_LIMIT, Math.min(PARALLAX_LIMIT, eased));
}

export function damp(current: number, target: number, smoothing = 0.05) {
  return current + (target - current) * smoothing;
}
