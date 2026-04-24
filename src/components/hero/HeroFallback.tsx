import Image from "next/image";

import type { HeroPhase } from "@/components/hero/HeroTimeline";
import { assets } from "@/content/assets";

type HeroFallbackProps = {
  phase: HeroPhase;
  liveActive?: boolean;
};

const phaseVisual = {
  prelude: {
    chamberOpacity: "opacity-50",
    posterOpacity: "opacity-60",
    traceOpacity: "opacity-0",
    glintOpacity: "opacity-0",
  },
  trace: {
    chamberOpacity: "opacity-60",
    posterOpacity: "opacity-70",
    traceOpacity: "opacity-20",
    glintOpacity: "opacity-0",
  },
  contour: {
    chamberOpacity: "opacity-70",
    posterOpacity: "opacity-80",
    traceOpacity: "opacity-40",
    glintOpacity: "opacity-0",
  },
  emergence: {
    chamberOpacity: "opacity-80",
    posterOpacity: "opacity-90",
    traceOpacity: "opacity-50",
    glintOpacity: "opacity-20",
  },
  glint: {
    chamberOpacity: "opacity-80",
    posterOpacity: "opacity-95",
    traceOpacity: "opacity-60",
    glintOpacity: "opacity-60",
  },
  settle: {
    chamberOpacity: "opacity-80",
    posterOpacity: "opacity-100",
    traceOpacity: "opacity-50",
    glintOpacity: "opacity-20",
  },
  copy: {
    chamberOpacity: "opacity-80",
    posterOpacity: "opacity-100",
    traceOpacity: "opacity-40",
    glintOpacity: "opacity-10",
  },
  idle: {
    chamberOpacity: "opacity-80",
    posterOpacity: "opacity-100",
    traceOpacity: "opacity-40",
    glintOpacity: "opacity-10",
  },
} as const;

export function HeroFallback({ phase, liveActive = false }: HeroFallbackProps) {
  const visual = phaseVisual[phase];

  const chamberOpacity = liveActive ? "opacity-50" : visual.chamberOpacity;
  const posterOpacity = liveActive ? "opacity-80" : visual.posterOpacity;
  const traceOpacity = liveActive ? "opacity-20" : visual.traceOpacity;

  return (
    <div className="absolute inset-0 overflow-hidden rounded-[1.8rem]">
      <Image
        src={assets.home.hero.atmosphericBackground}
        alt=""
        fill
        priority
        sizes="(min-width: 1024px) 42vw, 100vw"
        className={`object-cover object-center transition-opacity duration-[1500ms] ease-[cubic-bezier(0.3,1,0.35,1)] ${chamberOpacity}`}
      />

      <div className="absolute inset-[10%_11%_14%] overflow-hidden rounded-[2rem] border border-[rgba(190,198,212,0.16)] bg-[rgba(2,4,10,0.18)]">
        <Image
          src={assets.home.hero.poster}
          alt="Hero ring signature composition"
          fill
          priority
          sizes="(min-width: 1024px) 32vw, 72vw"
          className={`object-cover object-center transition-opacity duration-[1500ms] ease-[cubic-bezier(0.3,1,0.35,1)] ${posterOpacity}`}
        />

        <Image
          src={assets.home.hero.teaserStill}
          alt=""
          fill
          sizes="(min-width: 1024px) 32vw, 72vw"
          className="object-cover object-center opacity-10 mix-blend-screen"
        />

        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_52%_40%,rgba(230,236,248,0.12),transparent_38%)]" />
      </div>

      <div
        className={`absolute left-1/2 top-1/2 h-[62%] w-[45%] -translate-x-1/2 -translate-y-1/2 rounded-[49%] border border-[rgba(190,198,212,0.16)] transition-opacity duration-[1200ms] ease-[cubic-bezier(0.22,1,0.28,1)] ${traceOpacity}`}
      />

      <div
        className={`absolute left-[56%] top-[38%] h-8 w-16 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,248,222,0.82),rgba(255,248,222,0.08)_58%,transparent_80%)] blur-[0.9px] transition-opacity duration-[680ms] ease-out ${visual.glintOpacity}`}
      />
    </div>
  );
}
