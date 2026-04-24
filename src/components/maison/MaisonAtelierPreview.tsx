import Image from "next/image";

import { Button } from "@/components/ui/Button";

type MaisonAtelierPreviewProps = {
  title: string;
  lead: string;
  note: string;
  image: string;
  collectionLabel: string;
  collectionHref: string;
  inquiryLabel: string;
  inquiryHref: string;
};

export function MaisonAtelierPreview({
  title,
  lead,
  note,
  image,
  collectionLabel,
  collectionHref,
  inquiryLabel,
  inquiryHref,
}: MaisonAtelierPreviewProps) {
  return (
    <section className="section-divider py-18 sm:py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-6 lg:px-10">
        <div className="surface-frame luxury-card overflow-hidden rounded-[1.8rem]">
          <div className="grid lg:grid-cols-[0.58fr_0.42fr]">
            <div className="luxury-frame relative aspect-[16/10] lg:aspect-auto lg:min-h-[25rem]">
              <Image
                src={image}
                alt={`${title} atelier interior`}
                fill
                sizes="(min-width: 1024px) 42rem, 100vw"
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(2,3,8,0),rgba(2,3,8,0.16))]" />
            </div>

            <div className="flex flex-col justify-center border-t border-white/8 bg-white/[0.018] p-7 sm:p-9 lg:border-l lg:border-t-0 lg:p-12">
              <p className="text-[0.64rem] uppercase tracking-[0.2em] text-white/38">
                Atelier note
              </p>

              <h2 className="mt-4 max-w-[12ch] font-serif text-[2rem] leading-[1.02] tracking-[-0.03em] text-[var(--color-text)] sm:text-[2.35rem]">
                {title}
              </h2>

              <div className="mt-6 space-y-5 text-[0.98rem] leading-7 text-white/64">
                <p>{lead}</p>
                <p>{note}</p>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <Button href={collectionHref}>{collectionLabel}</Button>
                <Button href={inquiryHref} variant="outline">
                  {inquiryLabel}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
