import Image from "next/image";

type Chapter = {
  title: string;
  body: string;
  image: string;
};

export function CraftProcessChapters({
  title,
  chapters,
}: {
  title: string;
  chapters: Chapter[];
}) {
  return (
    <section className="section-divider py-16 sm:py-18 lg:py-20">
      <div className="mx-auto max-w-6xl px-5 sm:px-6 lg:px-10">
        <div className="grid gap-8 lg:grid-cols-[0.3fr_0.7fr] lg:gap-12">
          <div className="border-t border-white/8 pt-6">
            <h2 className="font-serif text-[2rem] leading-[1.02] tracking-[-0.03em] text-[var(--color-text)] sm:text-[2.4rem]">
              {title}
            </h2>
          </div>

          <div className="space-y-5">
            {chapters.map((chapter, index) => (
              <article
                key={chapter.title}
                className="grid gap-4 rounded-[1.45rem] border border-white/10 bg-white/[0.02] p-4 sm:p-5 lg:grid-cols-[0.46fr_0.54fr] lg:items-center lg:gap-6"
              >
                <div
                  className={`relative overflow-hidden rounded-[1.2rem] ${
                    index === 1 ? "lg:order-2" : ""
                  }`}
                >
                  <div className="relative aspect-[4/3]">
                    <Image
                      src={chapter.image}
                      alt={chapter.title}
                      fill
                      sizes="(min-width: 1024px) 38vw, 100vw"
                      className="object-cover object-center"
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,3,8,0.02),rgba(2,3,8,0.42))]" />
                  </div>
                </div>

                <div className={index === 1 ? "lg:order-1" : ""}>
                  <p className="text-[0.64rem] uppercase tracking-[0.2em] text-white/38">
                    {String(index + 1).padStart(2, "0")}
                  </p>

                  <h3 className="mt-3 font-serif text-[1.55rem] leading-[1.02] tracking-[-0.02em] text-[var(--color-text)] sm:text-[1.8rem]">
                    {chapter.title}
                  </h3>

                  <p className="mt-3 max-w-[30ch] text-[0.97rem] leading-7 text-white/68">
                    {chapter.body}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
