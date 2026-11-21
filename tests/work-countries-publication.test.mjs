import test from "node:test";
import assert from "node:assert/strict";
import { planCountryPublication } from "../studio/work-countries-publication.mjs";

const published = { _id: "portfolio-profile", _type: "portfolioProfile", _rev: "published-revision", name: "Bryan", email: "example@example.com" };
const draft = { ...published, _id: "drafts.portfolio-profile", _rev: "draft-revision", workCountries: ["RW", "BJ", "ZM"] };

test("only a draft matching the published content and confirmed countries can be cleared", () => {
  const plan = planCountryPublication(published, draft);
  assert.equal(plan.action, "publish");
  assert.equal(plan.clearMatchingDraft, true);
  assert.equal(plan.publishedRevision, "published-revision");
  assert.equal(plan.draftRevision, "draft-revision");
});
test("unrelated profile drafts are preserved", () => {
  const plan = planCountryPublication(published, { ...draft, email: "changed@example.com" });
  assert.equal(plan.clearMatchingDraft, false);
  assert.deepEqual(plan.unrelatedDraftFields, ["email"]);
});
test("a different or deliberately empty draft country list is preserved", () => {
  for (const countries of [[], ["KE"]]) assert.equal(planCountryPublication(published, { ...draft, workCountries: countries }).clearMatchingDraft, false);
});
test("existing published country edits require review and an identical release is idempotent", () => {
  assert.throws(() => planCountryPublication({ ...published, workCountries: [] }, draft));
  assert.equal(planCountryPublication({ ...published, workCountries: ["RW", "BJ", "ZM"] }, draft).action, "already-published");
});
test("missing revisions or unexpected documents cannot be published", () => {
  assert.throws(() => planCountryPublication({ ...published, _rev: undefined }, draft));
  assert.throws(() => planCountryPublication(published, { ...draft, _id: "some-other-draft" }));
});
