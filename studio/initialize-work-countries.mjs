import { getCliClient } from "sanity/cli";
import { readFile } from "node:fs/promises";

const client = getCliClient({ apiVersion: "2026-10-25" }).withConfig({ perspective: "raw" });
if (client.config().projectId !== "i5u4ixfm" || client.config().dataset !== "production") throw new Error("This initializer is restricted to Bryan’s portfolio.");
const seed = JSON.parse(await readFile(new URL("../src/content/portfolio.json", import.meta.url), "utf8"));
const [published, draft] = await client.getDocuments(["portfolio-profile", "drafts.portfolio-profile"]);
if (!published && !draft) throw new Error("Create the portfolio profile before initializing work countries.");
if (draft?.workCountries !== undefined || (!draft && published?.workCountries !== undefined)) {
  console.log("Work countries are already configured. Existing content was preserved.");
} else {
  const { _rev, _createdAt, _updatedAt, ...profile } = draft || published;
  await client.transaction()
    .createIfNotExists({ ...profile, _id: "drafts.portfolio-profile" })
    .patch("drafts.portfolio-profile", patch => patch.setIfMissing({ workCountries: published?.workCountries ?? seed.profile.workCountries }))
    .commit();
  console.log("Initialized work countries in the profile draft. No content was published.");
}
