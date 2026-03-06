import { getHomeContent } from "@/content/home";

type IntroManifestoProps = {
  homeContent: ReturnType<typeof getHomeContent>;
};

export function IntroManifesto({ homeContent }: IntroManifestoProps) {
  return (
    <section className="section-divider py-24">
      <div className="mx-auto w-full max-w-6xl px-6 lg:px-10">
        <p className="max-w-4xl border-l border-[var(--color-accent)]/50 pl-6 font-serif text-[1.9rem] leading-[1.34] text-[var(--color-text)] md:text-[2.5rem]">
          “{homeContent.manifesto}”
        </p>
      </div>
    </section>
  );
}
