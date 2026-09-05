import { redirect } from "next/navigation";

import { defaultLocale } from "@/site/i18n/config";

export default function RootRedirectPage() {
  redirect(`/${defaultLocale}`);
}
