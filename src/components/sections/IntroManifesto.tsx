import { homeContent } from "@/content/home";

export function IntroManifesto() {
  return (
    <section className="border-y border-[var(--color-line)]/80 py-18">
      <div className="mx-auto w-full max-w-6xl px-6 lg:px-10">
        <p className="max-w-4xl font-serif text-2xl leading-relaxed text-[var(--color-text)] md:text-3xl">“{homeContent.manifesto}”</p>
      </div>
    </section>
  );
}
