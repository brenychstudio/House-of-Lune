import { homeContent } from "@/content/home";
import { LinkArrow } from "@/components/ui/LinkArrow";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function SignatureStory() {
  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-20 lg:px-10">
      <SectionHeading eyebrow="Signature Story" title="Lines that return across collections" description={homeContent.intros.signature} />
      <div className="mt-8 max-w-3xl text-[var(--color-text-muted)]">
        <p>
          Our signatures are never motifs applied for recognition, but structural ideas revisited over time: tension, interval,
          and asymmetry resolved into balance.
        </p>
      </div>
      <div className="mt-8">
        <LinkArrow href="#">Read the house story</LinkArrow>
      </div>
    </section>
  );
}
