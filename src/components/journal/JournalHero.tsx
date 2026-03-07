import Image from "next/image";

export function JournalHero({ eyebrow, title, description, image }: { eyebrow: string; title: string; description: string; image: string }) {
  return (
    <section className="mx-auto max-w-6xl px-6 pb-12 pt-20 lg:px-10 lg:pt-24">
      <p className="text-xs uppercase tracking-[0.14em] text-[var(--color-text-muted)]">{eyebrow}</p>
      <h1 className="mt-4 max-w-4xl font-serif text-4xl leading-tight md:text-5xl">{title}</h1>
      <p className="mt-5 max-w-3xl text-[var(--color-text-muted)]">{description}</p>
      <div className="surface-frame relative mt-10 overflow-hidden rounded-2xl">
        <div className="relative aspect-[21/9]">
          <Image src={image} alt="Journal campaign hero" fill sizes="(min-width: 1024px) 72rem, 100vw" className="object-cover opacity-74" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,3,8,0.1),rgba(2,3,8,0.66))]" />
        </div>
      </div>
    </section>
  );
}
