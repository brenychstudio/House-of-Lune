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
      <h2 className="font-serif text-[2rem] leading-[1.12] md:text-[2.9rem]">{title}</h2>
      {description ? <p className="mt-5 max-w-2xl text-base text-[var(--color-text-muted)] md:text-lg">{description}</p> : null}
    </div>
  );
}
