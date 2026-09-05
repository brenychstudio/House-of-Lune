import type { MetadataRoute } from "next";

import { siteUrl } from "@/site/seo/metadata";

const routes = [
  "/en",
  "/en/objects",
  "/en/objects/mask-01",
  "/en/collections",
  "/en/atelier",
  "/en/journal",
  "/en/about",
  "/en/private-inquiry",
  "/en/account",
  "/en/bag",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route, index) => ({
    url: `${siteUrl}${route}`,
    changeFrequency: index === 0 ? "weekly" : "monthly",
    priority: index === 0 ? 1 : 0.7,
  }));
}
