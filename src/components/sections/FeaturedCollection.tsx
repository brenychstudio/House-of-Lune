import { featuredPieces } from "@/content/pieces";
import { homeContent } from "@/content/home";
import { LinkArrow } from "@/components/ui/LinkArrow";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function FeaturedCollection() {
  return (
    <section id="collection" className="mx-auto w-full max-w-6xl px-6 pb-26 pt-16 lg:px-10">
      <SectionHeading eyebrow="Featured Collection" title="Selected signatures" description={homeContent.intros.featured} />
      <div className="mt-12 grid gap-5 md:grid-cols-2">
        {featuredPieces.map((piece) => (
          <article
            key={piece.slug}
            className="group rounded-2xl border border-[var(--color-line)] bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.015))] p-7 transition-colors duration-300 hover:border-[rgba(195,204,216,0.4)]"
          >
            <p className="text-[0.66rem] uppercase tracking-[0.17em] text-[var(--color-text-muted)]">{piece.category}</p>
            <h3 className="mt-5 font-serif text-[1.95rem] leading-tight">{piece.name}</h3>
            <p className="mt-3 max-w-sm text-[var(--color-text-muted)]">{piece.headline}</p>
            <div className="mt-7 border-t border-[var(--color-line-soft)] pt-4">
              <p className="text-sm text-[var(--color-text-muted)]">{piece.material} · {piece.stone}</p>
              <p className="mt-2 text-[0.72rem] uppercase tracking-[0.13em] text-[var(--color-accent)]">{piece.availabilityMode}</p>
            </div>
          </article>
        ))}
      </div>
      <div className="mt-8">
        <LinkArrow href="#">View full collection</LinkArrow>
      </div>
    </section>
  );
}
