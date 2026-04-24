import Image from "next/image";

export function CraftHero({
  eyebrow,
  title,
  description,
  line,
  image,
}: {
  eyebrow: string;
  title: string;
  description: string;
  line: string;
  image: string;
}) {
  return (
    <section className="mx-auto max-w-6xl px-5 pb-10 pt-16 sm:px-6 sm:pt-18 lg:px-10 lg:pb-12 lg:pt-24">
      <div className="grid gap-8 border-b border-white/8 pb-10 lg:grid-cols-[0.38fr_0.62fr] lg:items-end lg:gap-12 lg:pb-12">
        <div className="max-w-[22rem]">
          <p className="text-[0.68rem] uppercase tracking-[0.22em] text-white/44">
            {eyebrow}
          </p>

          <h1 className="mt-5 max-w-[9ch] font-serif text-[2.4rem] leading-[0.94] tracking-[-0.04em] text-[var(--color-text)] sm:text-[3rem] md:text-[4.2rem]">
            {title}
          </h1>

          <p className="mt-5 max-w-[28ch] text-[1rem] leading-7 text-[var(--color-text-muted)]">
            {description}
          </p>

          <p className="mt-6 max-w-[36ch] text-[0.74rem] uppercase tracking-[0.2em] text-[var(--color-accent)]">
            {line}
          </p>
        </div>

        <div className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.02]">
          <div className="relative aspect-[16/9]">
            <Image
              src={image}
              alt={`${title} process image`}
              fill
              sizes="(min-width: 1024px) 72rem, 100vw"
              className="object-cover object-center"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
