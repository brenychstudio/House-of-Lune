import Image from "next/image";

import type { Piece } from "@/types/piece";

export function PieceHero({ piece }: { piece: Piece }) {
  return (
    <section className="mx-auto grid max-w-6xl gap-6 px-5 pb-6 pt-14 sm:px-6 sm:pb-8 sm:pt-16 lg:grid-cols-[1.35fr_1fr] lg:px-10 lg:pt-20">
      <div className="relative min-h-[19rem] sm:min-h-[24rem] lg:min-h-[26rem] overflow-hidden rounded-[1.45rem] border border-[var(--color-line)]">
        <Image src={piece.heroImage} alt={piece.name} fill priority sizes="(min-width: 1024px) 66vw, 100vw" className="object-cover" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,8,12,0.02),rgba(5,8,12,0.6))]" />
      </div>
      <div className="space-y-4 self-end">
        <p className="text-xs uppercase tracking-[0.14em] text-[var(--color-text-muted)]">{piece.category}</p>
        <h1 className="font-serif text-[2.2rem] leading-tight sm:text-4xl">{piece.name}</h1>
        <p className="text-[var(--color-text-muted)]">{piece.headline}</p>
        <p className="max-w-xl text-sm text-[var(--color-text-muted)]">{piece.shortDescription}</p>
      </div>
    </section>
  );
}
