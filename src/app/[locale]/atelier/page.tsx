import type { Metadata } from "next";

import { FoundationPage } from "@/site/components/FoundationPage";
import { getSiteContent } from "@/site/content";
import { defaultLocale } from "@/site/i18n/config";
import { pageMetadata } from "@/site/seo/metadata";

const intro = getSiteContent(defaultLocale).pages.atelier;
export const metadata: Metadata = pageMetadata("Atelier", intro.description, "/en/atelier");

export default function AtelierPage() {
  return <FoundationPage intro={intro} />;
}
