import type { HeroPhase } from "@/components/hero/HeroTimeline";

type HeroFallbackProps = {
  phase: HeroPhase;
};

const phaseVisual = {
  prelude: {
    shellOpacity: "opacity-35",
    traceOpacity: "opacity-0",
    coreOpacity: "opacity-8",
    glintOpacity: "opacity-0",
  },
  trace: {
    shellOpacity: "opacity-45",
    traceOpacity: "opacity-40",
    coreOpacity: "opacity-12",
    glintOpacity: "opacity-0",
  },
  contour: {
    shellOpacity: "opacity-60",
    traceOpacity: "opacity-70",
    coreOpacity: "opacity-35",
    glintOpacity: "opacity-0",
  },
  emergence: {
    shellOpacity: "opacity-75",
    traceOpacity: "opacity-80",
    coreOpacity: "opacity-70",
    glintOpacity: "opacity-20",
  },
  glint: {
    shellOpacity: "opacity-85",
    traceOpacity: "opacity-85",
    coreOpacity: "opacity-75",
    glintOpacity: "opacity-85",
  },
  settle: {
    shellOpacity: "opacity-90",
    traceOpacity: "opacity-70",
    coreOpacity: "opacity-78",
    glintOpacity: "opacity-20",
  },
  copy: {
    shellOpacity: "opacity-95",
    traceOpacity: "opacity-62",
    coreOpacity: "opacity-80",
    glintOpacity: "opacity-8",
  },
  idle: {
    shellOpacity: "opacity-95",
    traceOpacity: "opacity-62",
    coreOpacity: "opacity-80",
    glintOpacity: "opacity-8",
  },
} as const;

export function HeroFallback({ phase }: HeroFallbackProps) {
  const visual = phaseVisual[phase];

  return (
    <div className="absolute inset-0 overflow-hidden rounded-[1.8rem]">
      <div className={`absolute inset-0 bg-[radial-gradient(circle_at_52%_34%,rgba(190,198,212,0.18),transparent_42%),radial-gradient(circle_at_48%_74%,rgba(207,191,157,0.1),transparent_46%)] transition-opacity duration-[1700ms] ease-[cubic-bezier(0.3,1,0.35,1)] ${visual.shellOpacity}`} />

      <div
        className={`absolute left-1/2 top-1/2 h-[56%] w-[44%] -translate-x-1/2 -translate-y-[52%] rounded-[52%] border border-[rgba(207,191,157,0.35)] bg-[radial-gradient(circle_at_42%_32%,rgba(255,255,255,0.2),rgba(255,255,255,0.02)_52%,rgba(2,3,8,0.84)_100%)] blur-[0.2px] transition-opacity duration-[1500ms] ease-[cubic-bezier(0.3,1,0.35,1)] ${visual.coreOpacity}`}
      />

      <div
        className={`absolute left-1/2 top-1/2 h-[64%] w-[48%] -translate-x-1/2 -translate-y-1/2 rounded-[49%] border border-[rgba(190,198,212,0.25)] transition-opacity duration-[1200ms] ease-[cubic-bezier(0.22,1,0.28,1)] ${visual.traceOpacity}`}
      />

      <div
        className={`absolute left-1/2 top-[39%] h-12 w-12 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,248,222,0.95),rgba(255,248,222,0.15)_48%,transparent_72%)] blur-[1.2px] transition-opacity duration-[680ms] ease-out ${visual.glintOpacity}`}
      />
    </div>
  );
}
