import type { Metadata } from "next";

import { FoundationPage } from "@/site/components/FoundationPage";
import { getSiteContent } from "@/site/content";
import { defaultLocale } from "@/site/i18n/config";
import { pageMetadata } from "@/site/seo/metadata";

const intro = getSiteContent(defaultLocale).pages.journal;
export const metadata: Metadata = pageMetadata("Journal", intro.description, "/en/journal");

export default function JournalPage() {
  return <FoundationPage intro={intro} />;
}
