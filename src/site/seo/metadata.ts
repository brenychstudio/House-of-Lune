import type { Metadata } from "next";

import { readPublicEnvironment } from "@/platform/config/environment";

const environment = readPublicEnvironment(process.env);

export const siteUrl = environment.siteUrl.toString().replace(/\/$/, "");

export const globalMetadata: Metadata = {
  metadataBase: environment.siteUrl,
  title: {
    default: "BRENYCH — Objects for the Body",
    template: "%s — BRENYCH",
  },
  description:
    "BRENYCH creates founder-led sculptural objects engineered for the body in Barcelona.",
  applicationName: "BRENYCH",
  alternates: { canonical: "/en" },
  robots: environment.indexable
    ? { index: true, follow: true }
    : { index: false, follow: false, noarchive: true },
  openGraph: {
    type: "website",
    siteName: "BRENYCH",
    locale: "en_US",
    title: "BRENYCH — Objects for the Body",
    description: "Sculptural objects engineered for the body.",
    url: "/en",
  },
  twitter: {
    card: "summary_large_image",
    title: "BRENYCH — Objects for the Body",
    description: "Sculptural objects engineered for the body.",
  },
};

export function pageMetadata(title: string, description: string, path: string): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title, description, url: path },
  };
}
