import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { cache } from "react";
import { storefrontObject, catalogMarket } from "@/site/catalog/gateway";

import { ObjectFoundationPage } from "@/site/components/ObjectFoundationPage";
import { getSiteContent } from "@/site/content";
import { defaultLocale } from "@/site/i18n/config";
import { pageMetadata } from "@/site/seo/metadata";

const content = getSiteContent(defaultLocale);

const loadObject = cache(storefrontObject);
type RouteProps = Readonly<{ params: Promise<{ slug: string }>; searchParams: Promise<{ market?: string | string[] }> }>;

export async function generateMetadata({ params, searchParams }: RouteProps): Promise<Metadata> {
  await connection();
  const { slug } = await params;
  const result = await loadObject(slug, catalogMarket((await searchParams).market));
  const canonical = result.state === "READY" ? result.data : null;
  const title = canonical?.name ?? (slug === content.object.slug ? content.object.name : "Objects");
  const description = slug === content.object.slug ? content.object.descriptor : "BRENYCH wearable sculptural objects.";
  return pageMetadata(title, description, `/en/objects/${slug}`);
}

export default async function ObjectPage({
  params, searchParams,
}: RouteProps) {
  await connection();
  const { slug } = await params;
  const result = await loadObject(slug, catalogMarket((await searchParams).market));
  if (slug !== content.object.slug && (result.state !== "READY" || !result.data)) notFound();
  return <ObjectFoundationPage object={content.object} result={result} />;
}
