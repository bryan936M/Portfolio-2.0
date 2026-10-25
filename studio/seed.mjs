import { getCliClient } from "sanity/cli";
import { readFile } from "node:fs/promises";
import { createReadStream } from "node:fs";
import { fileURLToPath } from "node:url";

const client = getCliClient({ apiVersion: "2026-10-25" });
if (
  client.config().projectId !== "i5u4ixfm" ||
  client.config().dataset !== "production"
)
  throw new Error(
    "Seed is restricted to the selected portfolio project and production dataset.",
  );
const data = JSON.parse(
  await readFile(
    new URL("../src/content/portfolio.json", import.meta.url),
    "utf8",
  ),
);
// IDs containing periods are private paths in Sanity, even in a public dataset.
// Move only the initial importer’s legacy IDs, preserving their content and refs.
const legacyIds = new Map([
  ["portfolio.profile", "portfolio-profile"],
  ...data.projects.map(({ slug }) => [
    `portfolio.project.${slug}`,
    `portfolio-project-${slug}`,
  ]),
  ...data.experiments.map(({ slug }) => [
    `portfolio.experiment.${slug}`,
    `portfolio-experiment-${slug}`,
  ]),
]);
const legacyDocuments = await client
  .withConfig({ perspective: "raw" })
  .getDocuments([...legacyIds.keys()]);
const legacyTransaction = client.transaction();
let legacyCount = 0;
for (const document of legacyDocuments.filter(Boolean)) {
  const { _rev, _createdAt, _updatedAt, ...content } = document;
  const migrated = JSON.parse(JSON.stringify(content), (key, value) =>
    key === "_ref" && legacyIds.has(value) ? legacyIds.get(value) : value,
  );
  migrated._id = legacyIds.get(document._id);
  legacyTransaction.createIfNotExists(migrated).delete(document._id);
  legacyCount++;
}
if (legacyCount) {
  await legacyTransaction.commit();
  console.log(`Moved ${legacyCount} initial documents to public-readable IDs.`);
}
const profile = {
  ...data.profile,
  _id: "portfolio-profile",
  _type: "portfolioProfile",
  portraitUrl: data.profile.portrait,
};
delete profile.portrait;
let portraitSource;
if (
  data.profile.portrait.startsWith(
    "https://cdn.sanity.io/images/i5u4ixfm/production/",
  )
) {
  const response = await fetch(data.profile.portrait, { redirect: "error" });
  if (!response.ok)
    throw new Error(
      "The stored portrait is unavailable; upload a new portrait in Studio before seeding.",
    );
  portraitSource = Buffer.from(await response.arrayBuffer());
} else {
  portraitSource = createReadStream(
    fileURLToPath(
      new URL(`../public${data.profile.portrait}`, import.meta.url),
    ),
  );
}
const portraitAsset = await client.assets.upload("image", portraitSource, {
  filename: "bryan-murasira.jpg",
});
profile.portrait = {
  _type: "image",
  asset: { _type: "reference", _ref: portraitAsset._id },
  alt: "Bryan Murasira",
};
const transaction = client.transaction().createIfNotExists(profile);
for (const [index, project] of data.projects.entries()) {
  const document = {
    ...project,
    _id: `portfolio-project-${project.slug}`,
    _type: "portfolioProject",
    slug: { _type: "slug", current: project.slug },
    coverUrl: project.cover,
    order: index,
  };
  delete document.cover;
  const coverAsset = await client.assets.upload(
    "image",
    createReadStream(
      fileURLToPath(new URL(`../public${project.cover}`, import.meta.url)),
    ),
    { filename: `${project.slug}-cover.svg` },
  );
  document.cover = {
    _type: "image",
    asset: { _type: "reference", _ref: coverAsset._id },
    alt: `${project.title} project cover`,
  };
  document.sections = document.sections.map((section) => {
    if (section.items)
      section = {
        ...section,
        items: section.items.map((item, index) => ({
          ...item,
          _key: `fact-${index}`,
        })),
      };
    if (!section.text) return section;
    const { text, ...rest } = section;
    return {
      ...rest,
      body: [
        {
          _type: "block",
          _key: `${section._key}-body`,
          style: "normal",
          markDefs: [],
          children: [
            { _type: "span", _key: `${section._key}-text`, marks: [], text },
          ],
        },
      ],
    };
  });
  transaction.createIfNotExists(document);
}
for (const [index, experiment] of data.experiments.entries())
  transaction.createIfNotExists({
    ...experiment,
    _id: `portfolio-experiment-${experiment.slug}`,
    _type: "portfolioExperiment",
    slug: { _type: "slug", current: experiment.slug },
    project: {
      _type: "reference",
      _ref: `portfolio-project-${experiment.project}`,
    },
    order: index,
  });
await transaction.commit();
console.log(
  "Created missing portfolio profile, four projects, and two Lab entries. Existing documents were preserved.",
);
