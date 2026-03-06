import type { ReactNode } from "react";
import { Eyebrow } from "@/components/ui/Eyebrow";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: ReactNode;
};

export function SectionHeading({ eyebrow, title, description }: SectionHeadingProps) {
  return (
    <div className="max-w-3xl">
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
      <h2 className="font-serif text-3xl leading-tight md:text-4xl">{title}</h2>
      {description ? <p className="mt-5 text-base text-[var(--color-text-muted)] md:text-lg">{description}</p> : null}
    </div>
  );
}
