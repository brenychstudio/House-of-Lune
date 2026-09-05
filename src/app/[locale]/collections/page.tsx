import type { Metadata } from "next";

import { FoundationPage } from "@/site/components/FoundationPage";
import { getSiteContent } from "@/site/content";
import { defaultLocale } from "@/site/i18n/config";
import { pageMetadata } from "@/site/seo/metadata";

const intro = getSiteContent(defaultLocale).pages.collections;
export const metadata: Metadata = pageMetadata("Collections", intro.description, "/en/collections");

export default function CollectionsPage() {
  return <FoundationPage intro={intro} />;
}
