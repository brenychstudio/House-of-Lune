import type { Metadata } from "next";

import { FoundationPage } from "@/site/components/FoundationPage";
import { getSiteContent } from "@/site/content";
import { defaultLocale } from "@/site/i18n/config";
import { pageMetadata } from "@/site/seo/metadata";

const intro = getSiteContent(defaultLocale).pages.privateInquiry;
export const metadata: Metadata = pageMetadata(
  "Private Inquiry",
  intro.description,
  "/en/private-inquiry",
);

export default function PrivateInquiryPage() {
  return <FoundationPage intro={intro} />;
}
