import Image from "next/image";

import { getHomeContent } from "@/content/home";
import { SectionHeading } from "@/components/ui/SectionHeading";

type CraftInDetailProps = {
  homeContent: ReturnType<typeof getHomeContent>;
};

export function CraftInDetail({ homeContent }: CraftInDetailProps) {
  return (
    <section id="craft" className="section-divider py-20 sm:py-24 lg:py-28">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 sm:px-6 lg:gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:px-10">
        <SectionHeading eyebrow={homeContent.craft.eyebrow} title={homeContent.craft.title} description={homeContent.craft.description} />
        <div className="grid gap-4 sm:gap-5 md:grid-cols-[1fr_0.8fr]">
          <div className="surface-frame relative aspect-[3/2] overflow-hidden rounded-2xl">
            <Image src={homeContent.visuals.craft.bandMacro} alt="Macro study of hero ring band" fill sizes="(min-width: 1024px) 36vw, 100vw" className="object-cover opacity-78" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,3,8,0.1),rgba(2,3,8,0.58))]" />
          </div>
          <div className="surface-frame relative aspect-[4/5] overflow-hidden rounded-2xl">
            <Image src={homeContent.visuals.craft.gemstoneMacro} alt="Macro study of hero ring gemstone" fill sizes="(min-width: 1024px) 24vw, 60vw" className="object-cover opacity-78" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,3,8,0.16),rgba(2,3,8,0.66))]" />
          </div>
          <div className="surface-frame rounded-2xl p-6 sm:p-8 text-[var(--color-text-muted)] md:col-span-2">
            <p>{homeContent.craft.bodyOne}</p>
            <p className="mt-5">{homeContent.craft.bodyTwo}</p>
            <p className="mt-7 text-[0.72rem] uppercase tracking-[0.13em] text-[var(--color-accent-cool)]">{homeContent.craft.detailLine}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
