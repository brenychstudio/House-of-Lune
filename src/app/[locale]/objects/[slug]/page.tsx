import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ObjectFoundationPage } from "@/site/components/ObjectFoundationPage";
import { getSiteContent } from "@/site/content";
import { defaultLocale } from "@/site/i18n/config";
import { pageMetadata } from "@/site/seo/metadata";

const content = getSiteContent(defaultLocale);

export const metadata: Metadata = pageMetadata(
  content.object.name,
  content.object.descriptor,
  "/en/objects/mask-01",
);

export function generateStaticParams() {
  return [{ slug: content.object.slug }];
}

export default async function ObjectPage({
  params,
}: Readonly<{ params: Promise<{ slug: string }> }>) {
  const { slug } = await params;

  if (slug !== content.object.slug) {
    notFound();
  }

  return <ObjectFoundationPage object={content.object} />;
}
