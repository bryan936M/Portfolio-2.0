# Dependency security and release checks

Reviewed 2026-11-21. The release baseline uses Next.js and `@next/env` 16.4.6, React/React DOM 19.3.1, Sanity Studio 6.24.0, and Node 22.23.5. The website remains a static export. Package classification as a production dependency does not imply that a CLI library is shipped to browsers; the workspace audit still includes every installed dependency.

## Release policy

`npm run security:check` requests the complete npm audit report and compares its findings with the checked-in lockfile and `security-exceptions.json`. High/critical findings always fail. Unreviewed advisories, unavailable reports, expired exceptions, changed dependency versions/paths, and changed reviewed parent versions fail. The exception file contains no blanket severity or package exclusions. The tests exercise these failure cases.

CI uses immutable commits of the official checkout/setup-node actions, read-only repository permissions, Node from `.nvmrc`, and a clean `npm ci`. It runs checks on pull requests and main. `npm run build` verifies the generated output before returning success, so the existing Sanity-to-Vercel publishing workflow checks HTML and discovery exports too.

## Reviewed tooling exception

The only intended exception is [GHSA-g3hv-75wg-m249](https://github.com/advisories/GHSA-g3hv-75wg-m249), minimatch 10.2.6 inside `@oclif/core` 4.14.0. Its fix is minimatch 11.0.1, outside the parent’s declared `^10.2.5` dependency range.

The advisory requires an attacker-controlled glob pattern with `optimizationLevel >= 2`. The reviewed `@oclif/core/lib/config/plugin-loader.js` calls `minimatch(p, w)` with no options while matching package dependency names against CLI plugin patterns. The installed minimatch defaults that option to 1. These inputs come from trusted installed CLI/package configuration, not portfolio visitors or Sanity content. This CLI loader is outside the public website and Studio browser import paths. Changing source/package configuration already requires local code execution authority.

The narrow exception is bound to the locked minimatch path/version and reviewed parent versions, and expires 2026-12-21. Reassess or remove it when the parent accepts a patched minimatch; do not extend it without repeating the reachability review. Several npm audit package entries can propagate this single leaf advisory through the CLI dependency chain; they are not separate accepted vulnerabilities.

## Credentials and access

Sanity write access stays in authenticated local CLI sessions. Public website reads use the published perspective without a token. Formspree IDs, Sanity project/dataset identifiers, and canonical origins are public configuration. Deployment-hook URLs, account credentials, and private environment files must not enter Git or browser assets. Review source and generated assets before publishing.

Production custom domains remain public and indexable. Vercel Standard Protection remains enabled for preview/generated deployment URLs; Studio editing continues to require Sanity authentication.
