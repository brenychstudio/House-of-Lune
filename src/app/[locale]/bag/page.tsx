import type { Metadata } from "next";

import { FoundationPage } from "@/site/components/FoundationPage";
import { getSiteContent } from "@/site/content";
import { defaultLocale } from "@/site/i18n/config";
import { pageMetadata } from "@/site/seo/metadata";

const intro = getSiteContent(defaultLocale).pages.bag;
export const metadata: Metadata = pageMetadata("Bag", intro.description, "/en/bag");

export default function BagPage() {
  return <FoundationPage intro={intro} />;
}
