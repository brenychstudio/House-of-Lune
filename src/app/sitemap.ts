import type { MetadataRoute } from "next";

import { featuredPieces } from "@/content/pieces";
import { locales } from "@/i18n/config";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://house-of-lune.vercel.app";
const coreRoutes = ["", "/collection", "/maison", "/craftsmanship", "/journal", "/contact"] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const staticEntries: MetadataRoute.Sitemap = locales.flatMap((lang) =>
    coreRoutes.map((route) => ({
      url: `${baseUrl}/${lang}${route}`,
      lastModified: new Date(),
      changeFrequency: route === "" ? "weekly" : "monthly",
      priority: route === "" ? 1 : 0.7,
    })),
  );

  const pieceEntries: MetadataRoute.Sitemap = locales.flatMap((lang) =>
    featuredPieces.map((piece) => ({
      url: `${baseUrl}/${lang}/piece/${piece.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.65,
    })),
  );

  return [...staticEntries, ...pieceEntries];
}
