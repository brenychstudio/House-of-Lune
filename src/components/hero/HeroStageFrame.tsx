import type { ReactNode } from "react";

type HeroStageFrameProps = {
  chamberLabel: string;
  chamberNote: string;
  children: ReactNode;
};

export function HeroStageFrame({ chamberLabel, chamberNote, children }: HeroStageFrameProps) {
  return (
    <div className="surface-frame relative min-h-[20rem] overflow-hidden rounded-3xl border border-[var(--color-line)] bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.01))] p-5 shadow-[0_34px_96px_rgba(0,0,0,0.5)] sm:min-h-[24rem] sm:p-6 lg:min-h-[32rem] lg:p-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_52%_14%,rgba(255,255,255,0.06),transparent_36%),linear-gradient(180deg,rgba(2,3,8,0.26),rgba(2,3,8,0.62))]" />
      <div className="absolute inset-[8%] rounded-[2rem] border border-[rgba(184,194,210,0.18)]/80" />
      <div className="absolute inset-[18%_13%_22%] rounded-[2rem] border border-[rgba(202,188,156,0.14)]/80 sm:inset-[16%_16%_20%] sm:rounded-[2.4rem]" />
      <div className="relative h-full">{children}</div>
      <div className="pointer-events-none absolute inset-x-5 bottom-5 z-20 flex flex-col items-start gap-2 text-[0.62rem] uppercase tracking-[0.16em] text-[var(--color-text-muted)] sm:inset-x-6 sm:bottom-6 sm:flex-row sm:items-end sm:justify-between sm:gap-6 sm:text-[0.68rem] sm:tracking-[0.18em] lg:inset-x-8 lg:bottom-8">
        <p>{chamberLabel}</p>
        <p className="max-w-[20rem] text-left text-[0.6rem] tracking-[0.13em] text-[var(--color-text-muted)]/90 sm:text-right sm:text-[0.62rem] sm:tracking-[0.14em]">{chamberNote}</p>
      </div>
    </div>
  );
}
