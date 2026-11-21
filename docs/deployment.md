# Vercel deployment

Status: deployed in `bryan936ms-projects/bryan-murasira-portfolio`, project `prj_wGVGY5bTKpkwiHBSty9niAtv1SiT`. GitHub and automatic CMS rebuilds are connected. Production domains are public; Vercel Standard Protection secures previews and generated deployment URLs.

Canonical URL: https://www.bryanmurasira.com/

The apex `bryanmurasira.com` redirects to `www.bryanmurasira.com`. The default production alias remains https://bryan-murasira-portfolio.vercel.app/.

The Git production branch and Sanity Deploy Hook target `main`. Review changes can still use `codex/vercel-deployment` and its protected branch URL. Bryan authorised public production access on 2026-10-25.

## Build contract

- Import `bryan936M/Portfolio-2.0` with the repository root as Root Directory.
- Use the Next.js preset and managed Node.js 22.x. Local checks and CI pin Node 22.23.5; builds reject earlier Node 22 patches.
- Install with `npm ci --no-audit --no-fund` and build with `npm run build`.
- Next.js detects the static export from `next.config.ts`. Do not select the separate `studio` workspace as the website project.
- `vercel.json` records these build settings. `.vercelignore` excludes local environment files, generated output, and editor runtime files from CLI uploads. `.vercel/` linking state is ignored by Git.
- The package build command runs the output verifier after Next.js succeeds. CI additionally runs the workspace security gate, application/Studio typechecks, and regression tests after a clean install. See [Security](security.md) for the exact tooling exception and release policy.

## Environment and metadata

The published Sanity source is project `i5u4ixfm`, dataset `production`. It needs no read token. Set the matching public configuration in the Vercel project if overriding application defaults.

Production sets `NEXT_PUBLIC_SITE_URL=https://www.bryanmurasira.com`. Without an explicit canonical origin, Vercel previews use `VERCEL_BRANCH_URL` (or `VERCEL_URL`), and production uses `VERCEL_PROJECT_PRODUCTION_URL` (or `VERCEL_URL`). These hosts are supplied by Vercel; do not carry the Sites preview origin or a local `.env.local` file into the Vercel deployment.

The package build command creates a fresh Sanity request tag for each build so restored Next fetch caches cannot retain an older content snapshot.

`NEXT_PUBLIC_FORMSPREE_FORM_ID` is the public contact-form ID, configured for preview and production. It is not an account or API secret. The Contact page posts to that Formspree form, which owns inbox routing and spam filtering. Verify the recipient and any CAPTCHA/domain settings in Formspree; changing this variable requires a new website build. Sanity profile email edits change the direct email link, while the form recipient is managed separately in Formspree.

## Access and launch

Vercel Authentication is configured with `ssoProtection.deploymentType: prod_deployment_urls_and_all_previews` (Standard Protection). Anonymous requests to `www.bryanmurasira.com` and the default production alias return the website; the apex redirects to `www`. Review/preview and generated deployment URLs require Vercel sign-in. Preserve the separate owner-only Sites snapshot and Sanity's authenticated editor.

WebGL textures are generated as same-origin PNG assets during the package build. They work on local ports, branch aliases, and generated deployment URLs without adding browser origins to Sanity. The original exact-origin allowlist remains in place, but is no longer required for texture loading. Studio keeps its own authenticated origin; public CMS reads and texture preparation happen on the build/server side.

## Publishing content

The website is generated from published content at build time. The configured automation is a Sanity document webhook calling a Vercel Deploy Hook for the `main` Git branch:

1. Create one Deploy Hook for that branch after the Git connection exists.
2. Store its URL only in the Sanity webhook configuration. Treat it as a secret; do not commit or print it.
3. Trigger on create, update, and delete of `portfolioProfile`, `portfolioProject`, and `portfolioExperiment` records in `production`.
4. Exclude drafts and release versions. Project image changes publish through the referencing project document.
5. Use a minimal webhook projection containing document ID and operation. Do not send the complete content document to the deploy hook.
6. Verify an actual webhook attempt and resulting successful Vercel build before claiming automatic publication works.

The Sanity webhook is named **Bryan portfolio — Vercel main**. The publishing helper also recognises its previous review name so reconfiguration updates the existing webhook. Integration checks change only a hex colour's letter casing, preserving its rendered appearance, then immediately restore the original stored value with revision checks.

The hosted Sanity Studio remains at https://bryan-portfolio-i5u4ixfm.sanity.studio/.

For the initial work-country release, `studio/publish-work-countries.mjs` defaults to inspection. Set `PORTFOLIO_COUNTRIES_ACTION=publish` and an absolute `PORTFOLIO_RECOVERY_DIRECTORY` for its authenticated CLI execution. It backs up the current profile pair privately, patches only the confirmed RW/BJ/ZM field using the current published revision, and clears a draft only when all its other content matches the published document and its countries match this release. Draft cleanup carries its own revision guard in the same transaction. Unrelated drafts and deliberately different draft countries remain intact. Publishing triggers the existing main-branch rebuild.

To inspect delivery status using the locally authenticated Sanity CLI:

```sh
PORTFOLIO_PUBLISHING_ACTION=status npm exec --workspace @bryan/studio -- sanity exec ./publishing.mjs --with-user-token
```

The publishing helper defaults to read-only status. Its configure mode accepts the project-scoped deploy hook URL through hidden stdin. Its test mode performs the reversible published-event check described above. Neither mode is invoked by the website build.

## Checks and references

## Secure release recovery — 2026-11-21

The security baseline is production Git revision `8f91f90a85bc91a94bb56ac723346851ad238637`, deployment `dpl_4HEBLumD4HxqeD45KQwH23quo35Y` ([deployment](https://bryan-murasira-portfolio-ftlu1jaqr-bryan936ms-projects.vercel.app/)). It includes the BM controller fix and patched dependencies, without the globe. The corresponding Studio was deployed to its existing authenticated address using Sanity 6.24.0. Keep this deployment available as the secure rollback target; the earlier production used vulnerable dependencies.

For subsequent releases, run `npm ci` and `npm run check` using `.nvmrc`, review the protected preview, and merge the exact reviewed head into `main`. Wait for that merge revision’s Vercel deployment to become Ready and check the public aliases before deploying its matching Studio with `npm exec --workspace @bryan/studio -- sanity deploy --no-build --schema-required --yes`. The Studio build must come from the same checked revision. Preserve Standard Protection throughout.

If the globe needs rollback, use Vercel Instant Rollback to the secure baseline, then revert the feature changes on `main` while retaining the security commit. Verify a fresh deployment of that reverted revision; otherwise a later Sanity webhook could restore the broken feature. Rebuild and deploy Studio from the secure revision if its schema also needs rollback. Restore only release-owned `workCountries` changes from the private pre-publication backup, after comparing current values and applying current revision guards; preserve unrelated content and drafts. A changed revision requires fresh inspection, never a forced overwrite. Verify the resulting webhook build and public profile export.

Run the checks in the root README. Hosted verification must include the correct canonical URL, core routes, Markdown/JSON discovery files, authenticated access, and actual 3D texture rendering.

- [Vercel build settings](https://vercel.com/docs/builds/configure-a-build)
- [Node.js versions](https://vercel.com/docs/functions/runtimes/node-js/node-js-versions)
- [Vercel system environment variables](https://vercel.com/docs/environment-variables/system-environment-variables)
- [Deployment protection](https://vercel.com/docs/deployment-protection)
- [Deploy Hooks](https://vercel.com/docs/deploy-hooks)
- [Sanity webhooks](https://www.sanity.io/docs/content-lake/webhooks)
- [Vercel Instant Rollback](https://vercel.com/docs/instant-rollback)
