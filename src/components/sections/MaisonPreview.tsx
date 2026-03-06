import Image from "next/image";

import { homeContent } from "@/content/home";
import { LinkArrow } from "@/components/ui/LinkArrow";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function MaisonPreview() {
  return (
    <section id="maison" className="section-divider py-22">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-6 lg:grid-cols-[1fr_1fr] lg:px-10">
        <SectionHeading eyebrow="Maison" title="A discreet house, internationally placed" description={homeContent.intros.maison} />
        <div className="rounded-2xl border border-[var(--color-line)] bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.014))] p-8 text-[var(--color-text-muted)]">
          <div className="surface-frame relative mb-7 aspect-[3/2] overflow-hidden rounded-xl">
            <Image src={homeContent.visuals.maisonAtelier} alt="Nocturne atelier interior at the maison" fill sizes="(min-width: 1024px) 36vw, 100vw" className="object-cover opacity-74" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,3,8,0.08),rgba(2,3,8,0.62))]" />
          </div>
          <p>Appointments are offered in private salons and through select partner spaces in Paris, Geneva, and Tokyo.</p>
          <div className="mt-6">
            <LinkArrow href="#">Discover the maison</LinkArrow>
          </div>
        </div>
      </div>
    </section>
  );
}
