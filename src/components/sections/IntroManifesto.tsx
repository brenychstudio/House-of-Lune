import { getHomeContent } from "@/content/home";

type IntroManifestoProps = {
  homeContent: ReturnType<typeof getHomeContent>;
};

export function IntroManifesto({ homeContent }: IntroManifestoProps) {
  return (
    <section className="section-divider py-20 sm:py-24 lg:py-28">
      <div className="mx-auto w-full max-w-6xl px-6 lg:px-10">
        <p className="max-w-[8rem] text-[0.68rem] uppercase tracking-[0.24em] text-white/34">
          House note
        </p>

        <p className="mt-6 max-w-4xl border-l border-[var(--color-accent)]/50 pl-6 font-serif text-[1.9rem] leading-[1.34] text-[var(--color-text)] md:text-[2.5rem]">
          {"\u201c"}
          {homeContent.manifesto}
          {"\u201d"}
        </p>
      </div>
    </section>
  );
}
