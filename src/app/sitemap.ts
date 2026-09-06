import type { MetadataRoute } from "next";
import { LIVE_TOOLS } from "@/lib/tools";
import { SUB_ROUTE_REGIONS } from "@/lib/regions";
import { SITE_URL } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { url: `${SITE_URL}/privacy`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
  ];

  const toolPages: MetadataRoute.Sitemap = LIVE_TOOLS.flatMap((tool) => [
    {
      url: `${SITE_URL}${tool.path}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    ...(tool.regional
      ? SUB_ROUTE_REGIONS.map((slug) => ({
          url: `${SITE_URL}${tool.path}/${slug}`,
          lastModified: now,
          changeFrequency: "weekly" as const,
          priority: 0.8,
        }))
      : []),
  ]);

  return [...staticPages, ...toolPages];
}
