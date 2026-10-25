# Bryan Murasira — portfolio

A portfolio for Bryan's full-stack and generative AI engineering work, with a separate Sanity Studio for editing.

## Run

Use Node.js 22.13 or newer.

```sh
npm install
npm run dev -- --port 3010
```

Open `http://127.0.0.1:3010`. For a production preview:

```sh
npm run build
npm run verify
npm run preview
```

The production preview defaults to port 3010. Set `PORT` or pass `--port` to change it.

## Edit content

The selected Sanity project is `i5u4ixfm`, dataset `production`.

Hosted editor: [Bryan's Sanity Studio](https://bryan-portfolio-i5u4ixfm.sanity.studio/). Sign in with a Sanity account that has access to this project.

```sh
npm run studio
```

Open `http://localhost:3333` and sign in to Sanity. Use `localhost`, which is the project's configured Studio origin. Browser sign-in is separate from the CLI session. The Studio contains:

- **Profile & contact:** portrait, roles, homepage introduction, biography, and contact/social information.
- **Projects:** title, category, cover image, technologies, featured status, ordering, and case study.
- **Case-study sections:** text, images, galleries, and architecture/facts; drag sections to reorder them. The Content preview tab shows draft content inside the authenticated editor.
- **Lab:** engineering explorations linked to a project.

**This version generates the website at build time.** Saving drafts does not publish them. Publishing, unpublishing, or deleting portfolio content in Sanity automatically triggers a Vercel rebuild of the protected review branch. The existing website remains available during the build; its HTML, project routes, sitemap, and Markdown update together when the deployment finishes. The original Sites preview is a separate saved snapshot.

The initial profile, four selected projects, covers, and two Lab entries have been imported. To restore missing initial documents without replacing existing edits:

```sh
npm exec --workspace @bryan/studio -- sanity login
npm exec --workspace @bryan/studio -- sanity exec ./seed.mjs --with-user-token
```

The seed command is restricted to the selected project/dataset and uses `createIfNotExists`. Authentication stays in Sanity's local CLI session; no write token is placed in the website or repository.

## Configuration

Copy `.env.example` to `.env.local` when overriding defaults. Public configuration values are not secrets.

| Variable                        | Purpose                                                                                                                            |
| ------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Defaults to `i5u4ixfm`                                                                                                             |
| `NEXT_PUBLIC_SANITY_DATASET`    | Defaults to `production`                                                                                                           |
| `NEXT_PUBLIC_SITE_URL`          | Optional explicit canonical origin; Vercel otherwise supplies its generated branch/production domain                               |
| `PORTFOLIO_REQUIRE_CMS`         | Production builds require a successful CMS read by default; setting `false` explicitly permits checked-in content during an outage |

When the selected dataset contains no portfolio documents yet, the checked-in initial content is used. Once portfolio documents exist, deliberate removals are respected. Only published content is read by the public website.

WebGL image textures also need the website origin in Sanity's CORS list. The local preview uses `http://127.0.0.1:3010`; add a final hosting origin without credentials when deploying. Studio uses its separate authenticated `http://localhost:3333` origin.

## Checks

```sh
npm run typecheck
npm run build
npm run verify
npm run studio:build
npx tsc --noEmit -p studio/tsconfig.json
```

The output verifier follows the current published project list and checks HTML routes and headings, internal link targets, rejected/placeholder copy, metadata, project content, Markdown, JSON profile, sitemap, robots, and the 404 document. Browser checks cover project filtering/navigation, WebGL rendering, and responsive layouts. The package build command assigns a fresh Sanity request tag on every build, preventing restored Next fetch caches from retaining old content.

## Content provenance

Bryan selected Umucyo Catalog AI, Talent OP, Vodun Days, and Emart. Initial descriptions and technologies are based on their repository documentation, not invented delivery claims or metrics. Project covers are typographic identity covers, not screenshots of the applications; replace them with approved media in Studio. The initial portrait is from Bryan's public GitHub profile and can also be replaced in Studio.

## Structure and design

See [Architecture](docs/architecture.md), [Design guide](docs/design-guide.md), [Reference pieces](docs/inspiration.md), and [Decisions](docs/decisions.md).

Vercel build, access, metadata, and publishing settings are maintained in [Deployment](docs/deployment.md).

Public search indexing requires a publicly accessible deployment and the final canonical domain. Bryan authorised hosting the Studio and an owner-only Sites preview on 2026-10-25. Public launch remains a separate decision. The preview's private access prevents public search indexing until that launch.
