import { defineCliConfig } from "sanity/cli";
export default defineCliConfig({
  deployment: { appId: "lvgz48btaa1yx4zy0ob2j3y8" },
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID || "i5u4ixfm",
    dataset: process.env.SANITY_STUDIO_DATASET || "production",
  },
});
