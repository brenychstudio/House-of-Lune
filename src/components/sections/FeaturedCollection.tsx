import { featuredPieces } from "@/content/pieces";
import { homeContent } from "@/content/home";
import { LinkArrow } from "@/components/ui/LinkArrow";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function FeaturedCollection() {
  return (
    <section id="collection" className="mx-auto w-full max-w-6xl px-6 py-20 lg:px-10">
      <SectionHeading eyebrow="Featured Collection" title="Selected signatures" description={homeContent.intros.featured} />
      <div className="mt-10 grid gap-4 md:grid-cols-2">
        {featuredPieces.map((piece) => (
          <article key={piece.slug} className="rounded-xl border border-[var(--color-line)] bg-[var(--color-surface)] p-6">
            <p className="text-xs uppercase tracking-[0.16em] text-[var(--color-text-muted)]">{piece.category}</p>
            <h3 className="mt-4 font-serif text-2xl">{piece.name}</h3>
            <p className="mt-3 text-[var(--color-text-muted)]">{piece.headline}</p>
            <p className="mt-5 text-sm text-[var(--color-text-muted)]">{piece.material} · {piece.stone}</p>
            <p className="mt-2 text-sm text-[var(--color-text-muted)]">{piece.availabilityMode}</p>
          </article>
        ))}
      </div>
      <div className="mt-8">
        <LinkArrow href="#">View full collection</LinkArrow>
      </div>
    </section>
  );
}
