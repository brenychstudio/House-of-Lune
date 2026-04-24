import Image from "next/image";

export function CraftMaterialStudy({
  title,
  line,
  image,
}: {
  title: string;
  line: string;
  image: string;
}) {
  return (
    <section className="section-divider py-16 sm:py-18 lg:py-20">
      <div className="mx-auto max-w-6xl px-5 sm:px-6 lg:px-10">
        <div className="grid gap-8 lg:grid-cols-[0.34fr_0.66fr] lg:items-end lg:gap-12">
          <div className="border-t border-white/8 pt-6">
            <h2 className="font-serif text-[2rem] leading-[1.02] tracking-[-0.03em] text-[var(--color-text)] sm:text-[2.4rem]">
              {title}
            </h2>

            <p className="mt-4 max-w-[24rem] text-[0.97rem] leading-7 text-white/68">
              {line}
            </p>
          </div>

          <div className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.02]">
            <div className="relative aspect-[16/10] lg:aspect-[16/9]">
              <Image
                src={image}
                alt={`${title} material study`}
                fill
                sizes="(min-width: 1024px) 72rem, 100vw"
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,3,8,0.03),rgba(2,3,8,0.5))]" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
