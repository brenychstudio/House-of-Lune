import type { ReactNode } from "react";

type SurfaceFrameProps = {
  children: ReactNode;
  className?: string;
};

export function SurfaceFrame({ children, className = "" }: SurfaceFrameProps) {
  return <div className={`surface-frame rounded-2xl p-8 ${className}`}>{children}</div>;
}
