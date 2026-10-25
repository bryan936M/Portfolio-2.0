import { getPortfolio } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";
import { ProjectList } from "@/features/work/ProjectList";
export const metadata = pageMetadata(
  "Work",
  "Projects across generative AI, web applications, mobile experiences, and commerce.",
  "/work/",
);
export default async function WorkPage() {
  const { projects } = await getPortfolio();
  return (
    <div className="page-shell">
      <header className="page-heading content-width">
        <p className="eyebrow">Projects</p>
        <h1>
          Selected
          <br />
          <em>work.</em>
        </h1>
      </header>
      <section className="work-index content-width" aria-label="Project index">
        <ProjectList projects={projects} filterable />
      </section>
    </div>
  );
}
