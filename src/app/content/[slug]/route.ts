import { getPortfolio, projectMarkdown } from "@/lib/content";
export const dynamic = "force-static";
export const dynamicParams = false;
export async function generateStaticParams() {
  return (await getPortfolio()).projects.map((project) => ({
    slug: `${project.slug}.md`,
  }));
}
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const project = (await getPortfolio()).projects.find(
    (item) => `${item.slug}.md` === slug,
  );
  if (!project) return new Response("Not found", { status: 404 });
  return new Response(projectMarkdown(project), {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
}
