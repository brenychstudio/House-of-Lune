import { homeContent } from "@/content/home";
import { siteContent } from "@/content/site";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";

export function HomeHero() {
  return (
    <section className="mx-auto grid w-full max-w-6xl gap-14 px-6 pb-24 pt-16 lg:grid-cols-[1.1fr_0.9fr] lg:px-10 lg:pb-30 lg:pt-26">
      <div className="max-w-3xl">
        <Eyebrow>{homeContent.hero.eyebrow}</Eyebrow>
        <h1 className="max-w-4xl font-serif text-4xl leading-[1.04] md:text-[4.1rem]">{homeContent.hero.headline}</h1>
        <p className="mt-8 max-w-xl text-lg text-[var(--color-text-muted)]">{homeContent.hero.subline}</p>
        <div className="mt-12 flex flex-wrap gap-4">
          <Button href="#collection">{siteContent.cta.explore}</Button>
          <Button href="#inquiry" variant="outline">
            {siteContent.cta.appointment}
          </Button>
        </div>
      </div>
      <div className="surface-frame relative min-h-[25rem] overflow-hidden rounded-3xl border border-[var(--color-line)] p-8 lg:min-h-[31rem]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_55%_38%,rgba(195,204,216,0.13),transparent_42%),radial-gradient(circle_at_45%_78%,rgba(207,191,157,0.09),transparent_48%)]" />
        <div className="absolute inset-[9%] rounded-[2rem] border border-[rgba(195,204,216,0.2)]/60" />
        <div className="absolute left-1/2 top-1/2 h-[60%] w-[52%] -translate-x-1/2 -translate-y-1/2 rounded-[48%] border border-[rgba(207,191,157,0.28)] bg-[radial-gradient(circle_at_42%_35%,rgba(255,255,255,0.18),rgba(255,255,255,0.03)_48%,rgba(0,0,0,0.24)_100%)] blur-[0.2px]" />
        <div className="absolute left-1/2 top-1/2 h-[40%] w-[30%] -translate-x-1/2 -translate-y-[42%] rounded-[50%] border border-[rgba(195,204,216,0.24)] opacity-80" />
        <div className="relative z-10 flex h-full flex-col justify-between">
          <p className="text-[0.66rem] uppercase tracking-[0.18em] text-[var(--color-text-muted)]">Cinematic Chamber · Study I</p>
          <p className="max-w-xs text-sm text-[var(--color-text-muted)]/95">
            The object stage remains intentionally veiled. Light, contour, and atmosphere are composed in advance of the reveal.
          </p>
        </div>
      </div>
    </section>
  );
}
