import { getPortfolio, siteOrigin } from "@/lib/content";
export const dynamic = "force-static";
export async function GET() {
  const { profile, projects } = await getPortfolio();
  return Response.json({
    name: profile.name,
    roles: profile.roles,
    location: profile.location,
    contact: profile.email,
    url: siteOrigin,
    sameAs: [profile.github, profile.linkedin],
    projects: projects.map((project) => ({
      title: project.title,
      summary: project.summary,
      featured: project.featured,
      url: `${siteOrigin}/work/${project.slug}/`,
      markdown: `${siteOrigin}/content/${project.slug}.md`,
    })),
  });
}
