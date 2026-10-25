# Vercel deployment

Status: deployed in `bryan936ms-projects/bryan-murasira-portfolio`, project `prj_wGVGY5bTKpkwiHBSty9niAtv1SiT`. GitHub and automatic CMS rebuilds are connected. Vercel Authentication protects all deployment URLs.

Review URL: https://bryan-murasira-portfolio-git-codex-v-1004bc-bryan936ms-projects.vercel.app/

The Git production branch remains `main`. The review branch and Sanity Deploy Hook target `codex/vercel-deployment`. Vercel classified its first project deployment as production; authentication was enabled for all URLs before that build. Subsequent content-triggered deployments are previews. Public launch is still undecided.

## Build contract

- Import `bryan936M/Portfolio-2.0` with the repository root as Root Directory.
- Use the Next.js preset and Node.js 22.x.
- Install with `npm ci --no-audit --no-fund` and build with `npm run build`.
- Next.js detects the static export from `next.config.ts`. Do not select the separate `studio` workspace as the website project.
- `vercel.json` records these build settings. `.vercelignore` excludes local environment files, generated output, and editor runtime files from CLI uploads. `.vercel/` linking state is ignored by Git.

## Environment and metadata

The published Sanity source is project `i5u4ixfm`, dataset `production`. It needs no read token. Set the matching public configuration in the Vercel project if overriding application defaults.

`NEXT_PUBLIC_SITE_URL` is an optional explicit canonical origin, primarily for a custom domain. Without it, Vercel previews use `VERCEL_BRANCH_URL` (or `VERCEL_URL`), and production uses `VERCEL_PROJECT_PRODUCTION_URL` (or `VERCEL_URL`). These hosts are supplied by Vercel; do not carry the Sites preview origin or a local `.env.local` file into the Vercel deployment.

The package build command creates a fresh Sanity request tag for each build so restored Next fetch caches cannot retain an older content snapshot.

## Access and launch

Vercel Authentication is configured with `ssoProtection.deploymentType: all`. An unauthenticated request to the review URL redirects to Vercel sign-in. Authenticated CLI requests can verify the site without making it public. Preserve the separate owner-only Sites preview. A public launch/custom domain remains a separate choice.

WebGL textures are generated as same-origin PNG assets during the package build. They work on local ports, branch aliases, and generated deployment URLs without adding browser origins to Sanity. The original exact-origin allowlist remains in place, but is no longer required for texture loading. Studio keeps its own authenticated origin; public CMS reads and texture preparation happen on the build/server side.

## Publishing content

The website is generated from published content at build time. The configured automation is a Sanity document webhook calling a Vercel Deploy Hook for the review Git branch:

1. Create one Deploy Hook for that branch after the Git connection exists.
2. Store its URL only in the Sanity webhook configuration. Treat it as a secret; do not commit or print it.
3. Trigger on create, update, and delete of `portfolioProfile`, `portfolioProject`, and `portfolioExperiment` records in `production`.
4. Exclude drafts and release versions. Project image changes publish through the referencing project document.
5. Use a minimal webhook projection containing document ID and operation. Do not send the complete content document to the deploy hook.
6. Verify an actual webhook attempt and resulting successful Vercel build before claiming automatic publication works.

The Sanity webhook is named **Bryan portfolio — Vercel review**. Both test event deliveries returned HTTP 201, and the resulting Vercel deployments completed successfully. The test changed only a hex colour's letter casing, preserving its rendered appearance, then immediately restored the original stored value with revision checks.

The hosted Sanity Studio remains at https://bryan-portfolio-i5u4ixfm.sanity.studio/.

To inspect delivery status using the locally authenticated Sanity CLI:

```sh
PORTFOLIO_PUBLISHING_ACTION=status npm exec --workspace @bryan/studio -- sanity exec ./publishing.mjs --with-user-token
```

The publishing helper defaults to read-only status. Its configure mode accepts the project-scoped deploy hook URL through hidden stdin. Its test mode performs the reversible published-event check described above. Neither mode is invoked by the website build.

## Checks and references

Run the checks in the root README. Hosted verification must include the correct canonical URL, core routes, Markdown/JSON discovery files, authenticated access, and actual 3D texture rendering.

- [Vercel build settings](https://vercel.com/docs/builds/configure-a-build)
- [Node.js versions](https://vercel.com/docs/functions/runtimes/node-js/node-js-versions)
- [Vercel system environment variables](https://vercel.com/docs/environment-variables/system-environment-variables)
- [Deployment protection](https://vercel.com/docs/deployment-protection)
- [Deploy Hooks](https://vercel.com/docs/deploy-hooks)
- [Sanity webhooks](https://www.sanity.io/docs/content-lake/webhooks)
