import Image from "next/image";

export function CraftMaterialStudy({ title, line, image }: { title: string; line: string; image: string }) {
  return (
    <section className="section-divider py-16 sm:py-18 lg:py-20">
      <div className="mx-auto max-w-6xl px-5 sm:px-6 lg:px-10">
        <h2 className="font-serif text-[2rem] sm:text-3xl">{title}</h2>
        <p className="mt-4 max-w-3xl text-[var(--color-text-muted)]">{line}</p>
        <div className="surface-frame relative mt-8 overflow-hidden rounded-2xl">
          <div className="relative aspect-[16/9]">
            <Image src={image} alt="Material study frame" fill sizes="(min-width: 1024px) 72rem, 100vw" className="object-cover opacity-78" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,3,8,0.06),rgba(2,3,8,0.62))]" />
          </div>
        </div>
      </div>
    </section>
  );
}
