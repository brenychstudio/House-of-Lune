import Image from "next/image";

import type { MaisonMaterialNote } from "@/types/maison";

export function MaisonMaterialLanguage({
  title,
  notes,
  image,
}: {
  title: string;
  notes: MaisonMaterialNote[];
  image: string;
}) {
  return (
    <section className="section-divider py-18 sm:py-20 lg:py-24">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 sm:px-6 lg:grid-cols-[0.52fr_0.48fr] lg:items-center lg:gap-16 lg:px-10">
        <div className="border-t border-white/8 pt-8">
          <h2 className="font-serif text-[2rem] leading-[1.02] tracking-[-0.03em] text-[var(--color-text)] sm:text-[2.4rem]">
            {title}
          </h2>

          <ul className="mt-9">
            {notes.map((note) => (
              <li key={note.label} className="border-b border-white/8 py-6 first:pt-0">
                <p className="text-[0.64rem] uppercase tracking-[0.2em] text-[var(--color-accent)]">
                  {note.label}
                </p>
                <p className="mt-3 max-w-[44ch] text-[0.98rem] leading-7 text-white/64">
                  {note.detail}
                </p>
              </li>
            ))}
          </ul>
        </div>

        <div className="surface-frame relative overflow-hidden rounded-[1.75rem] p-2">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[1.35rem]">
            <Image
              src={image}
              alt={`${title} material portrait`}
              fill
              sizes="(min-width: 1024px) 34rem, 100vw"
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,3,8,0),rgba(2,3,8,0.12))]" />
          </div>
        </div>
      </div>
    </section>
  );
}
