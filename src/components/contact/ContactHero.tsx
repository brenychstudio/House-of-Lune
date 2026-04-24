import type { ContactContent } from "@/types/contact";

export function ContactHero({ hero }: { hero: ContactContent["hero"] }) {
  return (
    <section className="mx-auto max-w-6xl px-5 pb-10 pt-18 sm:px-6 sm:pb-12 sm:pt-20 lg:px-10 lg:pb-14 lg:pt-28">
      <div className="grid gap-10 border-b border-white/8 pb-12 lg:grid-cols-[0.42fr_0.58fr] lg:items-end lg:gap-16 lg:pb-14">
        <div className="max-w-[24rem]">
          <p className="text-[0.68rem] uppercase tracking-[0.22em] text-white/44">
            {hero.eyebrow}
          </p>

          <h1 className="mt-5 max-w-[9ch] font-serif text-[2.5rem] leading-[0.94] tracking-[-0.045em] text-[var(--color-text)] sm:text-[3.25rem] md:text-[4.4rem]">
            {hero.title}
          </h1>
        </div>

        <div className="max-w-[43rem] lg:justify-self-end">
          <p className="text-[1.04rem] leading-8 text-[var(--color-text-muted)]">
            {hero.description}
          </p>

          <p className="mt-6 max-w-[42rem] text-[0.98rem] leading-8 text-white/66">
            {hero.intro}
          </p>
        </div>
      </div>
    </section>
  );
}
