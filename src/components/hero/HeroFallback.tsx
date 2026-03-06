import Image from "next/image";

import type { HeroPhase } from "@/components/hero/HeroTimeline";
import { assets } from "@/content/assets";

type HeroFallbackProps = {
  phase: HeroPhase;
};

const phaseVisual = {
  prelude: {
    chamberOpacity: "opacity-35",
    posterOpacity: "opacity-46",
    traceOpacity: "opacity-0",
    glintOpacity: "opacity-0",
  },
  trace: {
    chamberOpacity: "opacity-50",
    posterOpacity: "opacity-54",
    traceOpacity: "opacity-30",
    glintOpacity: "opacity-0",
  },
  contour: {
    chamberOpacity: "opacity-64",
    posterOpacity: "opacity-68",
    traceOpacity: "opacity-56",
    glintOpacity: "opacity-0",
  },
  emergence: {
    chamberOpacity: "opacity-76",
    posterOpacity: "opacity-78",
    traceOpacity: "opacity-70",
    glintOpacity: "opacity-18",
  },
  glint: {
    chamberOpacity: "opacity-84",
    posterOpacity: "opacity-86",
    traceOpacity: "opacity-80",
    glintOpacity: "opacity-74",
  },
  settle: {
    chamberOpacity: "opacity-90",
    posterOpacity: "opacity-88",
    traceOpacity: "opacity-70",
    glintOpacity: "opacity-20",
  },
  copy: {
    chamberOpacity: "opacity-92",
    posterOpacity: "opacity-90",
    traceOpacity: "opacity-66",
    glintOpacity: "opacity-8",
  },
  idle: {
    chamberOpacity: "opacity-92",
    posterOpacity: "opacity-90",
    traceOpacity: "opacity-66",
    glintOpacity: "opacity-8",
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

      <div className="absolute inset-[10%_11%_14%] overflow-hidden rounded-[2rem] border border-[rgba(190,198,212,0.2)]/80 bg-[rgba(2,4,10,0.35)]">
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
          className="object-cover object-center opacity-18 mix-blend-screen"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_48%_35%,rgba(230,236,248,0.16),transparent_42%),linear-gradient(180deg,rgba(2,3,8,0.1),rgba(2,3,8,0.65))]" />
      </div>

      <div
        className={`absolute left-1/2 top-1/2 h-[64%] w-[48%] -translate-x-1/2 -translate-y-1/2 rounded-[49%] border border-[rgba(190,198,212,0.22)] transition-opacity duration-[1200ms] ease-[cubic-bezier(0.22,1,0.28,1)] ${visual.traceOpacity}`}
      />

      <div
        className={`absolute left-1/2 top-[40%] h-10 w-10 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,248,222,0.92),rgba(255,248,222,0.14)_48%,transparent_72%)] blur-[1.2px] transition-opacity duration-[680ms] ease-out ${visual.glintOpacity}`}
      />
    </div>
  );
}
