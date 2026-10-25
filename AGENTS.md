# Portfolio working conventions

- Read `docs/decisions.md`, `docs/design-guide.md`, and `docs/architecture.md` before substantial changes.
- Keep the agreed personal editorial direction and its specific reference pieces. The rejected prototype's labels, free-standing 3D stack, and arbitrary slogans are not design defaults.
- Keep content sourced from Bryan or verified project material. Do not invent experience, customer claims, project results, metrics, contact details, or application screenshots.
- Preserve the architecture boundaries: routes compose features; shared layout/UI stays in components; WebGL stays in `src/three`; CMS reads and metadata stay in `src/lib`; editor schemas stay in `studio`.
- Public content must be present in generated HTML and available through normal links. Keep textual content independent of canvas and animation.
- Maintain keyboard, touch, reduced-motion, and static fallbacks. Remove event listeners, ScrollTriggers, and GPU resources with their owning component lifecycle.
- Never place a Sanity write token in client code or source control. Public website reads use the published perspective.
- Update architecture and decision records when a boundary or publishing workflow changes. The website is generated at build time; published Sanity changes trigger a rebuild of the protected Vercel main deployment.
- Run appropriate checks from the README. The output verifier follows a successful production build. Do not add generic filler or mirror tests for cosmetic changes.
