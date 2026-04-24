import Image from "next/image";

type MaisonHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
  line: string;
  image: string;
};

export function MaisonHero({ eyebrow, title, description, line, image }: MaisonHeroProps) {
  return (
    <section className="mx-auto max-w-6xl px-5 pb-12 pt-18 sm:px-6 sm:pt-20 lg:px-10 lg:pb-14 lg:pt-28">
      <div className="max-w-4xl">
        <p className="text-[0.68rem] uppercase tracking-[0.2em] text-white/44">{eyebrow}</p>
        <h1 className="mt-5 max-w-[11ch] font-serif text-[2.5rem] leading-[0.96] tracking-[-0.035em] text-[var(--color-text)] sm:text-[3.3rem] md:text-[4.3rem]">
          {title}
        </h1>
        <p className="mt-6 max-w-[44rem] text-[1.03rem] leading-8 text-white/66">{description}</p>
        <p className="mt-6 max-w-[46rem] text-[0.74rem] uppercase leading-6 tracking-[0.2em] text-[var(--color-accent)]">
          {line}
        </p>
      </div>

      <div className="surface-frame relative mt-10 overflow-hidden rounded-[1.75rem] sm:mt-12">
        <div className="relative aspect-[16/8.6]">
          <Image
            src={image}
            alt={`${title} campaign image`}
            fill
            sizes="(min-width: 1024px) 72rem, 100vw"
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,3,8,0),rgba(2,3,8,0.14))]" />
        </div>
      </div>
    </section>
  );
}
