import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";

type HeroCopyProps = {
  brandLine: string;
  headline: string;
  body: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  showBrand: boolean;
  showHeadline: boolean;
  showBody: boolean;
  showCtas: boolean;
};

function revealClass(show: boolean) {
  return show
    ? "translate-y-0 opacity-100 blur-0"
    : "translate-y-[14px] opacity-0 blur-[14px]";
}

export function HeroCopy({
  brandLine,
  headline,
  body,
  primaryCta,
  secondaryCta,
  showBrand,
  showHeadline,
  showBody,
  showCtas,
}: HeroCopyProps) {
  return (
    <>
      <div
        className={`transition-all duration-[1250ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${revealClass(showBrand)}`}
      >
        <Eyebrow>{brandLine}</Eyebrow>
      </div>

      <h1
        className={`max-w-4xl font-serif text-[2.35rem] leading-[1.06] transition-all duration-[1450ms] ease-[cubic-bezier(0.22,1,0.36,1)] sm:text-[2.75rem] md:text-[4.1rem] ${revealClass(showHeadline)}`}
      >
        {headline}
      </h1>

      <p
        className={`mt-6 max-w-xl text-base text-[var(--color-text-muted)] transition-all duration-[1500ms] ease-[cubic-bezier(0.22,1,0.36,1)] sm:mt-8 sm:text-lg ${revealClass(showBody)}`}
      >
        {body}
      </p>

      <div
        className={`mt-9 flex flex-wrap gap-3 transition-all duration-[1320ms] ease-[cubic-bezier(0.22,1,0.36,1)] sm:mt-12 sm:gap-4 ${revealClass(showCtas)}`}
      >
        <Button href={primaryCta.href}>{primaryCta.label}</Button>
        <Button href={secondaryCta.href} variant="outline">
          {secondaryCta.label}
        </Button>
      </div>
    </>
  );
}
