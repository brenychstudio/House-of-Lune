"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/Button";

type Chapter = {
  title: string;
  body: string;
  image: string;
  insetImage?: string;
  insetObjectPosition?: string;
};

type CraftEditorialJourneyProps = {
  processTitle: string;
  chapters: Chapter[];
  materialStudyTitle: string;
  materialStudyLine: string;
  materialStudyImage: string;
  precisionTitle: string;
  precisionItems: string[];
  collectionLabel: string;
  collectionHref: string;
  inquiryLabel: string;
  inquiryHref: string;
};

const stageNotes = [
  "Stone response · early reading · first decision",
  "Mount geometry · tension · balance of line",
  "Polish · weight · closure confidence",
];

const HEADER_OFFSET = 72;

function clamp01(value: number) {
  return Math.max(0, Math.min(1, value));
}

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export function CraftEditorialJourney({
  processTitle,
  chapters,
  materialStudyTitle,
  materialStudyLine,
  materialStudyImage,
  precisionTitle,
  precisionItems,
  collectionLabel,
  collectionHref,
  inquiryLabel,
  inquiryHref,
}: CraftEditorialJourneyProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [stageOffset, setStageOffset] = useState(0);

  const sectionRef = useRef<HTMLElement | null>(null);
  const shellRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
    const chapterRefs = useRef<Array<HTMLElement | null>>([]);

  useEffect(() => {
    if (!chapters.length) return;

    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let raf = 0;

    const updateStage = () => {
      const targetLine = window.innerHeight * 0.42;

      let bestIndex = 0;
      let bestDistance = Number.POSITIVE_INFINITY;

      chapterRefs.current.forEach((node, index) => {
        if (!node) return;

        const rect = node.getBoundingClientRect();
        const center = rect.top + rect.height * 0.32;
        const distance = Math.abs(center - targetLine);

        if (distance < bestDistance) {
          bestDistance = distance;
          bestIndex = index;
        }
      });

      setActiveIndex((prev) => (prev === bestIndex ? prev : bestIndex));

      if (media.matches) {
        setStageOffset(0);
        return;
      }

      if (
        !sectionRef.current ||
        !shellRef.current ||
        !panelRef.current ||
        window.innerWidth < 1024
      ) {
        setStageOffset(0);
        return;
      }

      const rect = sectionRef.current.getBoundingClientRect();
      const shellHeight = shellRef.current.clientHeight;
      const panelHeight = panelRef.current.clientHeight;
      const viewportH = window.innerHeight;
      const availableTravel = Math.max(0, shellHeight - panelHeight);

      if (availableTravel <= 0) {
        setStageOffset(0);
        return;
      }

      const totalScrollableDistance = Math.max(
        1,
        rect.height - viewportH + HEADER_OFFSET,
      );

      const passedDistance = Math.min(
        Math.max(HEADER_OFFSET + 48 - rect.top, 0),
        totalScrollableDistance,
      );

      const progress = clamp01(passedDistance / totalScrollableDistance);

      const easedProgress = easeInOutCubic(progress);
      const dampedTravel = availableTravel * 0.72;
      const nextOffset = easedProgress * dampedTravel;

      setStageOffset((prev) =>
        Math.abs(prev - nextOffset) < 0.5 ? prev : nextOffset,
      );
    };

    const requestUpdate = () => {
      cancelAnimationFrame(raf);
      raf = window.requestAnimationFrame(updateStage);
    };

    requestUpdate();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
    };
  }, [chapters.length]);

  if (!chapters.length) return null;

  const activeChapter = chapters[activeIndex];
  const insetImage = activeChapter.insetImage ?? activeChapter.image;
  const insetObjectPosition = activeChapter.insetObjectPosition ?? "50% 50%";

  return (
    <>
      <section
        ref={sectionRef}
        className="section-divider py-16 sm:py-18 lg:py-20"
      >
        <div className="mx-auto max-w-6xl px-5 sm:px-6 lg:px-10">
          <div className="grid gap-10 lg:grid-cols-[0.38fr_0.62fr] lg:gap-12">
            <div>
              <div className="border-t border-white/8 pt-6">
                <h2 className="font-serif text-[2rem] leading-[1.02] tracking-[-0.03em] text-[var(--color-text)] sm:text-[2.45rem]">
                  {processTitle}
                </h2>

                <p className="mt-4 max-w-[24rem] text-[0.96rem] leading-7 text-white/60">
                  Guided as an atelier sequence rather than a checklist.
                </p>
              </div>

              <div className="mt-6">
                {chapters.map((chapter, index) => {
                  const isActive = index === activeIndex;

                  return (
                    <article
                      key={chapter.title}
                      ref={(node) => {
                        chapterRefs.current[index] = node;
                      }}
                      className="border-t border-white/8 py-12 sm:py-14 lg:flex lg:min-h-[72vh] lg:items-center"
                    >
                      <div
                        className={`max-w-[24rem] border-l pl-5 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                          isActive
                            ? "translate-y-0 border-[rgba(207,191,157,0.42)] opacity-100"
                            : "translate-y-3 border-white/10 opacity-40"
                        }`}
                      >
                        <p className="text-[0.64rem] uppercase tracking-[0.2em] text-white/38">
                          {String(index + 1).padStart(2, "0")}
                        </p>

                        <h3 className="mt-3 font-serif text-[1.85rem] leading-[0.98] tracking-[-0.03em] text-[var(--color-text)] sm:text-[2.15rem]">
                          {chapter.title}
                        </h3>

                        <p className="mt-4 max-w-[26ch] text-[0.98rem] leading-7 text-white/68">
                          {chapter.body}
                        </p>
                      </div>

                      <div className="mt-8 overflow-hidden rounded-[1.35rem] border border-white/10 bg-white/[0.02] lg:hidden">
                        <div className="relative aspect-[16/10]">
                          <Image
                            src={chapter.image}
                            alt={chapter.title}
                            fill
                            sizes="100vw"
                            className="object-cover object-center"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#040812]/24 via-transparent to-transparent" />
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>

            <div className="hidden lg:block">
              <div
                ref={shellRef}
                className="lg:sticky lg:top-[72px] lg:h-[calc(100vh-72px)]"
              >
                <div
                  className="transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] lg:will-change-transform"
                  style={{
                    transform: `translate3d(0, ${stageOffset}px, 0)`,
                  }}
                >
                  <div
                    ref={panelRef}
                    className="surface-frame rounded-[1.85rem] p-2.5 sm:p-3"
                  >
                    <div className="relative aspect-[4/5] overflow-hidden rounded-[1.45rem] bg-[#05070c] lg:aspect-[5/6]">
                      {chapters.map((chapter, index) => (
                        <div
                          key={chapter.title}
                          className={`absolute inset-0 transition-all duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
                            index === activeIndex
                              ? "scale-100 opacity-100"
                              : "pointer-events-none scale-[1.015] opacity-0"
                          }`}
                        >
                          <Image
                            src={chapter.image}
                            alt={chapter.title}
                            fill
                            sizes="(min-width: 1024px) 42rem, 100vw"
                            className="object-cover object-center"
                          />
                        </div>
                      ))}

                      <div className="absolute left-4 top-4 z-20 hidden w-[30%] overflow-hidden rounded-[1rem] border border-white/12 bg-[#05070c] shadow-[0_18px_46px_rgba(0,0,0,0.34)] sm:block">
                        <div className="relative aspect-[16/10]">
                          <Image
                            src={insetImage}
                            alt={`${activeChapter.title} inset`}
                            fill
                            sizes="240px"
                            className="object-cover object-center"
                            style={{ objectPosition: insetObjectPosition }}
                          />
                        </div>
                      </div>

                      <div className="absolute inset-x-0 bottom-0 z-20 border-t border-white/10 bg-[rgba(4,6,12,0.62)] px-4 py-4 sm:px-5">
                        <div className="flex items-end justify-between gap-4">
                          <div>
                            <p className="text-[0.62rem] uppercase tracking-[0.2em] text-white/34">
                              Editorial stage
                            </p>

                            <p className="mt-2 font-serif text-[1.18rem] leading-[1.02] tracking-[-0.02em] text-[var(--color-text)] sm:text-[1.3rem]">
                              {activeChapter.title}
                            </p>

                            <p className="mt-1 max-w-[28ch] text-[0.82rem] leading-6 text-white/54">
                              {stageNotes[activeIndex] ?? stageNotes[0]}
                            </p>
                          </div>

                          <div className="flex items-center gap-2">
                            {chapters.map((chapter, index) => (
                              <span
                                key={`${chapter.title}-dot`}
                                className={`h-1.5 rounded-full transition-all duration-500 ${
                                  index === activeIndex
                                    ? "w-6 bg-[var(--color-accent)]"
                                    : "w-1.5 bg-white/22"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between text-[0.66rem] uppercase tracking-[0.18em] text-white/34">
                      <span>Guided atelier sequence</span>
                      <span>
                        {String(activeIndex + 1).padStart(2, "0")} /{" "}
                        {String(chapters.length).padStart(2, "0")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-divider py-24 sm:py-28 lg:py-32">
        <div className="mx-auto max-w-6xl px-5 sm:px-6 lg:px-10">
          <div className="grid gap-14 lg:grid-cols-[0.36fr_0.64fr] lg:items-center lg:gap-16">
            <div className="border-t border-white/8 pt-9 lg:pr-6">
              <p className="text-[0.64rem] uppercase tracking-[0.2em] text-white/38">
                Material proof
              </p>

              <h2 className="mt-3 font-serif text-[2rem] leading-[1.02] tracking-[-0.03em] text-[var(--color-text)] sm:text-[2.35rem]">
                {materialStudyTitle}
              </h2>

              <p className="mt-6 max-w-[27rem] text-[1rem] leading-8 text-white/68">
                {materialStudyLine}
              </p>
            </div>

            <div className="surface-frame overflow-hidden rounded-[1.9rem] p-4 sm:p-5">
              <div className="relative aspect-[16/10] overflow-hidden rounded-[1.45rem] lg:aspect-[16/8.8]">
                <Image
                  src={materialStudyImage}
                  alt={materialStudyTitle}
                  fill
                  sizes="(min-width: 1024px) 48rem, 100vw"
                  className="object-cover object-center"
                />
                <div className="absolute inset-x-0 bottom-0 border-t border-white/10 bg-[rgba(4,6,12,0.48)] px-4 py-4 sm:px-5">
                  <p className="text-[0.62rem] uppercase tracking-[0.2em] text-white/48">
                    Macro study · edge · grain · light return
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-divider py-16 sm:py-18 lg:py-20">
        <div className="mx-auto max-w-6xl px-5 sm:px-6 lg:px-10">
          <div className="grid gap-8 lg:grid-cols-[0.34fr_0.66fr] lg:gap-12">
            <div className="border-t border-white/8 pt-6">
              <p className="text-[0.64rem] uppercase tracking-[0.2em] text-white/38">
                Closing proof
              </p>

              <h2 className="mt-3 font-serif text-[2rem] leading-[1.02] tracking-[-0.03em] text-[var(--color-text)] sm:text-[2.35rem]">
                {precisionTitle}
              </h2>
            </div>

            <div className="border-t border-white/8">
              {precisionItems.map((item, index) => (
                <div
                  key={item}
                  className="grid grid-cols-[2.2rem_1fr] gap-4 border-b border-white/8 py-4"
                >
                  <span className="pt-[0.15rem] text-[0.64rem] uppercase tracking-[0.2em] text-white/36">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <p className="max-w-[42ch] text-[0.96rem] leading-7 text-white/68">
                    {item}
                  </p>
                </div>
              ))}

              <div className="flex flex-col gap-3 pt-6 sm:flex-row">
                <Button href={collectionHref}>{collectionLabel}</Button>
                <Button href={inquiryHref} variant="outline">
                  {inquiryLabel}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
