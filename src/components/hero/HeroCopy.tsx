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
    ? "translate-y-0 opacity-100"
    : "translate-y-2 opacity-0";
}

export function HeroCopy({ brandLine, headline, body, primaryCta, secondaryCta, showBrand, showHeadline, showBody, showCtas }: HeroCopyProps) {
  return (
    <>
      <div className={`transition-all duration-[720ms] ease-[cubic-bezier(0.3,1,0.35,1)] ${revealClass(showBrand)}`}>
        <Eyebrow>{brandLine}</Eyebrow>
      </div>
      <h1 className={`max-w-4xl font-serif text-4xl leading-[1.04] transition-all duration-[860ms] ease-[cubic-bezier(0.22,1,0.28,1)] md:text-[4.1rem] ${revealClass(showHeadline)}`}>
        {headline}
      </h1>
      <p
        className={`mt-8 max-w-xl text-lg text-[var(--color-text-muted)] transition-all duration-[900ms] ease-[cubic-bezier(0.3,1,0.35,1)] ${revealClass(showBody)}`}
      >
        {body}
      </p>
      <div className={`mt-12 flex flex-wrap gap-4 transition-all duration-[920ms] ease-[cubic-bezier(0.3,1,0.35,1)] ${revealClass(showCtas)}`}>
        <Button href={primaryCta.href}>{primaryCta.label}</Button>
        <Button href={secondaryCta.href} variant="outline">
          {secondaryCta.label}
        </Button>
      </div>
    </>
  );
}
