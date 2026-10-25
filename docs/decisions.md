# Portfolio decisions

Record approved choices here. Detailed proposals and open questions are maintained in [the working brief](portfolio-plan.md).

## 2026-10-25 — Audience and visual direction

- Address employers/technical hiring teams and prospective clients equally.
- Explore an experimental editorial direction: bold type, unexpected layouts, and playful spatial interactions.
- Retain the requirements for minimalism, advanced motion, an AI impression, actual 3D technology, and Awwwards references.
- Discuss and agree on the direction before application implementation or publication.

Source: Bryan's requirements and discussion responses. Palette, fonts, exact 3D concept, and selected references remain open.

## 2026-10-25 — Page structure

Approved pages: Home, Work, Lab, About, Contact, and dedicated project pages.

Source: Bryan explicitly accepted this page set. Detailed sections and content templates remain proposals. Writing has not been added to the initial scope.

## 2026-10-25 — Initial CMS

Start with Sanity Free, following Bryan's preference for a usable free Sanity plan and verification of its suitability for the planned portfolio. See the working brief for the pricing source, allowances, and constraints checked on this date.

This selects the CMS direction; no account, dataset, project, or paid subscription has been created. Preview integration, hosting, and the application framework remain to be agreed. Any future private inquiry/client tracker needs a separate storage decision.

## 2026-10-25 — Content editing model

Use editable and reorderable designed sections, especially for project case studies. Bryan can assemble pages from the supported section types and edit their content.

Source: Bryan accepted the recommendation with “Sounds good.” The exact section catalogue and page areas that permit reordering remain to be designed. This agreement does not authorise starting application implementation before the remaining design and architecture discussion.

## 2026-10-25 — Reference feedback

- Remove Lusion from the active creative references; Bryan was not a fan.
- Use Dennis Snellenberg as a reference for whitespace, content organisation, section introductions, and emphasis on the person.
- Use KPR / “Scroll” as a reference for transitions and animation. Bryan found the navigation too gamified; pursue clearer navigation in the portfolio.
- Use Unseen Studio as a reference for typography, custom cursor, and contextual 3D depth.

“Scroll” is interpreted as the KPR scroll element linked earlier. Bryan's suggestion that the animation may involve 3D is an observation, not a verified implementation fact. Palette, exact fonts, scene concept, and motion implementation remain open. Proposed adaptations are recorded in [the inspiration record](inspiration.md) and [the initial design guide](design-guide.md).

## 2026-10-25 — Opening portrait

Use a real portrait of Bryan for the opening's personal visual.

Source: Bryan explicitly answered “Real portrait.” The portrait asset, crop, placement, colour treatment, and relationship to the 3D composition remain to be selected. This decision does not require waiting for the asset to continue planning typography, layout, or architecture.

## 2026-10-25 — Base appearance

Use a light editorial base, with darker moments for selected 3D sequences.

Source: Bryan accepted this recommendation with “Sounds good.” Exact colour values, fonts, portrait placement, and transition compositions remain proposals for visual review. No application implementation or publication is authorised by this palette decision alone.

## 2026-10-25 — Design before code; initial studies rejected

Bryan rejected the initial coded studies as generic AI prototypes. In particular, “Preview spatial motion” had no useful visitor meaning, “Bryan / PORTRAIT STUDY” was redundant, and “A little room to think” lacked context.

Reuse actual pieces from the selected references. Establish real content, source components/sections, compositions, and motion storyboards before coding another mockup. Verification checks the result against the agreed design; it does not substitute for defining that design first.

Neither opening variant is approved, including Name first despite its carousel selection. Their font pairing, colour values, copy, and free-standing 3D stack are not defaults for the application. Previously agreed page/CMS/portrait/base-appearance decisions remain valid.

## 2026-10-25 — Implementation authorised

Bryan explicitly requested “Let's start implementing,” superseding the earlier discussion-only gate. Use Dennis's homepage composition as the structural base, with the selected Unseen and KPR pieces informing typography and content motion. The interrupted Figma step did not create a file and is not a prerequisite for this authorised implementation.

Implement Next.js/TypeScript, Sanity Studio, React Three Fiber/Three.js, and GSAP with the boundaries in `architecture.md`. This first implementation uses static generation; published CMS changes require a website rebuild/deployment.

## 2026-10-25 — CMS and selected projects

Bryan supplied Sanity project `i5u4ixfm` and selected Umucyo Catalog AI, Talent OP, Vodun Days, and Emart. The `production` dataset was reachable and empty before the initial import. After Bryan signed in locally, the import created the profile, four project records, their image assets, and two related Lab entries without replacing existing documents.

The initial portrait is Bryan's public GitHub portrait. Project covers are typographic identity assets; no fabricated app screenshots or project metrics are used. The actual imagery and copy remain editable in Studio.

External Studio hosting and website publication remain pending explicit authorisation. Continue local implementation and verification without treating hosting as approved.

## 2026-10-25 — Public CMS IDs

The initial importer used period-separated IDs, which Sanity treats as private paths. The importer now uses hyphenated public IDs and migrates only its seven original records and references, preserving their content. An unauthenticated published read verified one profile, four projects, and two Lab records. No public read token is required.

Source: [Sanity IDs and paths](https://www.sanity.io/docs/content-lake/ids).

## 2026-10-25 — Hosting authorised

Bryan explicitly selected “Publish both” for hosting the Sanity dashboard and an owner-only private website preview. Public launch remains a separate decision. The Studio was deployed at `https://bryan-portfolio-i5u4ixfm.sanity.studio/`; editing requires Sanity project access. Preserve the website's owner-only audience.

## 2026-10-25 — Vercel setup authorised

Bryan requested moving the website onto Vercel and accepted the proposed setup. Prepare the existing GitHub repository for deployment, configure the website and Sanity connection, and begin with an authenticated review deployment. Use the `codex/vercel-deployment` branch for the initial review and its CMS rebuild hook. No custom domain or public launch was selected.

## 2026-10-25 — Vercel publishing verified

The website is deployed in Bryan's personal Vercel team with authentication on every URL. GitHub is connected, and published changes to the three portfolio document types automatically rebuild the review branch. Real Sanity webhook deliveries and the resulting Vercel builds succeeded. Drafts and release versions are excluded. The exact review origin is allowed to read image textures without credentials; no wildcard origin was added. See `deployment.md` for the project and publishing contract.
