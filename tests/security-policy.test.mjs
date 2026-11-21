import test from "node:test";
import assert from "node:assert/strict";
import { evaluateAudit } from "../scripts/security-policy.mjs";

const url = "https://github.com/advisories/GHSA-example";
const packages = { "node_modules/tool": { version: "1.2.3" } };
const exception = { advisory: url, package: "tool", version: "1.2.3", paths: ["node_modules/tool"], expires: "2026-12-21", reason: "Only trusted CLI input reaches this path", evidence: "Reviewed parser call sites" };
function report(severity = "moderate") {
  return { vulnerabilities: { tool: { name: "tool", severity, via: [{ url, severity }], nodes: ["node_modules/tool"] } }, metadata: { vulnerabilities: { total: 1 } } };
}

test("new findings block release and an exact reviewed moderate exception passes", () => {
  assert.equal(evaluateAudit(report(), [], packages, "2026-11-21").failures.length, 1);
  assert.equal(evaluateAudit(report(), [exception], packages, "2026-11-21").failures.length, 0);
});
test("high and critical findings cannot be waived", () => {
  for (const severity of ["high", "critical"]) assert.ok(evaluateAudit(report(severity), [exception], packages, "2026-11-21").failures.length);
});
test("expired, changed-version and changed-path exceptions fail closed", () => {
  assert.ok(evaluateAudit(report(), [exception], packages, "2026-12-22").failures.length);
  assert.ok(evaluateAudit(report(), [exception], { "node_modules/tool": { version: "1.2.4" } }, "2026-11-21").failures.length);
  const changed = report(); changed.vulnerabilities.tool.nodes = ["node_modules/new-parent/node_modules/tool"];
  assert.ok(evaluateAudit(changed, [exception], packages, "2026-11-21").failures.length);
});
test("an unavailable or malformed audit cannot be reported as clean", () => {
  assert.throws(() => evaluateAudit({ error: { code: "ENOTFOUND" } }, [], packages));
  assert.throws(() => evaluateAudit({}, [], packages));
  const incomplete = report(); incomplete.vulnerabilities.tool.via = [];
  assert.ok(evaluateAudit(incomplete, [], packages).failures.length);
});
test("an unresolved package cannot hide behind a separately reviewed finding", () => {
  const partial = report(); partial.vulnerabilities.other = { name: "other", severity: "moderate", via: ["missing"], nodes: ["node_modules/other"] };
  assert.ok(evaluateAudit(partial, [exception], packages, "2026-11-21").failures.length);
});
test("a changed parent invalidates the reachability review", () => {
  const scoped = { ...exception, context: { "node_modules/cli": "2.0.0" } };
  assert.equal(evaluateAudit(report(), [scoped], { ...packages, "node_modules/cli": { version: "2.0.0" } }, "2026-11-21").failures.length, 0);
  assert.ok(evaluateAudit(report(), [scoped], { ...packages, "node_modules/cli": { version: "2.1.0" } }, "2026-11-21").failures.length);
});
