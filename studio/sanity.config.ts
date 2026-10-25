import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schemaTypes } from "./schema";
import { ProjectPreview } from "./ProjectPreview";

export default defineConfig({
  name: "bryan-portfolio",
  title: "Bryan · Portfolio",
  projectId: process.env.SANITY_STUDIO_PROJECT_ID || "i5u4ixfm",
  dataset: process.env.SANITY_STUDIO_DATASET || "production",
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Portfolio")
          .items([
            S.listItem()
              .title("Profile & contact")
              .id("profile")
              .child(
                S.document()
                  .schemaType("portfolioProfile")
                  .documentId("portfolio-profile"),
              ),
            S.documentTypeListItem("portfolioProject").title("Projects"),
            S.documentTypeListItem("portfolioExperiment").title("Lab"),
          ]),
      defaultDocumentNode: (S, { schemaType }) =>
        schemaType === "portfolioProject"
          ? S.document().views([
              S.view.form(),
              S.view.component(ProjectPreview).title("Content preview"),
            ])
          : S.document(),
    }),
  ],
  schema: { types: schemaTypes },
});
