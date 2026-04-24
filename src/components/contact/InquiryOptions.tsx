import { TransitionLink } from "@/components/motion/TransitionLink";
import type { Locale } from "@/i18n/config";
import type { ContactContent } from "@/types/contact";

export function InquiryOptions({
  options,
  lang,
}: {
  options: ContactContent["options"];
  lang: Locale;
}) {
  return (
    <section className="mx-auto max-w-6xl px-5 py-10 sm:px-6 sm:py-12 lg:px-10 lg:py-16">
      <div className="grid gap-10 lg:grid-cols-[0.38fr_0.62fr] lg:gap-16">
        <div className="border-t border-white/8 pt-7">
          <h2 className="font-serif text-[2rem] leading-[1.02] tracking-[-0.03em] text-[var(--color-text)] sm:text-[2.35rem]">
            {options.title}
          </h2>

          <p className="mt-5 max-w-[24rem] text-[0.96rem] leading-7 text-white/62">
            Choose the preferred rhythm of contact and continue into the private
            form.
          </p>
        </div>

        <div className="border-t border-white/8">
          {options.modes.map((mode, index) => (
            <TransitionLink
              key={mode.value}
              href={`/${lang}/contact?type=${mode.value}#private-form`}
              className="group luxury-line-link grid grid-cols-[2.25rem_1fr_auto] gap-4 border-b border-white/8 py-6 hover:border-white/16"
            >
              <span className="pt-1 text-[0.64rem] uppercase tracking-[0.18em] text-white/34">
                {String(index + 1).padStart(2, "0")}
              </span>

              <div>
                <h3 className="font-serif text-[1.34rem] leading-[1.04] tracking-[-0.02em] text-[var(--color-text)] transition-colors duration-[700ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:text-white">
                  {mode.label}
                </h3>

                <p className="mt-2 max-w-[34ch] text-[0.95rem] leading-7 text-white/62">
                  {mode.description}
                </p>
              </div>

              <span className="pt-1 text-[0.9rem] text-white/28 transition-all duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-[2px] group-hover:text-white/58">
                {"\u2198"}
              </span>
            </TransitionLink>
          ))}
        </div>
      </div>
    </section>
  );
}
