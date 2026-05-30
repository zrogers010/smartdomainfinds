import type { MetadataRoute } from "next";

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // The API is for the app's own use, not for crawlers.
      disallow: "/api/",
    },
    sitemap: `${appUrl}/sitemap.xml`,
    host: appUrl,
  };
}
