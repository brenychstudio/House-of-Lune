import { homeContent } from "@/content/home";
import { siteContent } from "@/content/site";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";

export function HomeHero() {
  return (
    <section className="mx-auto grid w-full max-w-6xl gap-12 px-6 pb-20 pt-20 lg:grid-cols-[1.15fr_0.85fr] lg:px-10 lg:pt-28">
      <div>
        <Eyebrow>{homeContent.hero.eyebrow}</Eyebrow>
        <h1 className="max-w-4xl font-serif text-4xl leading-tight md:text-6xl">{homeContent.hero.headline}</h1>
        <p className="mt-7 max-w-2xl text-lg text-[var(--color-text-muted)]">{homeContent.hero.subline}</p>
        <div className="mt-10 flex flex-wrap gap-4">
          <Button href="#collection">{siteContent.cta.explore}</Button>
          <Button href="#inquiry" variant="outline">
            {siteContent.cta.appointment}
          </Button>
        </div>
      </div>
      <div className="min-h-64 rounded-2xl border border-[var(--color-line)] bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.01))] p-8">
        <p className="text-sm uppercase tracking-[0.14em] text-[var(--color-text-muted)]">Visual Chamber</p>
        <p className="mt-6 max-w-sm text-[var(--color-text-muted)]">
          Reserved for upcoming cinematic object studies and immersive presentation.
        </p>
      </div>
    </section>
  );
}
