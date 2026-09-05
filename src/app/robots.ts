import type { MetadataRoute } from "next";

import { readPublicEnvironment } from "@/platform/config/environment";
import { siteUrl } from "@/site/seo/metadata";

export default function robots(): MetadataRoute.Robots {
  const { indexable } = readPublicEnvironment(process.env);

  return {
    rules: indexable
      ? { userAgent: "*", allow: "/" }
      : { userAgent: "*", disallow: "/" },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
