import assert from "node:assert/strict";
import { readFile, access } from "node:fs/promises";

const read = (path) =>
  readFile(new URL(`../out/${path}`, import.meta.url), "utf8");
const banned = [
  "Preview spatial motion",
  "PORTRAIT STUDY",
  "A little room to think",
  "Tech Solutions Inc.",
  "your.email@example.com",
];
const profile = JSON.parse(await read("profile.json"));
const projectSlugs = profile.projects.map((project) =>
  new URL(project.url).pathname.split("/").filter(Boolean).at(-1),
);
for (const route of [
  "",
  "work/",
  "lab/",
  "about/",
  "contact/",
  ...projectSlugs.map((slug) => `work/${slug}/`),
]) {
  const html = await read(`${route}index.html`);
  assert.match(
    html,
    /<h1\b/,
    "Each route needs an HTML heading before client JavaScript runs",
  );
  assert.match(html, /<title>/);
  assert.match(html, /<meta name="description"/);
  for (const phrase of banned)
    assert.ok(
      !html.includes(phrase),
      `${route} contains rejected or placeholder copy: ${phrase}`,
    );
  for (const match of html.matchAll(/href="(\/(?!\/)[^"#?]*)/g)) {
    const href = match[1];
    if (href.startsWith("/_next/")) continue;
    const target = href.endsWith("/")
      ? `${href.slice(1)}index.html`
      : href.slice(1);
    await access(new URL(`../out/${target}`, import.meta.url));
  }
}
const home = await read("index.html");
const texturePaths = [
  ...new Set(home.match(/\/images\/textures\/[a-z0-9-]+\.png/g) || []),
];
for (const path of texturePaths) {
  const png = await readFile(new URL(`../out${path}`, import.meta.url));
  assert.equal(
    png.subarray(0, 8).toString("hex"),
    "89504e470d0a1a0a",
    "Every 3D texture must be a real same-origin PNG included in the static export",
  );
}
assert.ok(
  home.includes(
    `data-texture-count="${Math.min(2, profile.projects.filter((project) => project.featured).length)}"`,
  ),
  "Every selected-work surface needs a prepared same-origin texture",
);
assert.equal(profile.name, "Bryan Murasira");
for (const project of profile.projects) {
  if (project.featured)
    assert.ok(
      home.includes(project.title),
      `Featured project ${project.title} is missing from HTML`,
    );
  const slug = new URL(project.url).pathname.split("/").filter(Boolean).at(-1);
  const markdown = await read(`content/${slug}.md`);
  assert.ok(markdown.includes(project.title));
}
const robots = await read("robots.txt");
assert.ok(robots.includes("Sitemap:"));
const sitemap = await read("sitemap.xml");
const llms = await read("llms.txt");
for (const slug of projectSlugs) {
  assert.ok(sitemap.includes(`/work/${slug}/`));
  assert.ok(llms.includes(`/content/${slug}.md`));
}
await access(new URL("../out/404.html", import.meta.url));
console.log(
  "Verified: HTML routes, real project content, metadata, internal links, 404, sitemap, robots, and agent-readable content.",
);
