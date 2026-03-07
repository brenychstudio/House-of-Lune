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

export function MaisonAtelierPreview({ title, lead, note, image, collectionLabel, collectionHref, inquiryLabel, inquiryHref }: MaisonAtelierPreviewProps) {
  return (
    <section className="section-divider py-20">
      <div className="mx-auto max-w-6xl px-6 lg:px-10">
        <div className="surface-frame overflow-hidden rounded-2xl">
          <div className="grid gap-0 lg:grid-cols-[1.1fr_1fr]">
            <div className="relative aspect-[4/3] lg:aspect-auto">
              <Image src={image} alt="Atelier interior" fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover opacity-76" />
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(2,3,8,0.2),rgba(2,3,8,0.5))]" />
            </div>
            <div className="p-8 lg:p-10">
              <h2 className="font-serif text-3xl">{title}</h2>
              <p className="mt-4 text-[var(--color-text-muted)]">{lead}</p>
              <p className="mt-4 text-[var(--color-text-muted)]">{note}</p>
              <div className="mt-7 flex flex-wrap gap-3">
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
