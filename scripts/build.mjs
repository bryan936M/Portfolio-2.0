import { randomUUID } from "node:crypto";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

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
process.exit(result.status ?? 1);
