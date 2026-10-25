import type { Metadata } from "next";
import { siteOrigin } from "./content";

export function pageMetadata(
  title: string,
  description: string,
  path = "/",
): Metadata {
  const slug = path.match(/^\/work\/([^/]+)\/$/)?.[1];
  return {
    title: { absolute: `${title} — Bryan Murasira` },
    description,
    alternates: {
      canonical: `${siteOrigin}${path}`,
      types: slug
        ? { "text/markdown": `${siteOrigin}/content/${slug}.md` }
        : undefined,
    },
    openGraph: {
      title: `${title} — Bryan Murasira`,
      description,
      url: `${siteOrigin}${path}`,
      type: "website",
      images: [
        {
          url: `${siteOrigin}/images/social-cover.png`,
          width: 1200,
          height: 630,
          alt: "Bryan Murasira — Full-stack software engineer and generative AI engineer",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} — Bryan Murasira`,
      description,
    },
  };
}
