import Image from "next/image";

export function CraftHero({ eyebrow, title, description, line, image }: { eyebrow: string; title: string; description: string; line: string; image: string }) {
  return (
    <section className="mx-auto max-w-6xl px-5 pb-10 pt-16 sm:px-6 sm:pt-18 lg:px-10 lg:pt-24">
      <p className="text-xs uppercase tracking-[0.14em] text-[var(--color-text-muted)]">{eyebrow}</p>
      <h1 className="mt-4 max-w-4xl font-serif text-[2.2rem] leading-tight sm:text-4xl md:text-5xl">{title}</h1>
      <p className="mt-5 max-w-3xl text-[var(--color-text-muted)]">{description}</p>
      <p className="mt-5 max-w-3xl text-sm uppercase tracking-[0.14em] text-[var(--color-accent)]">{line}</p>
      <div className="surface-frame relative mt-10 overflow-hidden rounded-2xl">
        <div className="relative aspect-[16/9]">
          <Image src={image} alt={`${title} process image`} fill sizes="(min-width: 1024px) 72rem, 100vw" className="object-cover" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,3,8,0.04),rgba(2,3,8,0.58))]" />
        </div>
      </div>
    </section>
  );
}
