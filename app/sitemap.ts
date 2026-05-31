import type { MetadataRoute } from "next";

import { NICHES } from "@/lib/content/niches";
import { TLDS } from "@/lib/content/tlds";
import { TOOLS } from "@/lib/content/tools";

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: appUrl, lastModified: now, changeFrequency: "weekly", priority: 1 },
    {
      url: `${appUrl}/business-name-ideas`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${appUrl}/domains`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${appUrl}/tools`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  const nichePages: MetadataRoute.Sitemap = NICHES.map((niche) => ({
    url: `${appUrl}/business-name-ideas/${niche.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const tldPages: MetadataRoute.Sitemap = TLDS.map((tld) => ({
    url: `${appUrl}/domains/${tld.tld}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const toolPages: MetadataRoute.Sitemap = TOOLS.map((tool) => ({
    url: `${appUrl}/tools/${tool.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticPages, ...nichePages, ...tldPages, ...toolPages];
}
