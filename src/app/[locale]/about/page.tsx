import type { Metadata } from "next";

import { FoundationPage } from "@/site/components/FoundationPage";
import { getSiteContent } from "@/site/content";
import { defaultLocale } from "@/site/i18n/config";
import { pageMetadata } from "@/site/seo/metadata";

const intro = getSiteContent(defaultLocale).pages.about;
export const metadata: Metadata = pageMetadata("About", intro.description, "/en/about");

export default function AboutPage() {
  return <FoundationPage intro={intro} />;
}
