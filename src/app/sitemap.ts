import type { MetadataRoute } from "next";
import { getPortfolio, siteOrigin } from "@/lib/content";
export const dynamic = "force-static";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { projects } = await getPortfolio();
  return [
    "",
    "work",
    "lab",
    "about",
    "contact",
    ...projects.map((project) => `work/${project.slug}`),
  ].map((path) => ({
    url: `${siteOrigin}/${path}${path ? "/" : ""}`,
    changeFrequency: "monthly",
    priority: path ? 0.7 : 1,
  }));
}
