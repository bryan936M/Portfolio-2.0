import { isDeepStrictEqual } from "node:util";

export const confirmedCountries = ["RW", "BJ", "ZM"];

export function planCountryPublication(published, draft) {
  if (published?._id !== "portfolio-profile" || published?._type !== "portfolioProfile" || !published._rev) throw new Error("Expected the existing published portfolio profile and revision.");
  if (draft && (draft._id !== "drafts.portfolio-profile" || draft._type !== "portfolioProfile" || !draft._rev)) throw new Error("Unexpected profile draft.");
  if (published.workCountries != null && !isDeepStrictEqual(published.workCountries, confirmedCountries)) throw new Error("Published work countries changed; review them before releasing this field.");
  const ignored = new Set(["_id", "_rev", "_type", "_createdAt", "_updatedAt", "workCountries"]);
  const unrelatedDraftFields = draft ? [...new Set([...Object.keys(published), ...Object.keys(draft)])].filter(key => !ignored.has(key) && !isDeepStrictEqual(published[key], draft[key])) : [];
  return {
    action: isDeepStrictEqual(published.workCountries, confirmedCountries) ? "already-published" : "publish",
    publishedRevision: published._rev,
    draftRevision: draft?._rev,
    clearMatchingDraft: Boolean(draft && !unrelatedDraftFields.length && isDeepStrictEqual(draft.workCountries, confirmedCountries)),
    unrelatedDraftFields,
  };
}
