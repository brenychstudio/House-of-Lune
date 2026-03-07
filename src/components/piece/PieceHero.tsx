import Image from "next/image";

import type { Piece } from "@/types/piece";

export function PieceHero({ piece }: { piece: Piece }) {
  return (
    <section className="mx-auto grid max-w-6xl gap-8 px-6 pb-8 pt-16 lg:grid-cols-[1.35fr_1fr] lg:px-10 lg:pt-20">
      <div className="relative min-h-[26rem] overflow-hidden rounded-[1.45rem] border border-[var(--color-line)]">
        <Image src={piece.heroImage} alt={piece.name} fill priority sizes="(min-width: 1024px) 66vw, 100vw" className="object-cover" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,8,12,0.02),rgba(5,8,12,0.6))]" />
      </div>
      <div className="space-y-4 self-end">
        <p className="text-xs uppercase tracking-[0.14em] text-[var(--color-text-muted)]">{piece.category}</p>
        <h1 className="font-serif text-4xl leading-tight">{piece.name}</h1>
        <p className="text-[var(--color-text-muted)]">{piece.headline}</p>
      </div>
    </section>
  );
}
