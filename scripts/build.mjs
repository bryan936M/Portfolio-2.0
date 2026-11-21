import { randomUUID } from "node:crypto";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { prepareTextures } from "./prepare-textures.mjs";

const [major, minor, patch] = process.versions.node.split(".").map(Number);
if (major !== 22 || minor < 23 || (minor === 23 && patch < 5)) throw new Error("Use Node 22.23.5 or a newer Node 22 security patch (.nvmrc).");
console.log(`Building with Node ${process.version}`);
await prepareTextures();

// A build-scoped Sanity request tag avoids stale restored fetch-cache entries.
// It is public diagnostics metadata, not a credential or content identifier.
const result = spawnSync(
  process.execPath,
  [
    fileURLToPath(
      new URL("../node_modules/next/dist/bin/next", import.meta.url),
    ),
    "build",
  ],
  {
    stdio: "inherit",
    env: { ...process.env, PORTFOLIO_BUILD_ID: randomUUID() },
  },
);
if (result.error) throw result.error;
if (result.status !== 0) process.exit(result.status ?? 1);
await import("./verify-build.mjs");
