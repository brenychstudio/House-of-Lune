import type { Metadata } from "next";

import { FoundationPage } from "@/site/components/FoundationPage";
import { getSiteContent } from "@/site/content";
import { defaultLocale } from "@/site/i18n/config";
import { pageMetadata } from "@/site/seo/metadata";

const intro = getSiteContent(defaultLocale).pages.account;
export const metadata: Metadata = pageMetadata("Collector Space", intro.description, "/en/account");

export default function AccountPage() {
  return <FoundationPage intro={intro} />;
}
