import Link from "next/link";
import { getPortfolio } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";
import { Arrow } from "@/components/ui/Arrow";
export const metadata = pageMetadata(
  "Lab",
  "Explorations in generative AI, structured information, and catalog retrieval.",
  "/lab/",
);
export default async function LabPage() {
  const { experiments, projects } = await getPortfolio();
  return (
    <div className="page-shell">
      <header className="page-heading content-width">
        <p className="eyebrow">Engineering explorations</p>
        <h1>
          The
          <br />
          <em>lab.</em>
        </h1>
        <p className="page-introduction">
          The ideas and systems within the work.
        </p>
      </header>
      <section
        className="lab-grid content-width"
        aria-label="Engineering explorations"
      >
        {experiments.map((experiment, index) => {
          const project = projects.find(
            (item) => item.slug === experiment.project,
          );
          if (!project) return null;
          return (
            <Link
              className="lab-entry"
              href={`/work/${project.slug}/`}
              key={experiment.slug}
              data-cursor="Read"
            >
              <div className="lab-entry-top">
                <span>{String(index + 1).padStart(2, "0")}</span>
                <span>{experiment.category}</span>
              </div>
              <h2>{experiment.title}</h2>
              <p>{experiment.summary}</p>
              <div className="lab-entry-bottom">
                <span>Within {project.title}</span>
                <Arrow diagonal />
              </div>
            </Link>
          );
        })}
      </section>
    </div>
  );
}
