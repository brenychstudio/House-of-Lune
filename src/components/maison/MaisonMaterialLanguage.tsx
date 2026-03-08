import Image from "next/image";

import type { MaisonMaterialNote } from "@/types/maison";

export function MaisonMaterialLanguage({ title, notes, image }: { title: string; notes: MaisonMaterialNote[]; image: string }) {
  return (
    <section className="section-divider py-16 sm:py-18 lg:py-20">
      <div className="mx-auto grid max-w-6xl gap-7 px-5 sm:px-6 lg:gap-8 lg:grid-cols-[1fr_0.9fr] lg:px-10">
        <div>
          <h2 className="font-serif text-[2rem] sm:text-3xl">{title}</h2>
          <ul className="mt-8 space-y-5">
            {notes.map((note) => (
              <li key={note.label} className="border-b border-[var(--color-line-soft)] pb-5">
                <p className="text-xs uppercase tracking-[0.14em] text-[var(--color-accent)]">{note.label}</p>
                <p className="mt-2 text-[var(--color-text-muted)]">{note.detail}</p>
              </li>
            ))}
          </ul>
        </div>
        <div className="surface-frame relative overflow-hidden rounded-2xl">
          <div className="relative aspect-[4/5]">
            <Image src={image} alt="Maison material portrait" fill sizes="(min-width: 1024px) 34vw, 100vw" className="object-cover opacity-78" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,3,8,0.1),rgba(2,3,8,0.62))]" />
          </div>
        </div>
      </div>
    </section>
  );
}
