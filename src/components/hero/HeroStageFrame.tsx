import type { ReactNode } from "react";

type HeroStageFrameProps = {
  chamberLabel: string;
  chamberNote: string;
  children: ReactNode;
};

export function HeroStageFrame({ chamberLabel, chamberNote, children }: HeroStageFrameProps) {
  return (
    <div className="surface-frame relative min-h-[26rem] overflow-hidden rounded-3xl border border-[var(--color-line)] bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.01))] p-7 shadow-[0_30px_90px_rgba(0,0,0,0.45)] lg:min-h-[32rem] lg:p-8">
      <div className="absolute inset-[8%] rounded-[2rem] border border-[rgba(190,198,212,0.22)]/80" />
      <div className="absolute inset-[16%_16%_20%] rounded-[2.4rem] border border-[rgba(207,191,157,0.18)]/80" />
      <div className="relative h-full">{children}</div>
      <div className="pointer-events-none absolute inset-x-7 bottom-7 z-20 flex items-end justify-between gap-6 text-[0.68rem] uppercase tracking-[0.18em] text-[var(--color-text-muted)] lg:inset-x-8 lg:bottom-8">
        <p>{chamberLabel}</p>
        <p className="max-w-[18rem] text-right text-[0.62rem] tracking-[0.14em] text-[var(--color-text-muted)]/90">{chamberNote}</p>
      </div>
    </div>
  );
}
