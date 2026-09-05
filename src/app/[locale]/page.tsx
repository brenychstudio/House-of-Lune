import { notFound } from "next/navigation";

import { HomeFoundation } from "@/site/components/HomeFoundation";
import { getSiteContent } from "@/site/content";
import { isLocale } from "@/site/i18n/config";

export default async function HomePage({
  params,
}: Readonly<{ params: Promise<{ locale: string }> }>) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  return <HomeFoundation content={getSiteContent(locale)} />;
}
