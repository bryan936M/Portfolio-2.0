import { getCliClient } from "sanity/cli";
import { mkdir, writeFile } from "node:fs/promises";
import { isAbsolute, join } from "node:path";
import { confirmedCountries, planCountryPublication } from "./work-countries-publication.mjs";

const client = getCliClient({ apiVersion: "2026-10-25" }).withConfig({ perspective: "raw" });
if (client.config().projectId !== "i5u4ixfm" || client.config().dataset !== "production") throw new Error("This release is restricted to Bryan’s portfolio production dataset.");
const mode = process.env.PORTFOLIO_COUNTRIES_ACTION || "inspect";
if (!["inspect", "publish"].includes(mode)) throw new Error("Use inspect or publish.");
const [published, draft] = await client.getDocuments(["portfolio-profile", "drafts.portfolio-profile"]);
const plan = planCountryPublication(published, draft);
if (mode === "publish" && plan.action === "publish") {
  const directory = process.env.PORTFOLIO_RECOVERY_DIRECTORY;
  if (!directory || !isAbsolute(directory)) throw new Error("Provide an absolute private recovery directory before publishing.");
  await mkdir(directory, { recursive: true, mode: 0o700 });
  const backup = join(directory, `profile-publication-${new Date().toISOString().replace(/[:.]/g, "-")}.json`);
  await writeFile(backup, JSON.stringify({ published, draft }, null, 2), { mode: 0o600, flag: "wx" });
  const transaction = client.transaction().patch(published._id, patch => patch.ifRevisionId(plan.publishedRevision).set({ workCountries: confirmedCountries }));
  if (plan.clearMatchingDraft) transaction.patch(draft._id, patch => patch.ifRevisionId(plan.draftRevision).set({ workCountries: confirmedCountries })).delete(draft._id);
  await transaction.commit();
  console.log(JSON.stringify({ published: true, countries: confirmedCountries, matchingDraftCleared: plan.clearMatchingDraft, preservedDraftFields: plan.unrelatedDraftFields, backup }));
} else console.log(JSON.stringify({ mode, ...plan, countries: confirmedCountries }));
