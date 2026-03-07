import { notFound } from "next/navigation";

import { CollectionGrid } from "@/components/collection/CollectionGrid";
import { CollectionHero } from "@/components/collection/CollectionHero";
import { PageShell } from "@/components/layout/PageShell";
import { isValidLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";

export default async function CollectionPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isValidLocale(lang)) notFound();

  const dictionary = await getDictionary(lang);

  return (
    <PageShell dictionary={dictionary} lang={lang}>
      <CollectionHero dictionary={dictionary} />
      <CollectionGrid lang={lang} dictionary={dictionary} />
    </PageShell>
  );
}
