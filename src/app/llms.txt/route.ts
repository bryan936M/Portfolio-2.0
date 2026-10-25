import { getPortfolio, siteOrigin } from "@/lib/content";
export const dynamic = "force-static";
export async function GET() {
  const { profile, projects } = await getPortfolio();
  return new Response(
    [
      `# ${profile.name}`,
      `> ${profile.roles.join(" and ")}. ${profile.location}.`,
      profile.introduction,
      `Contact: ${profile.email}`,
      `## Pages`,
      `- [About](${siteOrigin}/about/)`,
      `- [Work](${siteOrigin}/work/)`,
      `- [Lab](${siteOrigin}/lab/)`,
      `- [Contact](${siteOrigin}/contact/)`,
      `## Projects`,
      ...projects.map(
        (project) =>
          `- [${project.title}](${siteOrigin}/content/${project.slug}.md): ${project.summary}`,
      ),
    ].join("\n\n"),
    { headers: { "Content-Type": "text/plain; charset=utf-8" } },
  );
}
