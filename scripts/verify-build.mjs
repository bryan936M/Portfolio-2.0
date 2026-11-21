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
for (const section of ["about-bryan", "selected-work", "inside-lab"]) {
  assert.ok(home.includes(`id="${section}"`), `Homepage chapter ${section} is missing`);
}
assert.match(home, /<details\b/, "Expandable content must be present in generated HTML");
assert.equal(profile.name, "Bryan Murasira");
assert.ok(Array.isArray(profile.workCountries), "Work countries must be available to online agents");
for (const country of profile.workCountries) {
  assert.match(country.code, /^[A-Z]{2}$/);
  assert.ok(country.name);
  assert.ok(home.includes(`data-work-country="${country.code}"`), `${country.name} needs a server-rendered country control`);
}
if (profile.workCountries.length) {
  assert.ok(home.includes("Where I’ve"));
  const globe = JSON.parse(await read("models/work-globe.json"));
  assert.ok(globe.positions.length > 0 && globe.positions.length % 3 === 0);
  assert.ok(globe.indices.every(index => Number.isInteger(index) && index >= 0 && index < globe.positions.length / 3));
} else assert.ok(!home.includes('class="work-locations"'), "An empty country list must hide the globe");
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
