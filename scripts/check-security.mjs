import { spawnSync } from "node:child_process";
import { readFile } from "node:fs/promises";
import { evaluateAudit } from "./security-policy.mjs";

const result = process.env.npm_execpath
  ? spawnSync(process.execPath, [process.env.npm_execpath, "audit", "--json"], { encoding: "utf8", maxBuffer: 10 * 1024 * 1024 })
  : spawnSync("npm", ["audit", "--json"], { encoding: "utf8", maxBuffer: 10 * 1024 * 1024 });
try {
  if (result.error || result.signal || ![0, 1].includes(result.status)) throw new Error("npm audit did not complete successfully.");
  const report = JSON.parse(result.stdout);
  const policy = JSON.parse(await readFile(new URL("../security-exceptions.json", import.meta.url), "utf8"));
  const lock = JSON.parse(await readFile(new URL("../package-lock.json", import.meta.url), "utf8"));
  const { failures, accepted } = evaluateAudit(report, policy.exceptions, lock.packages);
  for (const item of accepted) console.log(`Reviewed tooling exception: ${item.package}@${item.version}, expires ${item.expires} (${item.advisory})`);
  if (failures.length) { console.error(failures.join("\n")); process.exitCode = 1; }
  else console.log(`Security gate passed: no high/critical or unreviewed advisories; ${accepted.length} reviewed moderate tooling findings.`);
} catch (error) {
  console.error(`Security gate failed: ${error.message}`);
  process.exitCode = 1;
}
