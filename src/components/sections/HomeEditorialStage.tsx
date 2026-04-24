"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { TransitionLink } from "@/components/motion/TransitionLink";

type StageItem = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  href: string;
  cta: string;
  stageLabel: string;
  stageMeta: string;
  mainImage: string;
  accentImage: string;
};

const HEADER_OFFSET = 56;

const STAGE_ITEMS: StageItem[] = [
  {
    id: "craft",
    eyebrow: "Craft in Detail",
    title: "Precision at every scale",
    description:
      "From stone to silhouette, each decision is exacting and quietly observed.",
    href: "./craftsmanship",
    cta: "View Craftsmanship",
    stageLabel: "Craft \u00b7 Material Study",
    stageMeta: "Metal texture \u00b7 Setting balance \u00b7 Light calibration",
    mainImage:
      "/media/pieces/hero-ring/macro/hol-hero-ring-band-macro-3x2-01.png",
    accentImage:
      "/media/pieces/hero-ring/macro/hol-hero-ring-gemstone-macro-4x5-01.png",
  },
  {
    id: "maison",
    eyebrow: "Maison",
    title: "A discreet house, internationally placed",
    description:
      "Inside the maison where intentions are tested, then made lasting.",
    href: "./maison",
    cta: "Discover the Maison",
    stageLabel: "Maison \u00b7 Private Salons",
    stageMeta: "Appointments \u00b7 Atmosphere \u00b7 Discretion",
    mainImage: "/media/maison/atelier/hol-maison-atelier-nocturne-3x2-01.png",
    accentImage:
      "/media/pieces/hero-ring/macro/hol-hero-ring-gemstone-macro-4x5-01.png",
  },
  {
    id: "journal",
    eyebrow: "Journal",
    title: "Editorial notes from the house",
    description:
      "Notes on material, culture, and contemporary adornment from the house.",
    href: "./journal",
    cta: "Open Journal",
    stageLabel: "Journal \u00b7 Quiet Architecture",
    stageMeta: "Notes \u00b7 Reflections \u00b7 House voice",
    mainImage:
      "/media/pieces/hero-ring/macro/hol-hero-ring-band-macro-3x2-01.png",
    accentImage:
      "/media/pieces/hero-ring/cards/hol-hero-ring-featured-card-4x5-01.png",
  },
];

export default function HomeEditorialStage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [stageShift, setStageShift] = useState(0);

  const sectionRef = useRef<HTMLElement | null>(null);
  const shellRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<(HTMLElement | null)[]>([]);
  const currentShiftRef = useRef(0);
  const targetShiftRef = useRef(0);
  const shiftRafRef = useRef(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible.length > 0) {
          const nextIndex = Number(
            (visible[0].target as HTMLElement).dataset.index ?? 0,
          );
          setActiveIndex(nextIndex);
        }
      },
      {
        rootMargin: "-18% 0px -32% 0px",
        threshold: [0.2, 0.35, 0.5, 0.7],
      },
    );

    itemRefs.current.forEach((node) => {
      if (node) observer.observe(node);
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let scrollRafId = 0;

    const clamp01 = (value: number) => Math.min(Math.max(value, 0), 1);

    /**
     * Softer than easeOutCubic.
     * This keeps the second chapter closer to center instead of dropping too early.
     */
    const easeInOutSine = (value: number) =>
      -(Math.cos(Math.PI * value) - 1) / 2;

    const ensureShiftAnimation = () => {
      if (shiftRafRef.current) return;

      const animate = () => {
        const current = currentShiftRef.current;
        const target = targetShiftRef.current;
        const next = current + (target - current) * 0.058;

        currentShiftRef.current =
          Math.abs(target - next) <= 0.08 ? target : next;

        setStageShift(currentShiftRef.current);

        if (Math.abs(target - currentShiftRef.current) > 0.08) {
          shiftRafRef.current = window.requestAnimationFrame(animate);
        } else {
          shiftRafRef.current = 0;
        }
      };

      shiftRafRef.current = window.requestAnimationFrame(animate);
    };

    const updateStageShift = () => {
      if (
        !sectionRef.current ||
        !shellRef.current ||
        !panelRef.current ||
        window.innerWidth < 1024
      ) {
        targetShiftRef.current = 0;
        ensureShiftAnimation();
        return;
      }

      const rect = sectionRef.current.getBoundingClientRect();
      const shellHeight = shellRef.current.clientHeight;
      const panelHeight = panelRef.current.clientHeight;
      const viewportH = window.innerHeight;

      /**
       * Keep a little unused bottom travel so the panel does not visually hit
       * the end of its rail.
       */
      const safeEndPadding = 34;
      const availableTravel = Math.max(
        0,
        shellHeight - panelHeight - safeEndPadding,
      );

      if (availableTravel <= 0) {
        targetShiftRef.current = 0;
        ensureShiftAnimation();
        return;
      }

      /**
       * Start earlier, but not aggressively.
       * The previous easeOutCubic made the panel drop too much by chapter 02.
       */
      const startLead = viewportH * 0.3;
      const endBreathing = viewportH * 0.18;

      const totalScrollableDistance = Math.max(
        1,
        rect.height - viewportH + HEADER_OFFSET + startLead + endBreathing,
      );

      const passedDistance = Math.min(
        Math.max(HEADER_OFFSET + startLead - rect.top, 0),
        totalScrollableDistance,
      );

      const progress = clamp01(passedDistance / totalScrollableDistance);
      const easedProgress = easeInOutSine(progress);

      /**
       * Do not use full availableTravel. Full travel makes the stage feel like
       * it slams into the end. 86% still gives cinematic motion without drop-off.
       */
      targetShiftRef.current = easedProgress * availableTravel * 0.86;

      ensureShiftAnimation();
    };

    const onScroll = () => {
      window.cancelAnimationFrame(scrollRafId);
      scrollRafId = window.requestAnimationFrame(updateStageShift);
    };

    updateStageShift();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.cancelAnimationFrame(scrollRafId);
      window.cancelAnimationFrame(shiftRafRef.current);
      shiftRafRef.current = 0;
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="border-t border-white/6 bg-[linear-gradient(180deg,rgba(255,255,255,0.018),rgba(255,255,255,0)_18%,rgba(255,255,255,0)_82%,rgba(255,255,255,0.012))]"
    >
      <div className="mx-auto max-w-[1320px] px-6 py-24 lg:px-10 lg:py-32">
        <div className="grid gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:gap-14">
          <div>
            {STAGE_ITEMS.map((item, index) => {
              const isActive = activeIndex === index;

              return (
                <article
                  key={item.id}
                  data-index={index}
                  ref={(node) => {
                    itemRefs.current[index] = node;
                  }}
                  className="flex min-h-[84vh] items-center border-b border-white/6 first:border-t first:border-white/6 lg:min-h-[98vh]"
                >
                  <div
                    className={`max-w-[22rem] transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                      isActive
                        ? "translate-y-0 opacity-100 blur-0"
                        : "translate-y-2 opacity-45 blur-[1px]"
                    }`}
                  >
                    <p className="text-[0.72rem] uppercase tracking-[0.24em] text-white/42">
                      {item.eyebrow}
                    </p>

                    <h2 className="mt-5 max-w-[10ch] text-[clamp(2.35rem,4.6vw,4.9rem)] leading-[0.92] tracking-[-0.05em] text-[var(--color-text)]">
                      {item.title}
                    </h2>

                    <p className="mt-6 max-w-[27ch] text-[1rem] leading-7 text-white/70">
                      {item.description}
                    </p>

                    <TransitionLink
                      href={item.href}
                      className="luxury-line-link mt-6 inline-flex pb-1 text-[0.72rem] uppercase tracking-[0.22em] text-white/62 hover:text-[var(--color-text)]"
                    >
                      {`${item.cta} \u2192`}
                    </TransitionLink>

                    <div className="mt-8 overflow-hidden rounded-[1.35rem] border border-white/10 bg-white/[0.02] lg:hidden">
                      <div className="luxury-frame relative aspect-[16/10]">
                        <Image
                          src={item.mainImage}
                          alt={item.title}
                          fill
                          className="object-cover object-center"
                          sizes="100vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#040812]/24 via-transparent to-transparent" />
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          <div className="hidden lg:block">
            <div
              ref={shellRef}
              className="sticky top-[64px] h-[calc(100vh-64px)]"
            >
              <div
                className="will-change-transform"
                style={{ transform: `translateY(${stageShift}px)` }}
              >
                <div ref={panelRef} className="w-full">
                  <div className="relative overflow-hidden rounded-[2.1rem] border border-white/10 bg-white/[0.02] p-3 shadow-[0_0_0_1px_rgba(255,255,255,0.02)]">
                    <div className="relative aspect-[14/11] overflow-hidden rounded-[1.8rem] border border-white/8 bg-[#060a12]">
                      {STAGE_ITEMS.map((item, index) => {
                        const isActive = activeIndex === index;

                        return (
                          <div
                            key={item.id}
                            className={`absolute inset-0 transition-all duration-900 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                              isActive
                                ? "pointer-events-auto scale-100 opacity-100"
                                : "pointer-events-none scale-[1.02] opacity-0"
                            }`}
                          >
                            <div className="absolute inset-0">
                              <Image
                                src={item.mainImage}
                                alt={item.title}
                                fill
                                className="object-cover object-center"
                                sizes="(min-width: 1024px) 60vw, 100vw"
                              />
                            </div>

                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_68%_34%,rgba(255,255,255,0.12),transparent_26%)]" />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#040812]/26 via-[#040812]/06 to-transparent" />

                            <div
                              className={`absolute left-[6%] top-[8%] w-[34%] overflow-hidden rounded-[1.2rem] border border-white/12 bg-white/[0.03] shadow-[0_20px_80px_rgba(0,0,0,0.32)] transition-all duration-[850ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
                                isActive
                                  ? "translate-y-0 opacity-100"
                                  : "-translate-y-2 opacity-0"
                              }`}
                            >
                              <div className="relative aspect-[4/3]">
                                <Image
                                  src={
                                    index === 1
                                      ? "/media/maison/atelier/hol-maison-atelier-nocturne-3x2-01.png"
                                      : "/media/pieces/hero-ring/cards/hol-hero-ring-featured-card-4x5-01.png"
                                  }
                                  alt={`${item.title} supporting still`}
                                  fill
                                  className="object-cover object-center"
                                  sizes="20vw"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#040812]/18 via-transparent to-transparent" />
                              </div>
                            </div>

                            <div
                              className={`absolute bottom-[8%] right-[6%] w-[31%] overflow-hidden rounded-[1.35rem] border border-white/12 bg-white/[0.03] shadow-[0_22px_90px_rgba(0,0,0,0.34)] transition-all duration-[850ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
                                isActive
                                  ? "translate-y-0 opacity-100"
                                  : "translate-y-3 opacity-0"
                              }`}
                            >
                              <div className="relative aspect-[4/5]">
                                <Image
                                  src={item.accentImage}
                                  alt={`${item.title} detail`}
                                  fill
                                  className="object-cover object-center"
                                  sizes="22vw"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#040812]/16 via-transparent to-transparent" />
                              </div>
                            </div>
                          </div>
                        );
                      })}

                      <div className="absolute inset-x-0 bottom-0 z-20 border-t border-white/8 bg-[linear-gradient(180deg,rgba(4,8,18,0),rgba(4,8,18,0.72))] px-5 py-4">
                        <div className="flex items-center justify-between gap-6">
                          <div>
                            <p className="text-[0.68rem] uppercase tracking-[0.22em] text-white/48">
                              {STAGE_ITEMS[activeIndex].stageLabel}
                            </p>
                            <p className="mt-2 text-[0.72rem] uppercase tracking-[0.22em] text-white/34">
                              {STAGE_ITEMS[activeIndex].stageMeta}
                            </p>
                          </div>

                          <div className="flex items-center gap-2">
                            {STAGE_ITEMS.map((item, index) => (
                              <button
                                key={item.id}
                                type="button"
                                onClick={() => setActiveIndex(index)}
                                className={`h-2.5 rounded-full transition-all duration-300 ${
                                  activeIndex === index
                                    ? "w-8 bg-[rgba(228,214,178,0.82)]"
                                    : "w-2.5 bg-white/20 hover:bg-white/36"
                                }`}
                                aria-label={`Open ${item.title}`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 flex items-center justify-between text-[0.68rem] uppercase tracking-[0.22em] text-white/38">
                    <span>Editorial stage</span>
                    <span>{String(activeIndex + 1).padStart(2, "0")} / 03</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
