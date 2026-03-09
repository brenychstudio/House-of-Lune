import Image from "next/image";

type Chapter = {
  title: string;
  body: string;
  image: string;
};

export function CraftProcessChapters({ title, chapters }: { title: string; chapters: Chapter[] }) {
  return (
    <section className="section-divider py-16 sm:py-18 lg:py-20">
      <div className="mx-auto max-w-6xl px-5 sm:px-6 lg:px-10">
        <h2 className="font-serif text-3xl">{title}</h2>
        <div className="mt-7 grid gap-5 sm:mt-8 sm:gap-6 md:grid-cols-3">
          {chapters.map((chapter) => (
            <article key={chapter.title} className="overflow-hidden rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)]">
              <div className="relative aspect-[4/5]">
                <Image src={chapter.image} alt={chapter.title} fill sizes="(min-width: 768px) 30vw, 100vw" className="object-cover" />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,3,8,0.02),rgba(2,3,8,0.5))]" />
              </div>
              <div className="p-5">
                <h3 className="font-serif text-[1.7rem] sm:text-2xl">{chapter.title}</h3>
                <p className="mt-2 text-[var(--color-text-muted)]">{chapter.body}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
