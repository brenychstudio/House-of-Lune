import { notFound } from "next/navigation";

import { PageShell } from "@/components/layout/PageShell";
import { isValidLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";

export default async function CraftsmanshipPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isValidLocale(lang)) notFound();
  const dictionary = await getDictionary(lang);

  return (
    <PageShell dictionary={dictionary} lang={lang}>
      <section className="mx-auto max-w-6xl px-6 py-24 lg:px-10">
        <p className="text-xs uppercase tracking-[0.14em] text-[var(--color-text-muted)]">{dictionary.pages.placeholderLabel}</p>
        <h1 className="mt-4 font-serif text-4xl">{dictionary.pages.craftsmanship.title}</h1>
        <p className="mt-4 max-w-2xl text-[var(--color-text-muted)]">{dictionary.pages.craftsmanship.description}</p>
      </section>
    </PageShell>
  );
}
