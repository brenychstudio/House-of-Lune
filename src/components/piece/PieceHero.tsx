import Image from "next/image";

import { ImageDrift } from "@/components/motion/ImageDrift";
import type { Piece } from "@/types/piece";

export function PieceHero({ piece }: { piece: Piece }) {
  return (
    <section className="mx-auto grid max-w-6xl gap-7 px-5 pb-8 pt-14 sm:px-6 sm:pb-10 sm:pt-16 lg:grid-cols-[1.32fr_0.68fr] lg:items-end lg:gap-10 lg:px-10 lg:pt-20">
      <ImageDrift className="min-w-0">
        <figure className="luxury-frame relative min-h-[20rem] overflow-hidden rounded-[1.6rem] border border-white/10 bg-[#070b12] sm:min-h-[25rem] lg:min-h-[32rem]">
          <Image
            src={piece.heroImage}
            alt={piece.name}
            fill
            priority
            sizes="(min-width: 1024px) 66vw, 100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_68%_26%,rgba(255,255,255,0.08),transparent_30%)]" />
          <div className="absolute inset-x-0 bottom-0 h-[34%] bg-gradient-to-t from-[#040812]/22 via-[#040812]/06 to-transparent" />
        </figure>
      </ImageDrift>

      <div className="max-w-[26rem] space-y-4 self-end">
        <p className="text-[0.72rem] uppercase tracking-[0.22em] text-white/42">
          {piece.category}
        </p>
        <h1 className="font-serif text-[2.4rem] leading-[0.94] tracking-[-0.04em] sm:text-[3.1rem]">
          {piece.name}
        </h1>
        <p className="max-w-[26ch] text-[1rem] leading-7 text-white/72">
          {piece.headline}
        </p>
        <p className="max-w-[32ch] text-[0.95rem] leading-7 text-white/58">
          {piece.shortDescription}
        </p>
      </div>
    </section>
  );
}
