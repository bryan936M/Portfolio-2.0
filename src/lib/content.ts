import { cache } from "react";
import { createClient } from "@sanity/client";
import seed from "@/content/portfolio.json";
import type { Portfolio, Profile, Project, Experiment } from "@/content/types";
import { prepareTexture } from "@/lib/texture-assets.server.mjs";

export const sanityProjectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "i5u4ixfm";
export const sanityDataset =
  process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const vercelHost =
  process.env.VERCEL_ENV === "preview"
    ? process.env.VERCEL_BRANCH_URL || process.env.VERCEL_URL
    : process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;
export const siteOrigin = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  (vercelHost ? `https://${vercelHost}` : "http://localhost:3000")
).replace(/\/$/, "");

const client = createClient({
  projectId: sanityProjectId,
  dataset: sanityDataset,
  apiVersion: "2026-10-25",
  useCdn: false,
  perspective: "published",
  timeout: 12000,
  maxRetries: 1,
});
const sectionProjection = `..., image{alt,caption,"url":asset->url},images[]{alt,caption,"url":asset->url}`;
const query = `{
  "profile": *[_type == "portfolioProfile"][0]{...,"portrait":coalesce(portrait.asset->url,portraitUrl)},
  "projects": *[_type == "portfolioProject"] | order(order asc, title asc){...,"slug":slug.current,"cover":coalesce(cover.asset->url,coverUrl),"sections":sections[]{${sectionProjection}}},
  "experiments": *[_type == "portfolioExperiment"] | order(order asc){...,"slug":slug.current,"project":project->slug.current}
}`;

export function safeUrl(value: string | undefined, fallback = ""): string {
  if (!value) return fallback;
  if (value.startsWith("/") && !value.startsWith("//")) return value;
  try {
    const url = new URL(value);
    return ["https:", "http:"].includes(url.protocol) ? url.href : fallback;
  } catch {
    return fallback;
  }
}

export const getPortfolio = cache(async (): Promise<Portfolio> => {
  let remote:
    | {
        profile: Partial<Profile> | null;
        projects: Project[];
        experiments: Experiment[];
      }
    | undefined;
  try {
    // One request tag per build gives every generated route the same cache key,
    // without restoring an older build's content from Next's persistent cache.
    remote = await client.fetch(
      query,
      {},
      {
        tag: process.env.PORTFOLIO_BUILD_ID
          ? `portfolio-build-${process.env.PORTFOLIO_BUILD_ID}`
          : undefined,
      },
    );
  } catch (error) {
    // Never silently replace an established CMS with seed content during publishing.
    if (
      process.env.PORTFOLIO_REQUIRE_CMS === "true" ||
      (process.env.NODE_ENV === "production" &&
        process.env.PORTFOLIO_REQUIRE_CMS !== "false")
    )
      throw error;
    console.warn(
      "Sanity is unavailable; serving the checked-in portfolio content.",
    );
  }
  const profile = {
    ...seed.profile,
    ...Object.fromEntries(
      Object.entries(remote?.profile || {}).filter(
        ([, value]) => value !== null && value !== undefined && value !== "",
      ),
    ),
  } as Profile;
  profile.portrait = safeUrl(profile.portrait, seed.profile.portrait);
  profile.github = safeUrl(profile.github, seed.profile.github);
  profile.linkedin = safeUrl(profile.linkedin, seed.profile.linkedin);
  const hasCmsContent = Boolean(remote?.profile || remote?.projects?.length);
  const projects: Project[] = (
    hasCmsContent ? remote!.projects : (seed.projects as Project[])
  )
    .filter(
      (project) =>
        project.slug &&
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(project.slug) &&
        project.title,
    )
    .map((project) => ({
      ...project,
      cover: safeUrl(project.cover, "/images/social-cover.svg"),
      website: safeUrl(project.website) || undefined,
      sections: project.sections || [],
      stack: project.stack || [],
    }));
  await Promise.all(
    projects
      .filter((project) => project.featured)
      .slice(0, 2)
      .map(async (project) => {
        try {
          project.texture = await prepareTexture(
            project.cover,
            sanityProjectId,
            sanityDataset,
          );
        } catch (error) {
          if (process.env.NODE_ENV === "production") throw error;
          console.warn(
            "A project texture could not be prepared; retaining its static cover.",
          );
        }
      }),
  );
  return {
    profile,
    projects,
    experiments: hasCmsContent ? remote!.experiments : seed.experiments,
  };
});

export function projectMarkdown(project: Project): string {
  const sections = project.sections.map((section) => {
    const paragraphs =
      section.text ||
      section.body
        ?.map((block) =>
          "children" in block
            ? block.children
                .map((child) => ("text" in child ? child.text : ""))
                .join("")
            : "",
        )
        .join("\n\n") ||
      "";
    const facts =
      section.items
        ?.map((item) => `- ${item.label}: ${item.value}`)
        .join("\n") || "";
    const images = (section.images || (section.image ? [section.image] : []))
      .map((image) => `![${image.alt}](${image.url})`)
      .join("\n");
    return [
      section.heading ? `## ${section.heading}` : "",
      paragraphs,
      facts,
      images,
    ]
      .filter(Boolean)
      .join("\n\n");
  });
  return [
    `# ${project.title}`,
    project.category,
    project.summary,
    `Technologies: ${project.stack.join(", ")}`,
    ...sections,
    project.website ? `Project: ${project.website}` : "",
  ]
    .filter(Boolean)
    .join("\n\n");
}
