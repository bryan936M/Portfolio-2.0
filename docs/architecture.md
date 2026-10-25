# Portfolio architecture

Updated: 2026-10-25

## Implemented foundation

- Next.js App Router, React, TypeScript, and static generation. Every content page ships meaningful HTML.
- Sanity project `i5u4ixfm`, public dataset `production`, read using the published perspective. A separate Studio workspace provides authenticated editing.
- Three.js through React Three Fiber for project-cover depth; loaded near the viewport. On-demand rendering updates with scroll. Reduced-motion users receive the same project content with a static presentation.
- GSAP for section entrances and the name/scroll choreography. Simple interface transitions remain CSS-owned.
- Self-hosted Geist and Newsreader fonts and semantic CSS tokens. The reference composition, not a UI kit, defines the public interface.

## Maintained structure

```text
src/
  app/                       routes, root layout, metadata and discovery endpoints
    work/[slug]/             generated project pages
    content/[slug]/          clean Markdown exports (.md paths)
  components/
    layout/                  shared header and footer
    motion/                  lifecycle and reduced-motion-aware animation
    ui/                      shared interface elements
  features/
    home/                    homepage composition
    work/                    project list, filters, case-study sections, spatial stage
  three/                     WebGL scene and resource ownership
  content/                   typed contracts and checked-in initial content
  lib/                       published CMS reads, URL validation, metadata
  styles/                    tokens, shared typography, responsive composition
studio/                      Sanity schemas, editor structure, content preview, seed
public/                      portrait, project covers, social image, favicon
scripts/                     output verification and local static preview
docs/                        design, references, decisions, and this architecture
```

Small route-specific About, Contact, and Lab compositions currently live in their route files; extract feature modules when actual complexity or reuse warrants them. Routes compose features; scene implementation remains outside content and layout primitives.

## Content contract

Document types are namespaced: `portfolioProfile`, `portfolioProject`, and `portfolioExperiment`. This avoids colliding with unrelated content types in the same Sanity project.

Projects have stable slugs, title/summary/category, technologies, cover, featured status, ordering, and an ordered array of sections. The four section types are text, image, gallery, and facts/architecture. Rich text is rendered using Portable Text, without executing author-supplied HTML. Public links are restricted to local paths or HTTP(S) URLs.

The checked-in content supplies the initial portfolio before seeding. After CMS content exists, removing all projects does not resurrect seed projects. Production builds fail on CMS read errors unless the operator explicitly opts into fallback; development can use the checked-in content.

`npm run build` assigns a unique, public Sanity request tag to each build. Routes within a build share the query/cache key, while a later build cannot reuse an older published response from Next's restored fetch cache. Always use the package build command for deployment.

## Publishing contract

The current deployment model is build-time publication:

1. Edit and reorder content in authenticated Studio.
2. Review draft content in the Studio's Content preview view.
3. Publish the document in Sanity.
4. Rebuild and redeploy the website. All HTML, routes, JSON, and Markdown update from the same published data.

The Studio content preview is an editorial preview, not a full interactive preview of the public site's motion or navigation. No automatic CMS webhook/build hook is configured. Configure the chosen hosting provider's build hook before promising automatic website updates on publishing.

The reserved Sites project is configured for the `out` directory. Preserve its owner-only audience until Bryan authorises sharing/launch changes. Set the actual public origin in `NEXT_PUBLIC_SITE_URL` before public deployment or search submission. Do not use a private deployment as evidence of public indexability.

## Reference mapping

| Source piece | Implementation |
| --- | --- |
| Dennis D1 — integrated portrait, name, role and navigation | `features/home/Home.tsx`, `components/layout/Header.tsx`, hero styles |
| Dennis D2 — asymmetric introduction before work | homepage introduction with profile content and About action |
| Dennis D3 — spacious work rows and associated image preview | `features/work/ProjectList.tsx` |
| Unseen U1/U2 — typographic contrast and meaningful depth | editorial headings and the selected-project spatial stage |
| KPR K1 — continuity of content surfaces through motion | project covers change depth/framing with scroll; no separate motion-preview control |

These are adaptations around Bryan's actual content. The first rejected visual studies are not the implementation baseline.

## Verification

Use the commands in the root README. Verify both content and navigation with JavaScript, and inspect generated HTML/discovery files independently of hydration. Browser QA should cover desktop and narrow layouts, the mobile menu and focus, project filters and links, actual WebGL loading, meaningful static fallback, and contact destinations.
