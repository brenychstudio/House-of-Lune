import Image from "next/image";

export default function CraftInDetail() {
  return (
    <section className="border-t border-white/6 bg-transparent">
      <div className="mx-auto max-w-[1320px] px-6 py-20 lg:px-10 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-[0.58fr_1.42fr] lg:items-start lg:gap-14">
          <div className="max-w-[23rem]">
            <p className="text-[0.72rem] uppercase tracking-[0.24em] text-white/46">
              Craft in Detail
            </p>

            <h2 className="mt-5 max-w-[8ch] text-[clamp(2.9rem,5vw,5.1rem)] leading-[0.92] tracking-[-0.05em] text-[var(--color-text)]">
              Precision at every scale
            </h2>

            <p className="mt-6 max-w-[28ch] text-[1rem] leading-7 text-white/72">
              From stone to silhouette, each decision is exacting and quietly
              observed.
            </p>
          </div>

          <div className="grid gap-4 lg:grid-cols-[1.08fr_0.72fr]">
            <figure className="group relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.02] aspect-[16/10]">
              <Image
                src="/media/pieces/hero-ring/macro/hol-hero-ring-band-macro-3x2-01.png"
                alt="Hero Ring band macro study"
                fill
                className="object-cover object-center transition-transform duration-700 group-hover:scale-[1.015]"
                sizes="(min-width: 1024px) 42vw, 100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#02050b]/18 via-transparent to-transparent" />
            </figure>

            <figure className="group relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.02] aspect-[4/5] lg:row-span-2">
              <Image
                src="/media/pieces/hero-ring/macro/hol-hero-ring-gemstone-macro-4x5-01.png"
                alt="Hero Ring gemstone macro study"
                fill
                className="object-cover object-center transition-transform duration-700 group-hover:scale-[1.015]"
                sizes="(min-width: 1024px) 24vw, 100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#02050b]/12 via-transparent to-transparent" />
            </figure>

            <div className="rounded-[1.5rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.015))] p-6 lg:p-7">
              <div className="grid gap-5 sm:grid-cols-3">
                <div>
                  <p className="text-[0.68rem] uppercase tracking-[0.22em] text-white/42">
                    Metal Texture
                  </p>
                  <p className="mt-2 text-[0.95rem] leading-7 text-white/70">
                    Surfaces are refined to hold reflection with precision.
                  </p>
                </div>

                <div>
                  <p className="text-[0.68rem] uppercase tracking-[0.22em] text-white/42">
                    Setting Balance
                  </p>
                  <p className="mt-2 text-[0.95rem] leading-7 text-white/70">
                    Mount geometry is reduced until the silhouette feels inevitable.
                  </p>
                </div>

                <div>
                  <p className="text-[0.68rem] uppercase tracking-[0.22em] text-white/42">
                    Light Calibration
                  </p>
                  <p className="mt-2 text-[0.95rem] leading-7 text-white/70">
                    Final polish is tuned for control, depth, and restraint.
                  </p>
                </div>
              </div>

              <div className="mt-6 border-t border-white/8 pt-5">
                <p className="max-w-[48ch] text-[0.96rem] leading-7 text-white/70">
                  The setting is refined until structure recedes and brilliance
                  can remain controlled rather than merely bright.
                </p>

                <p className="mt-5 text-[0.68rem] uppercase tracking-[0.22em] text-white/42">
                  Material Study · Setting Balance · Light Calibration
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
