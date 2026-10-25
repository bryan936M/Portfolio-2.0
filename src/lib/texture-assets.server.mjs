import { mkdir, rename, stat, writeFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import { join } from "node:path";
import sharp from "sharp";

const pending = new Map();

/**
 * Mirror only immutable image assets from this portfolio's public Sanity dataset.
 * The browser receives an ordinary same-origin PNG URL, never a CDN texture URL.
 * @param {string} source
 * @param {string} projectId
 * @param {string} dataset
 * @returns {Promise<string | undefined>}
 */
export async function prepareTexture(source, projectId, dataset) {
  if (source.startsWith("/") && !source.startsWith("//")) return source;
  const url = new URL(source);
  const prefix = `/images/${projectId}/${dataset}/`;
  if (
    url.origin !== "https://cdn.sanity.io" ||
    !url.pathname.startsWith(prefix) ||
    url.search ||
    url.hash
  )
    return undefined;
  const asset = url.pathname.slice(prefix.length);
  if (!/^[a-f0-9]{40}-\d+x\d+\.(svg|jpg|jpeg|png|webp|avif|gif)$/.test(asset))
    return undefined;
  const path = `/images/textures/${asset.replace(".", "-")}.png`;
  const file = join(process.cwd(), "public", path);
  if (
    await stat(file)
      .then((info) => info.size > 0)
      .catch(() => false)
  )
    return path;
  if (pending.has(source)) return pending.get(source);

  const work = (async () => {
    const response = await fetch(source, {
      redirect: "error",
      signal: AbortSignal.timeout(20000),
    });
    if (!response.ok)
      throw new Error(`Texture download failed (${response.status}): ${asset}`);
    if (Number(response.headers.get("content-length")) > 20 * 1024 * 1024)
      throw new Error(`Texture exceeds the 20MB source limit: ${asset}`);
    const bytes = Buffer.from(await response.arrayBuffer());
    if (bytes.length > 20 * 1024 * 1024)
      throw new Error(`Texture exceeds the 20MB source limit: ${asset}`);
    const png = await sharp(bytes, { limitInputPixels: 36000000 })
      .resize({
        width: 1600,
        height: 1600,
        fit: "inside",
        withoutEnlargement: true,
      })
      .png()
      .toBuffer();
    await mkdir(join(process.cwd(), "public/images/textures"), {
      recursive: true,
    });
    const temporary = `${file}.${randomUUID()}.tmp`;
    await writeFile(temporary, png);
    await rename(temporary, file);
    return path;
  })();
  pending.set(source, work);
  try {
    return await work;
  } finally {
    pending.delete(source);
  }
}
