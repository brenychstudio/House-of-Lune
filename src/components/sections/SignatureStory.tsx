import Image from "next/image";

import { homeContent } from "@/content/home";
import { LinkArrow } from "@/components/ui/LinkArrow";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function SignatureStory() {
  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-30 lg:px-10">
      <SectionHeading eyebrow="Signature Story" title="Lines that return across collections" description={homeContent.intros.signature} />
      <div className="mt-10 grid items-end gap-8 lg:grid-cols-[1fr_1.1fr]">
        <div className="max-w-3xl text-[var(--color-text-muted)]">
          <p>
            Our signatures are never motifs applied for recognition, but structural ideas revisited over time: tension, interval,
            and asymmetry resolved into balance.
          </p>
        </div>
        <div className="surface-frame relative aspect-[16/9] overflow-hidden rounded-2xl">
          <Image src={homeContent.visuals.signatureCampaign} alt="Hero ring still-life campaign frame" fill sizes="(min-width: 1024px) 44vw, 100vw" className="object-cover opacity-74" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,3,8,0.08),rgba(2,3,8,0.56))]" />
        </div>
      </div>
      <div className="mt-10">
        <LinkArrow href="#">Read the house story</LinkArrow>
      </div>
    </section>
  );
}
