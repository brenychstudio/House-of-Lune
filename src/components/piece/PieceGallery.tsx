import Image from "next/image";

import type { Piece } from "@/types/piece";
import type { Dictionary } from "@/types/i18n";

export function PieceGallery({ piece, dictionary }: { piece: Piece; dictionary: Dictionary }) {
  return (
    <section className="mx-auto max-w-6xl px-5 py-6 sm:px-6 sm:py-8 lg:px-10">
      <h2 className="mb-5 font-serif text-2xl">{dictionary.pages.piece.galleryTitle}</h2>
      <div className="grid gap-4 sm:gap-5 md:grid-cols-2">
        {piece.gallery.map((image, index) => (
          <div key={`${piece.slug}-${index}`} className="relative min-h-[16rem] sm:min-h-[20rem] overflow-hidden rounded-[1.2rem] border border-[var(--color-line)]">
            <Image src={image} alt={`${piece.name} view ${index + 1}`} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
          </div>
        ))}
      </div>
    </section>
  );
}
