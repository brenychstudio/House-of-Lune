import Image from "next/image";

import type { HeroPhase } from "@/components/hero/HeroTimeline";
import { assets } from "@/content/assets";

type HeroFallbackProps = {
  phase: HeroPhase;
};

const phaseVisual = {
  prelude: {
    chamberOpacity: "opacity-32",
    posterOpacity: "opacity-42",
    traceOpacity: "opacity-0",
    glintOpacity: "opacity-0",
  },
  trace: {
    chamberOpacity: "opacity-44",
    posterOpacity: "opacity-50",
    traceOpacity: "opacity-24",
    glintOpacity: "opacity-0",
  },
  contour: {
    chamberOpacity: "opacity-56",
    posterOpacity: "opacity-62",
    traceOpacity: "opacity-44",
    glintOpacity: "opacity-0",
  },
  emergence: {
    chamberOpacity: "opacity-68",
    posterOpacity: "opacity-74",
    traceOpacity: "opacity-58",
    glintOpacity: "opacity-10",
  },
  glint: {
    chamberOpacity: "opacity-76",
    posterOpacity: "opacity-82",
    traceOpacity: "opacity-64",
    glintOpacity: "opacity-58",
  },
  settle: {
    chamberOpacity: "opacity-82",
    posterOpacity: "opacity-84",
    traceOpacity: "opacity-58",
    glintOpacity: "opacity-14",
  },
  copy: {
    chamberOpacity: "opacity-84",
    posterOpacity: "opacity-84",
    traceOpacity: "opacity-52",
    glintOpacity: "opacity-6",
  },
  idle: {
    chamberOpacity: "opacity-84",
    posterOpacity: "opacity-84",
    traceOpacity: "opacity-52",
    glintOpacity: "opacity-6",
  },
} as const;

export function HeroFallback({ phase }: HeroFallbackProps) {
  const visual = phaseVisual[phase];

  return (
    <div className="absolute inset-0 overflow-hidden rounded-[1.8rem]">
      <Image
        src={assets.home.hero.atmosphericBackground}
        alt=""
        fill
        priority
        sizes="(min-width: 1024px) 42vw, 100vw"
        className={`object-cover object-center transition-opacity duration-[1700ms] ease-[cubic-bezier(0.3,1,0.35,1)] ${visual.chamberOpacity}`}
      />

      <div className="absolute inset-[10%_11%_14%] overflow-hidden rounded-[2rem] border border-[rgba(190,198,212,0.16)]/80 bg-[rgba(2,4,10,0.45)]">
        <Image
          src={assets.home.hero.poster}
          alt="Hero ring signature composition"
          fill
          priority
          sizes="(min-width: 1024px) 32vw, 72vw"
          className={`object-cover object-center transition-opacity duration-[1600ms] ease-[cubic-bezier(0.3,1,0.35,1)] ${visual.posterOpacity}`}
        />
        <Image
          src={assets.home.hero.teaserStill}
          alt=""
          fill
          sizes="(min-width: 1024px) 32vw, 72vw"
          className="object-cover object-center opacity-14 mix-blend-screen"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_48%_35%,rgba(230,236,248,0.12),transparent_40%),linear-gradient(180deg,rgba(2,3,8,0.2),rgba(2,3,8,0.7))]" />
      </div>

      <div
        className={`absolute left-1/2 top-1/2 h-[62%] w-[45%] -translate-x-1/2 -translate-y-1/2 rounded-[49%] border border-[rgba(190,198,212,0.16)] transition-opacity duration-[1200ms] ease-[cubic-bezier(0.22,1,0.28,1)] ${visual.traceOpacity}`}
      />

      <div
        className={`absolute left-[56%] top-[38%] h-8 w-16 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,248,222,0.82),rgba(255,248,222,0.08)_58%,transparent_80%)] blur-[0.9px] transition-opacity duration-[680ms] ease-out ${visual.glintOpacity}`}
      />
    </div>
  );
}
