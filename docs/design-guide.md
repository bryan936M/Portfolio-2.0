# Portfolio design guide — v1

Updated: 2026-10-25 (Africa/Kigali)

Status: first implemented direction, ready for Bryan's visual review. The reference choices, page structure, real portrait, light base, and implementation are authorised. Exact typography, colour, spacing, and motion below describe this implementation; they are not recorded as individually approved design choices.

## Identity and content

Address employers and clients equally. Establish Bryan's name, real portrait, full-stack software engineering, and generative AI engineering in the opening. Describe actual projects and provide clear routes to work and contact.

Every phrase must identify Bryan, explain work, organise content, or name a useful action. Do not use invented metrics, experience, results, testimonials, or application screenshots. The rejected labels “Preview spatial motion”, “Bryan / PORTRAIT STUDY”, and “A little room to think” must not appear in the public interface.

The initial photo is Bryan's public GitHub portrait. The project covers are typographic identities, not application screenshots. Both are replaceable in Sanity.

## Reference pieces

See [the inspiration record](inspiration.md) for source links and observations.

| Piece                       | Composition retained                                                                                | Adaptation for Bryan                                                                                              |
| --------------------------- | --------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| Dennis D1: homepage opening | Integrated portrait, oversized name crossing the lower opening, role at the side, simple navigation | Bryan's actual portrait, two engineering specialisations, named destinations, location                            |
| Dennis D2: introduction     | Large statement at left, smaller supporting text and circular About action at right                 | Identity and the relationship between full-stack and AI work                                                      |
| Dennis D3: project rows     | Spacious separated rows, dominant project names, smaller disciplines, image on hover                | Four selected projects, contextual View cursor, real case-study links                                             |
| Unseen U1/U2                | Expressive type contrast and depth associated with content                                          | Newsreader italic emphasis within Geist headings; project covers become spatial surfaces                          |
| KPR K1 / Scroll             | Content changes framing and depth with scroll                                                       | Project-cover surfaces rotate and settle as the selected-work chapter enters; navigation remains plainly labelled |

Lusion and the first coded studies are excluded. Do not reintroduce their free-standing 3D stack, prototype controls, or arbitrary slogans.

## Foundations

The authoritative tokens are in `src/styles/globals.css`.

| Token  | Value     | Use                                      |
| ------ | --------- | ---------------------------------------- |
| Paper  | `#f5f4ef` | Primary page surface                     |
| Ink    | `#242723` | Main text and controls                   |
| Muted  | `#74776e` | Secondary labels                         |
| Line   | `#d8d9d0` | Project rows and content dividers        |
| Accent | `#3f5546` | Interactive accent and contextual cursor |
| Night  | `#202822` | Spatial work chapter and footer          |
| Hero   | `#deded5` | Portrait composition                     |

Use self-hosted Geist Variable for navigation, body copy, labels, and primary display type. Use Newsreader Variable italic for selective editorial emphasis. Do not make entire paragraphs italic. Body text starts at 16px with 1.6 line height; long-form project copy uses generous leading. Eyebrows use 10–11px uppercase with modest tracking.

Desktop headings use fluid scales: the hero name spans approximately the page width; work titles and section headings stay smaller. Mobile headings wrap deliberately. Preserve the hierarchy when content length changes; do not truncate project names.

## Layout and responsive composition

- Main content has a maximum width of 1240px. Page gutters use `clamp(24px, 5vw, 88px)`; phones use 24px.
- Use asymmetry for introductions and page headings, with restrained rules separating projects and facts. Keep generous pauses between chapters.
- The desktop hero integrates a portrait on the right and role text on the left. On phones, the portrait sits behind the middle of the composition; a gradient preserves name and role readability. Location and selected-work links remain above that overlay.
- At 960px, reduce multi-column spacing and project-row type. At 640px, use single-column content, a labelled Menu button, wrapped names, and touch-sized controls.
- Pointer image previews and the custom cursor apply only to hover-capable fine pointers. Mobile project rows remain direct links.

## Page compositions

| Page    | Content sequence                                                                                                                               |
| ------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| Home    | Portrait/name/roles → asymmetric introduction → spatial selected-work introduction → featured project rows → Lab introduction → contact footer |
| Work    | Heading/introduction → category filters → project rows → contact footer                                                                        |
| Project | Back link → title/summary/technologies → cover → ordered case-study sections → next project → contact footer                                   |
| Lab     | Heading/introduction → engineering explorations linked to their source project → contact footer                                                |
| About   | Heading → portrait and biography → engineering disciplines → contact footer                                                                    |
| Contact | Heading → email/location → project and role conversation paths → social links                                                                  |

There is no fake contact submission form. Contact actions open Bryan's email address, with a subject identifying a project inquiry or engineering role.

## Motion and 3D contract

The motion follows content and the selected reference pieces:

1. **Opening:** Bryan's name moves horizontally by a small amount as the hero leaves the viewport. It remains live text.
2. **Section entrances:** content rises 36px and fades in over 0.85 seconds with `power3.out`, once as it enters the viewport.
3. **Selected work:** actual project covers are textured planes in a Three.js scene. Scroll progress changes their rotation, separation, and depth. Published covers become same-origin PNG textures during media preparation. The chapter heading and supporting text remain normal HTML; static covers remain visible until a real scene frame renders.
4. **Project interaction:** the associated image appears over a hovered project row; an 84px circular View cursor names the action. Keyboard and touch users can use the same project links directly.
5. **Controls:** links, navigation dots, and the circular About action use short CSS transitions. Do not add loading sequences that delay reading.

Load WebGL near the viewport. Render on demand, cap pixel ratio at 1.5, and remove triggers/listeners and scene resources with their owner. If reduced motion is requested, omit scroll animation and show static project covers. If WebGL fails, preserve the same text, static media, and destinations. Do not hide essential content behind canvas or hydration.

## Editing and components

Sanity owns the profile, portrait, roles, biography, contact details, project information, project order/featured status, and Lab content. Project case studies use reorderable designed sections:

- Text: heading and rich text.
- Image: accessible image and optional caption.
- Gallery: related images with alternative text and captions.
- Facts / Architecture: label–value pairs.

Section order comes from content. Layout, responsive behaviour, transitions, and 3D code stay in the application. Do not expose arbitrary HTML, scripts, or animation code through CMS fields.

Use shared Header, Footer, Arrow, motion lifecycle, and project-row components. Maintain the boundaries in [the architecture](architecture.md).

## Review and maintenance

Review the real content and reference composition before changing a section. Record the chosen piece, content purpose, layout, interaction, and mobile/reduced-motion states before coding a new visual direction. Browser verification establishes whether the result matches that decision; it does not replace making the decision first.

Check portrait legibility, whitespace, type hierarchy, useful copy, named navigation, project filter behaviour, keyboard focus, narrow layouts, WebGL readiness, and readable generated HTML. Update this guide and [the decision log](decisions.md) when the design changes.
