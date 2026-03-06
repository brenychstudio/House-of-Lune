import { homeContent } from "@/content/home";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function CraftInDetail() {
  return (
    <section id="craft" className="border-y border-[var(--color-line)] py-20">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 lg:grid-cols-2 lg:px-10">
        <SectionHeading eyebrow="Craft in Detail" title="Precision at every scale" description={homeContent.intros.craft} />
        <div className="space-y-6 text-[var(--color-text-muted)]">
          <p>Stones are selected for character before carat. Mounts are refined until structure disappears behind light.</p>
          <p>Each piece progresses through intimate stages of prototyping, finishing, and final balancing in the atelier.</p>
        </div>
      </div>
    </section>
  );
}
