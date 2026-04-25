import type { ReactNode } from "react";

type HeroStageFrameProps = {
  chamberLabel: string;
  chamberNote: string;
  children: ReactNode;
};

export function HeroStageFrame({
  chamberLabel,
  chamberNote,
  children,
}: HeroStageFrameProps) {
  return (
    <div className="hero-chamber-enter surface-frame relative min-h-[20rem] overflow-hidden rounded-3xl border border-[var(--color-line)] bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.01))] p-5 shadow-[0_34px_96px_rgba(0,0,0,0.5)] sm:min-h-[24rem] sm:p-6 lg:min-h-[32rem] lg:p-8">
      <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_52%_14%,rgba(255,255,255,0.06),transparent_36%),linear-gradient(180deg,rgba(2,3,8,0.18),rgba(2,3,8,0.42))]" />

      {/* Critical: HeroStage must fill the frame directly, not rely on h-full inside a min-height parent. */}
      <div className="absolute inset-x-0 top-0 bottom-[5.75rem] z-10 sm:bottom-[5.2rem] lg:inset-0">
        {children}
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30 border-t border-[rgba(184,194,210,0.1)] bg-[linear-gradient(180deg,rgba(2,4,10,0.18),rgba(2,4,10,0.9)_44%,rgba(2,4,10,0.96))] px-5 py-4 sm:px-6 sm:py-5 lg:px-8">
        <div className="grid gap-3 sm:grid-cols-[12rem_1fr] sm:items-start sm:gap-6">
          <p className="text-[0.58rem] uppercase leading-[1.55] tracking-[0.2em] text-[rgba(218,207,181,0.76)] sm:whitespace-nowrap">
            {chamberLabel}
          </p>

          <p className="max-w-[25rem] text-[0.56rem] uppercase leading-[1.7] tracking-[0.13em] text-[rgba(226,230,238,0.54)]">
            {chamberNote}
          </p>
        </div>
      </div>
    </div>
  );
}
