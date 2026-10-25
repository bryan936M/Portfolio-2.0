import type { MetadataRoute } from "next";
import { siteOrigin } from "@/lib/content";
export const dynamic = "force-static";
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/studio/"] },
    sitemap: `${siteOrigin}/sitemap.xml`,
  };
}
