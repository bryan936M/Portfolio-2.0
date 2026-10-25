# Bryan's portfolio — working brief

Updated: 2026-10-25 (Africa/Kigali)

Status: implementation authorised and underway. Bryan explicitly requested starting implementation and supplied the CMS project and four selected projects. External hosting/public launch remain separate decisions. This document retains proposals alongside confirmed decisions; current implementation boundaries are in `architecture.md`.

## Confirmed requirements and decisions

| Item | Decision | Source |
| --- | --- | --- |
| Subject | Bryan, full-stack software engineer and generative AI engineer | Original goal |
| Audience | Employers and technical hiring teams, and prospective clients, with equal emphasis | Bryan's discussion response |
| Visual direction | Experimental editorial: bold type, unexpected layouts, playful spatial interactions | Bryan's discussion response |
| Visual language | Minimalist, with advanced design and animation and an AI impression | Bryan's requirements |
| Creative freedom | Explore the UI freely; no predetermined creative UI restrictions | Bryan's requirements |
| Inspiration | Use specific Awwwards references for theme, pages, sections, animations, and components | Bryan's requirements |
| Reference preferences | Dennis for space, organisation and personal presence; KPR / “Scroll” for motion with clearer navigation; Unseen for type, cursor and depth; Lusion rejected | Bryan's detailed reference feedback |
| Opening portrait | Use a real portrait of Bryan as the personal visual in the opening | Bryan explicitly chose “Real portrait.” |
| Base appearance | Light editorial base, with darker moments for selected 3D sequences | Bryan accepted the proposed palette direction |
| 3D | Include real 3D technology in the experience | Bryan's requirements |
| Discovery | Make public content indexable by search engines and readable by online agents | Bryan's requirements |
| Documentation | Agree on the app's content structure, maintain a design guide, and agree on and maintain its code structure | Bryan's requirements |
| Content management | Use Sanity Free for the initial CMS, with editable and reorderable designed sections | Bryan's preference for a usable free Sanity plan and acceptance of the section-editor recommendation; pricing checked 2026-10-25 |
| Sitemap | Home, Work, Lab, About, Contact, and dedicated project pages | Bryan's explicit acceptance |
| Workflow | Discuss and agree before implementation | Bryan's earlier correction |
| Design process | Define content and reuse specific reference pieces; agree on composition and motion before coding a mockup. Initial coded studies rejected | Bryan's critique of the initial studies |

The earlier lime-on-dark suggestion is not approved. A light editorial base with darker 3D moments is now agreed. Exact palette values, fonts, detailed section scope, framework, hosting, and the 3D concept remain open.

## Agreed page structure and proposed visitor journey

Help visitors understand Bryan's engineering identity, inspect real evidence of his work, understand how he works, and choose an appropriate way to contact him. Employers should find technical depth and role information; clients should find relevant capabilities and a route to discuss a project.

Agreed page set: Home / Work / Lab / About / Contact, plus individual project pages. Proposed navigation presentation: a Home identity link and Work / Lab / About / Contact links.

| Route | Purpose and proposed contents | Status |
| --- | --- | --- |
| `/` | Introduction with a signature spatial composition; selected projects; full-stack and AI capabilities; brief working approach; personal introduction; routes to discuss a role or project | Page agreed; section details proposed |
| `/work` | Index of real projects with concise summaries, Bryan's contribution, and relevant categories | Page agreed; content details proposed |
| `/work/[slug]` | Individual case studies: context, problem, role, constraints, solution, architecture, implementation decisions, evidence of results, media, and verified links | Dedicated pages agreed; content template proposed |
| `/lab` | Clearly labelled experiments in generative AI, agents, creative development, or 3D; separate experiments from delivered project claims | Page agreed; entries to be supplied |
| `/about` | Engineering background, approach, verified experience, skills in context, selected interests, and a current CV if supplied | Page agreed; content details proposed |
| `/contact` | Role/project inquiry paths, real contact details, and verified social links | Page agreed; direct email versus form remains open |
| `/writing` and `/writing/[slug]` | Technical writing if Bryan wants to maintain it and has material | Optional; not part of the proposed initial core |

The homepage should tell a coherent story rather than repeat every interior page. Individual project URLs should be reachable through normal links. Exact homepage order, section names, and number of projects remain to be agreed.

## Design-guide plan

Maintained documents, refined as the corresponding decisions are made:

- `docs/design-guide.md`: visual principles, typography, palette, layout and spacing tokens, component rules and states, responsive behaviour, motion, and 3D art direction.
- `docs/inspiration.md`: selected Awwwards references, the exact page/element being studied, relevant observations, adaptation ideas, and where each idea is used.
- `docs/architecture.md`: stack, folder responsibilities, content contracts, rendering strategy, motion/scene ownership, and verification commands.
- `docs/decisions.md`: dated decisions and reasons, including later changes to approved choices.

The [initial design guide](design-guide.md), [inspiration record](inspiration.md), and [decision log](decisions.md) now exist. Architecture remains a planned document until the technical discussion.

The first coded design studies are rejected and are not the visual baseline. Follow the reference-piece selection and design-before-code process now recorded in the design guide. Do not carry their placeholder slogans, motion-preview controls, typography, or 3D stack into the application.

### Proposed art direction

Use a small, deliberate visual vocabulary: expressive typography, generous negative space, a restrained palette, asymmetric composition, and a recognisable spatial motif. Express the AI theme through procedural behaviour, connections, transformation, and engineering storytelling. An actual AI assistant or live model integration is a separate feature decision.

Following Bryan's reference feedback, emphasise his personal identity and deliberate section introductions. Explore dimensional transitions, expressive typography, and a contextual cursor, with straightforward navigation. See the initial design guide for proposals derived from these preferences.

Select actual reference pieces and compose them around Bryan's real content before choosing fonts, colour values, or a 3D implementation. Use the piece-level record in the inspiration document; any 3D sequence needs an agreed content purpose and storyboard.

### Proposed guide contents and review criteria

| Area | What to define |
| --- | --- |
| Typography | Display and reading faces; hierarchy, line lengths, fluid scales, and font loading |
| Colour and materials | Semantic colour tokens; text contrast; selected accent; 3D lighting and materials |
| Layout | Grid, spacing, page rhythm, image ratios, responsive composition, and intentional exceptions |
| Components | Navigation, project previews, case-study media, labels, links, buttons, forms, and focus/loading/error states |
| Motion | Entrance, hover/focus, section choreography, route transitions; shared timing and easing; animation ownership and cleanup |
| 3D | Scene purpose, camera behaviour, interaction model, geometry/assets, lighting, fallback, and device adaptation |
| Accessibility | Keyboard paths, focus visibility, semantic reading order, reduced-motion behaviour, and equivalent content outside canvas |
| Performance | Content-first loading, deferred 3D, scene resource budgets, offscreen/hidden-tab behaviour, and representative mobile testing |

Advanced motion should be intentional and coordinated. Mobile, keyboard, and reduced-motion experiences are designed alongside the full visual experience. Concrete timing, asset, and performance budgets will be set after a representative scene prototype.

## Awwwards reference direction

The linked entries were initially checked through Awwwards. Bryan has now supplied specific feedback; the [inspiration record](inspiration.md) is the maintained source for preferences and adaptations. This is not a completed technical audit. Live sites may differ from the reviewed versions.

| Reference | Verified reference material | Proposed study focus |
| --- | --- | --- |
| [Dennis Snellenberg](https://www.awwwards.com/sites/dennis-snellenberg) | Bryan liked the whitespace, organisation, section introductions, and personal emphasis | Personal presence and editorial pacing |
| [Lusion](https://www.awwwards.com/sites/lusion) | Bryan was not a fan | Rejected; excluded from active creative references |
| [Unseen Studio](https://www.awwwards.com/sites/unseen-studio) | Bryan liked typography, custom cursor, and contextually appropriate depth | Typographic expression, cursor feedback, and relevant spatial depth |
| [KPR — scroll element](https://www.awwwards.com/inspiration/scroll-kpr) | Bryan strongly liked the motion; navigation felt too gamified | Choreographed transitions paired with straightforward navigation |

For each selected reference, record the particular idea, why it suits Bryan, how it changes in this portfolio, mobile/fallback behaviour, and the affected component or section. Produce an original composition with original assets and copy.

## Search and agent discovery

Proposed architectural requirement: deliver meaningful HTML for every public content page before animation or 3D loads. Google can render JavaScript, but its [JavaScript SEO guidance](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics) recommends server rendering or prerendering because not all crawlers execute JavaScript.

Planned foundations:

- Public, stable URLs and ordinary internal links for projects and other indexable content.
- Semantic headings, landmarks, descriptive links, and textual project information outside WebGL canvases.
- Accurate titles, descriptions, canonical URLs, social previews, and image alternative text.
- Sitemap, robots policy, correct success/redirect/not-found responses, and no accidental production `noindex`.
- Structured data reflecting actual visible facts, such as a Person/ProfilePage and relevant project/article types.
- A concise machine-readable profile and project summaries generated from the same source as the visible pages.
- Consider `/llms.txt` with links to clean Markdown versions as an agent convenience. It is a [proposal](https://llmstxt.org/), not a universal crawling standard or a ranking guarantee.
- Validate the deployed public site, then configure Search Console and submit its sitemap when domain ownership/access is available.

The eventual production site must be publicly readable to meet the search-indexing requirement. The empty private Site reserved earlier is not a final hosting or audience decision. Public launch details remain to be discussed.

Google's [AI search guidance](https://developers.google.com/search/docs/appearance/ai-features) says its AI features use the usual SEO foundations and require no special AI files. Engineering can establish crawlability and eligibility; actual indexing, ranking, and agent citation are controlled by external services.

## Content management and private dashboard

Confirmed need: Bryan needs a place to add content to the site. Selected starting CMS: Sanity Free, using an authenticated editing dashboard paired with the public portfolio. No Sanity project has been provisioned. A CRM manages contacts, leads, and follow-ups; it becomes relevant only if Bryan also wants inquiry/client tracking.

Proposed initial dashboard areas:

- Projects and case studies: descriptions, role, stack, media, links, categories, featured status, ordering, and publication status.
- Lab entries: experiment descriptions, media, links, and publication status.
- Profile: biography, experience, CV, social links, and availability/contact copy.
- Media: images, video references, alternative text, and relevant asset metadata.
- Site content: homepage text, selected work, navigation labels, and SEO titles/descriptions/social images.
- Writing, if included in the agreed sitemap.

Proposed workflow: create/edit a draft, preview it in the actual portfolio layout, then publish. Published changes trigger a rebuild or cache revalidation according to the selected hosting/rendering setup. Public HTML, project pages, sitemap, and agent-readable summaries derive from the same published content. Draft preview requires authenticated access.

Agreed editing model: Bryan can edit content and assemble/reorder reusable, designed section types, especially in project case studies. The exact block catalogue and which page areas support reordering remain to be defined in the design guide and content model. Expose validated visual/3D presets where useful; scene implementation, shaders, and animation choreography remain in code unless broader visual editing is explicitly scoped.

Alternatives considered:

| Approach | Benefits | Tradeoffs |
| --- | --- | --- |
| Sanity Studio | Custom content schemas backed by a managed content service; visual editing integration supports live draft previews and click-to-edit | External service dependency; schema/query integration and applicable plan limits |
| Payload | Customisable React/TypeScript admin integrated with Next.js; content management, draft previews, and version views | Requires a server deployment, database, permanent upload storage, and their ongoing maintenance |
| Fully custom dashboard | Complete control of editing interactions and bespoke workflows | More implementation and maintenance for authentication, editing, uploads, drafts, preview, and revision history |

Decision: start with Sanity Free. Payload and a fully custom dashboard remain alternatives if requirements later change.

### Free-plan fit checked 2026-10-25

[Current pricing](https://www.sanity.io/pricing): $0; 10,000 documents; 100 GB assets; 100 GB monthly bandwidth; 1 million monthly CDN API requests; hosted Studio, preview, visual editing, and page-building tools included. This is a suitable starting allowance for the planned portfolio, subject to actual usage. Scheduled drafts and private datasets are excluded. Website hosting and domain are separate decisions.

The [Free plan blocks usage at quota limits](https://www.sanity.io/docs/platform-management/plans-and-payments), so publishing architecture should minimise repeated reads through generated pages or caching. Published documents in [public datasets are queryable by anyone](https://www.sanity.io/docs/content-lake/datasets); editing still requires authentication. Use this CMS for portfolio content, with any future private inquiry/client records handled separately. Exact section-editor capabilities and preview/publish integration still need design and configuration.

Sources: [Sanity Content Lake](https://www.sanity.io/docs/content-lake), [Sanity visual editing](https://www.sanity.io/docs/visual-editing/introduction-to-visual-editing), [Payload admin](https://payloadcms.com/docs/admin/overview), [Payload deployment](https://payloadcms.com/docs/production/deployment).

## Proposed technology and project structure

Current repository: Next.js App Router + React + TypeScript, migrated from the Vite starter after implementation was authorised. See [Architecture](architecture.md) for the maintained structure and build-time publishing contract.

Working recommendation for discussion:

- Next.js App Router + TypeScript, with static generation for portfolio content and narrow client boundaries for interactive features. [Static export](https://nextjs.org/docs/app/guides/static-exports) can emit HTML per route; server-backed features would change the hosting requirements.
- Three.js through React Three Fiber and Drei for the spatial layer. Use custom shaders where the agreed design calls for them. [Performance guidance](https://r3f.docs.pmnd.rs/advanced/scaling-performance) covers resource reuse, adaptive quality, and on-demand rendering when a scene can rest.
- GSAP for coordinated sequences and scroll choreography; CSS for simple UI transitions. [Media-query support](https://gsap.com/docs/v3/GSAP/gsap.matchMedia()/) supports responsive and reduced-motion variants. Avoid overlapping animation systems controlling the same properties.
- CMS-backed profile and project content, with typed schemas and validated reads. Markdown/MDX remains an alternative if Bryan later prefers repository-based editing; the new dashboard requirement makes a CMS the working recommendation.
- Semantic CSS variables for design tokens, with styling conventions selected during the architecture discussion.

Astro with React islands is a viable alternative for a predominantly editorial site; its [React integration](https://docs.astro.build/en/guides/integrations-guide/react/) supports rendering and hydrating React components. The deciding factors are the agreed interaction model, live/server features, maintenance preferences, and hosting.

Illustrative structure if the Next.js recommendation is selected; the tree is a proposal and these application directories have not been created:

```text
docs/
  portfolio-plan.md
  design-guide.md
  inspiration.md
  architecture.md
  decisions.md
src/
  app/                  # routes, layouts, metadata, sitemap, errors
  components/
    ui/                 # shared interface primitives
    layout/             # navigation, footer, page shell
    motion/             # reusable animation wrappers/controllers
  features/
    home/               # homepage sections and their composition
    work/               # work index and case-study presentation
    lab/                # approved experiments
    about/
    contact/
  three/
    scenes/             # scene compositions and scene lifecycle
    objects/            # reusable spatial objects
    materials/          # materials and GLSL shaders
  content/
    schemas/            # shared content contracts; exact location depends on CMS
    renderers/          # rich-text and designed content-section rendering
  cms/                  # selected CMS schemas/config, client, and preview integration
  data/                 # validated profile and navigation data
  lib/                  # content loaders, metadata, structured data
  styles/               # tokens, global styles, typography, motion tokens
public/
  images/
  models/
  textures/
  fonts/
tests/                  # meaningful navigation, crawlability, and flow checks
```

Maintainable boundaries: routes compose features; features use shared UI and motion; scene code owns WebGL resources; content is independent of presentation; metadata and machine-readable summaries derive from the same content. Keep feature-specific components with their feature and promote shared components when actual reuse appears. Update architecture and decision records when an agreed boundary changes.

## Proposed sequence before implementation

1. Page set agreed. Finalise section scope and the principal actions for employers and clients.
2. Review and select Awwwards references, then map them to specific pages, sections, motions, and components.
3. Compose the selected reference pieces around real content in a static design, with an annotated motion storyboard; agree on the composition and design-guide foundations before another coded mockup.
4. Agree on stack, content editing, hosting, and project structure; record the decisions.
5. Begin the approved implementation, using a representative page and 3D interaction to verify the chosen direction early.

## Inputs and decisions still needed

- Detailed page sections and content; Writing remains optional and outside the agreed initial page set.
- Real projects, Bryan's role in each, technical details, allowed media, and evidence of outcomes.
- Bryan's chosen portrait asset, biography, experience, CV, contact email, and social links to publish.
- Exact visual references, palette, typography, and 3D concept.
- Whether AI is conveyed visually, demonstrated through projects, and/or provided as a live interactive feature.
- Exact section/block catalogue, reorderable areas, and whether client/lead tracking is also wanted. Sanity Free and editable/reorderable designed sections are agreed; no account/project setup has begun.
- Stack, styling approach, content editing workflow, final domain, and hosting.

No invented experience, delivery claims, project results, or contact details should be published. This file is the initial planning record; later agreement should be recorded explicitly before treating a proposed choice as final.
