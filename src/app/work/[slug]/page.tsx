import Link from "next/link";
import { notFound } from "next/navigation";
import { getPortfolio, siteOrigin } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";
import { CaseStudySections } from "@/features/work/CaseStudySections";
import { Arrow } from "@/components/ui/Arrow";
export const dynamicParams = false;
export async function generateStaticParams() {
  return (await getPortfolio()).projects.map((project) => ({
    slug: project.slug,
  }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = (await getPortfolio()).projects.find(
    (item) => item.slug === slug,
  );
  return project
    ? pageMetadata(project.title, project.summary, `/work/${slug}/`)
    : {};
}
export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { projects } = await getPortfolio();
  const project = projects.find((item) => item.slug === slug);
  if (!project) notFound();
  const next =
    projects[
      (projects.findIndex((item) => item.slug === slug) + 1) % projects.length
    ];
  const schema = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.summary,
    url: `${siteOrigin}/work/${slug}/`,
    about: project.stack.map((name) => ({ "@type": "Thing", name })),
  };
  return (
    <article className="page-shell">
      <header className="case-heading content-width">
        <Link className="back-link" href="/work/">
          ← All work
        </Link>
        <p className="eyebrow">{project.category}</p>
        <h1>{project.title}</h1>
        <p className="case-summary">{project.summary}</p>
        <div className="case-stack">
          {project.stack.map((tech) => (
            <span key={tech}>{tech}</span>
          ))}
        </div>
      </header>
      <div className="case-cover">
        <img
          src={project.cover}
          alt={`${project.title} project cover`}
          width="1600"
          height="1000"
          fetchPriority="high"
        />
      </div>
      <CaseStudySections sections={project.sections} />
      {project.website && (
        <div className="content-width case-website">
          <a
            className="outline-link"
            href={project.website}
            target="_blank"
            rel="noreferrer"
          >
            Visit project
            <Arrow diagonal />
          </a>
        </div>
      )}
      <div className="case-next content-width">
        <p className="eyebrow">Next project</p>
        <Link href={`/work/${next.slug}/`}>
          {next.title}
          <Arrow diagonal />
        </Link>
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema).replace(/</g, "\\u003c"),
        }}
      />
    </article>
  );
}
