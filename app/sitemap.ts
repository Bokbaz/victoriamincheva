import type { MetadataRoute } from "next";

import { getSiteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();

  return [
    {
      url: siteUrl,
      lastModified: new Date("2026-08-02"),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteUrl}/legal`,
      lastModified: new Date("2026-08-02"),
      changeFrequency: "yearly",
      priority: 0.2,
    },
  ];
}
