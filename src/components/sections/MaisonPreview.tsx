import { homeContent } from "@/content/home";
import { LinkArrow } from "@/components/ui/LinkArrow";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function MaisonPreview() {
  return (
    <section id="maison" className="section-divider py-22">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-6 lg:grid-cols-[1fr_1fr] lg:px-10">
        <SectionHeading eyebrow="Maison" title="A discreet house, internationally placed" description={homeContent.intros.maison} />
        <div className="rounded-2xl border border-[var(--color-line)] bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.014))] p-8 text-[var(--color-text-muted)]">
          <p>Appointments are offered in private salons and through select partner spaces in Paris, Geneva, and Tokyo.</p>
          <div className="mt-6">
            <LinkArrow href="#">Discover the maison</LinkArrow>
          </div>
        </div>
      </div>
    </section>
  );
}
