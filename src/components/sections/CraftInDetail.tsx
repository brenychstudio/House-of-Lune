import Image from "next/image";

import { homeContent } from "@/content/home";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function CraftInDetail() {
  return (
    <section id="craft" className="section-divider py-28">
      <div className="mx-auto grid w-full max-w-6xl gap-12 px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-10">
        <SectionHeading eyebrow="Craft in Detail" title="Precision at every scale" description={homeContent.intros.craft} />
        <div className="grid gap-5 md:grid-cols-[1fr_0.8fr]">
          <div className="surface-frame relative aspect-[3/2] overflow-hidden rounded-2xl">
            <Image src={homeContent.visuals.craft.bandMacro} alt="Macro study of hero ring band" fill sizes="(min-width: 1024px) 36vw, 100vw" className="object-cover opacity-78" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,3,8,0.1),rgba(2,3,8,0.58))]" />
          </div>
          <div className="surface-frame relative aspect-[4/5] overflow-hidden rounded-2xl">
            <Image src={homeContent.visuals.craft.gemstoneMacro} alt="Macro study of hero ring gemstone" fill sizes="(min-width: 1024px) 24vw, 60vw" className="object-cover opacity-78" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,3,8,0.16),rgba(2,3,8,0.66))]" />
          </div>
          <div className="surface-frame rounded-2xl p-8 text-[var(--color-text-muted)] md:col-span-2">
            <p>Stones are selected for character before carat. Mounts are refined until structure disappears behind light.</p>
            <p className="mt-5">Each piece progresses through intimate stages of prototyping, finishing, and final balancing in the atelier.</p>
            <p className="mt-7 text-[0.72rem] uppercase tracking-[0.13em] text-[var(--color-accent-cool)]">Material study · Setting balance · Light calibration</p>
          </div>
        </div>
      </div>
    </section>
  );
}
