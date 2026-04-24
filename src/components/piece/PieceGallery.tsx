import Image from "next/image";

import { EditorialReveal } from "@/components/motion/EditorialReveal";
import type { Dictionary } from "@/types/i18n";
import type { Piece } from "@/types/piece";

type PieceGalleryProps = {
  piece: Piece;
  dictionary: Dictionary;
};

export function PieceGallery({ piece, dictionary }: PieceGalleryProps) {
  const gallery = piece.gallery.filter(
    (image): image is string => typeof image === "string" && image.length > 0,
  );

  if (gallery.length === 0) {
    return null;
  }

  const [leadImage, ...supportImages] = gallery;

  return (
    <EditorialReveal>
      <section className="mx-auto max-w-6xl px-5 py-10 sm:px-6 sm:py-12 lg:px-10 lg:py-14">
        <div className="mb-6 flex items-end justify-between gap-6 border-b border-white/8 pb-5">
          <h2 className="font-serif text-[1.75rem] leading-none tracking-[-0.025em] text-[var(--color-text)]">
            {dictionary.pages.piece.galleryTitle}
          </h2>
        </div>

        <div className="grid gap-4 sm:gap-5">
          <figure className="luxury-frame relative overflow-hidden rounded-[1.35rem] border border-white/10 bg-white/[0.015]">
            <div className="relative min-h-[20rem] sm:min-h-[27rem] lg:min-h-[31rem]">
              <Image
                src={leadImage}
                alt={`${piece.name} editorial view 1`}
                fill
                sizes="(min-width: 1024px) 72rem, 100vw"
                className="object-cover object-center"
              />
            </div>
          </figure>

          {supportImages.length > 0 ? (
            <div className="grid gap-4 sm:gap-5 md:grid-cols-2">
              {supportImages.map((image, index) => (
                <figure
                  key={`${piece.slug}-support-${index}`}
                  className="luxury-frame relative overflow-hidden rounded-[1.25rem] border border-white/10 bg-white/[0.015]"
                >
                  <div className="relative min-h-[16rem] sm:min-h-[21rem] lg:min-h-[23rem]">
                    <Image
                      src={image}
                      alt={`${piece.name} editorial view ${index + 2}`}
                      fill
                      sizes="(min-width: 1024px) 36rem, (min-width: 768px) 50vw, 100vw"
                      className="object-cover object-center"
                    />
                  </div>
                </figure>
              ))}
            </div>
          ) : null}
        </div>
      </section>
    </EditorialReveal>
  );
}
