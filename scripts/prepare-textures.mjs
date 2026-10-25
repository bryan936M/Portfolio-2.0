import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import nextEnv from "@next/env";
import { createClient } from "@sanity/client";
import { prepareTexture } from "../src/lib/texture-assets.server.mjs";

/** @param {boolean} development */
export async function prepareTextures(development = false) {
  nextEnv.loadEnvConfig(process.cwd(), development);
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "i5u4ixfm";
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
  const client = createClient({
    projectId,
    dataset,
    apiVersion: "2026-10-25",
    perspective: "published",
    useCdn: false,
    timeout: 12000,
  });
  try {
    const covers = await client.fetch(
      '*[_type == "portfolioProject" && featured == true] | order(order asc, title asc)[0...2]{"cover":coalesce(cover.asset->url,coverUrl)}',
    );
    await Promise.all(
      covers
        .filter(({ cover }) => cover)
        .map(({ cover }) => prepareTexture(cover, projectId, dataset)),
    );
    console.log(
      `Prepared ${covers.length} project textures for same-origin delivery.`,
    );
  } catch (error) {
    if (!development && process.env.PORTFOLIO_REQUIRE_CMS !== "false")
      throw error;
    console.warn(
      "Texture preparation is unavailable; retaining cached textures and static covers.",
    );
  }
}

if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
)
  await prepareTextures(process.argv.includes("--dev"));
