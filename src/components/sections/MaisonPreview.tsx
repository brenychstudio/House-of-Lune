import Image from "next/image";

import { ImageDrift } from "@/components/motion/ImageDrift";
import { TransitionLink } from "@/components/motion/TransitionLink";

export default function MaisonPreview() {
  return (
    <section className="border-t border-white/6 bg-transparent">
      <div className="mx-auto max-w-[1320px] px-6 py-18 lg:px-10 lg:py-24">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.4fr)_minmax(0,0.6fr)] lg:items-end lg:gap-18 xl:gap-20">
          <div className="min-w-0 max-w-[24rem]">
            <p className="text-[0.72rem] uppercase tracking-[0.24em] text-white/46">
              Maison
            </p>

            <h2 className="mt-5 max-w-[22rem] text-[clamp(2.15rem,3.5vw,4.2rem)] leading-[0.94] tracking-[-0.045em] text-[var(--color-text)]">
              A discreet house, internationally placed
            </h2>

            <p className="mt-6 max-w-[28ch] text-[1rem] leading-7 text-white/72">
              Inside the maison where intentions are tested, then made lasting.
            </p>
          </div>

          <div className="min-w-0">
            <ImageDrift>
              <figure className="luxury-card luxury-frame relative aspect-[16/9] overflow-hidden rounded-[1.9rem] border border-white/10 bg-white/[0.02] hover:border-white/16">
                <Image
                  src="/media/maison/atelier/hol-maison-atelier-nocturne-3x2-01.png"
                  alt="House of Lune atelier still life"
                  fill
                  className="object-cover object-center"
                  sizes="(min-width: 1024px) 62vw, 100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#02050b]/18 via-transparent to-transparent" />
              </figure>
            </ImageDrift>

            <div className="mt-5 flex flex-col gap-4 border-t border-white/8 pt-5 lg:flex-row lg:items-start lg:justify-between">
              <p className="max-w-[38rem] text-[0.96rem] leading-7 text-white/70">
                Appointments are offered in private salons and through selected
                partner spaces in Paris, Geneva, and Tokyo.
              </p>

              <TransitionLink
                href="./maison"
                className="luxury-line-link inline-flex pb-1 text-[0.72rem] uppercase tracking-[0.22em] text-white/62 hover:text-[var(--color-text)]"
              >
                {"Discover the Maison \u2192"}
              </TransitionLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
