import { homeContent } from "@/content/home";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function CraftInDetail() {
  return (
    <section id="craft" className="section-divider py-28">
      <div className="mx-auto grid w-full max-w-6xl gap-12 px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-10">
        <SectionHeading eyebrow="Craft in Detail" title="Precision at every scale" description={homeContent.intros.craft} />
        <div className="surface-frame rounded-2xl p-8 text-[var(--color-text-muted)]">
          <p>Stones are selected for character before carat. Mounts are refined until structure disappears behind light.</p>
          <p className="mt-5">Each piece progresses through intimate stages of prototyping, finishing, and final balancing in the atelier.</p>
          <p className="mt-7 text-[0.72rem] uppercase tracking-[0.13em] text-[var(--color-accent-cool)]">Material study · Setting balance · Light calibration</p>
        </div>
      </div>
    </section>
  );
}
