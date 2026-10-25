# Portfolio inspiration record

Updated: 2026-10-25 (Africa/Kigali)

This record separates Bryan's feedback from proposed adaptations and technical assumptions. Linked sites may change after the reviewed version. This is a reference map, not permission to reproduce another site's assets, composition, or code.

The initial coded portfolio studies were rejected. The next design must reuse selected reference pieces concretely, establishing content and composition before code. The broad influence mapping below is insufficient on its own; use the piece-level record that follows.

## Reference identity

“Scroll” is interpreted as the [KPR scroll element](https://www.awwwards.com/inspiration/scroll-kpr) linked earlier. This interpretation remains correctable if Bryan meant a different site.

## Bryan's feedback and design implications

| Reference | Bryan's response | Proposed application |
| --- | --- | --- |
| [Dennis Snellenberg](https://www.awwwards.com/sites/dennis-snellenberg) | Liked the whitespace, content organisation, introduction to each section, and strong emphasis on who Dennis is | Primary reference for pacing and personal presence: generous margins, deliberate section openings, a clear introduction to Bryan, and a coherent content hierarchy |
| [KPR / “Scroll”](https://www.awwwards.com/inspiration/scroll-kpr) | Strongly liked the transitions and animation; perceived a possible use of 3D. Navigation felt too gamified | Motion reference: choreographed transitions with a sense of depth and progression. Use straightforward labelled navigation. Determine the implementation from our own scene and interaction prototypes |
| [Unseen Studio](https://www.awwwards.com/sites/unseen-studio) | Liked typography, custom mouse/cursor, and the 3D depth; recognised that the gallery context explains the spatial presentation | Typography and spatial-interaction reference: expressive type, a contextual cursor on pointer devices, and depth appropriate to Bryan's work and identity |
| [Lusion](https://www.awwwards.com/sites/lusion) | Was not a fan | Rejected as a creative reference. Do not use it to justify the theme or direction |

Bryan's observation that KPR may use 3D is not a verified statement about its implementation. The Awwwards scroll entry is a behavioural reference; translating that feeling can involve HTML/CSS composition, animation, camera movement, or a combination. Exact technology is chosen after the portfolio's design and technical prototype are agreed.

## Reference-to-experience mapping — proposals

| Portfolio area | Reference influence | Proposed behaviour |
| --- | --- | --- |
| Header/navigation | Dennis's clarity; response to KPR's navigation | Clearly named Work, Lab, About, and Contact links with a Home identity link; current-page state and direct routes |
| Opening | Dennis's personal emphasis; Unseen's typography | Bryan's name, both engineering specialisations, and his confirmed real portrait occupy a clear hierarchy; the composition establishes who he is |
| Section introductions | Dennis's spacing and pacing | Enough breathing room to recognise a new chapter; concise introductory text followed by the section's substance |
| Section/route transitions | KPR's choreography; Unseen's depth | Explore a coordinated change of scale, position, masking, and/or camera depth, with a clear destination |
| Work previews | Unseen's spatial presentation; Dennis's organisation | Project information remains easy to scan; spatial previews communicate selection and lead to a project URL |
| Project case studies | Dennis's content hierarchy | Reading space, strong media sequences, and legible technical explanation using the agreed reorderable section model |
| Pointer interaction | Unseen's custom cursor | Cursor changes meaning over selected interactive media, with ordinary link, text-selection, and form behaviour preserved |
| 3D identity | Original concept derived from the combined direction | Develop a visual belonging to Bryan's engineering identity, with a role in the opening and transition language |

## Originality and evidence

- Use the reference's relevant principle, then design original compositions and behaviour for Bryan.
- Label prototype hypotheses and observations separately from confirmed implementation facts.
- Select specific moments to study before deriving camera paths, timing, easing, or scene complexity.
- A real portrait of Bryan is confirmed. The next visual studies should establish palette, typography, the portrait's treatment, and a 3D concept; those treatments are not approved yet.

## Specific pieces for the next composition

The live Dennis and Unseen pages and the Awwwards KPR Scroll clip were inspected in the browser on 2026-10-25. Observations below describe visible content/composition, not inferred source-code techniques. These are proposed pieces for reuse in the next design review; the combined page is not approved.

| Piece | Source and observed anatomy | What to retain in the composition study | Bryan-specific input/adaptation |
| --- | --- | --- | --- |
| D1 — Identity opening | [Dennis homepage](https://dennissnellenberg.com/): a large portrait integrated with the background, oversized name crossing its lower area, role text beside the portrait, identity top left and direct links top right | One integrated composition of portrait, name, role, and navigation; study the actual size/position relationships rather than a generic text/portrait card grid | Bryan's portrait, name, both specialisations, and agreed navigation; adapt to the agreed light editorial base. Exact crop and whether the name moves remain review choices |
| D2 — Introduction before work | [Dennis homepage](https://dennissnellenberg.com/): a wide introductory statement on the left, a narrower supporting paragraph on the right, an About action, then a substantial pause before the work index | The asymmetric two-column introduction and its transition in spacing into the work section | Requires Bryan-approved introduction/supporting content. Do not fill the columns with invented positioning slogans |
| D3 — Work index | [Dennis homepage](https://dennissnellenberg.com/): project-name rows separated by fine rules, contribution labels, and a floating image preview with a View action during pointer interaction | The scan-friendly row hierarchy, room around each project, and relationship between a row and its actual project image | Real project names, Bryan's contribution, project covers, and project-page destinations. Define a touch presentation during the design review |
| D4 — Contact fields | [Dennis Contact page](https://dennissnellenberg.com/contact): numbered, labelled fields in a spacious sequence beside direct contact details | The ordered field rhythm, clear labels, fine separators, and visible direct contact route | Reduce to Bryan's approved name, email, and message fields; use the existing light palette and circular action. Stack details and form on phones; retain keyboard focus, explicit errors, and static/native form submission |
| U1 — Typographic hierarchy | [Unseen homepage](https://unseen.co/): a small descriptive line, an expressive italic serif line, and a large sans-serif line form a single headline over the spatial scene | The relationship between contrasting type treatments and supporting text, with content defining where emphasis belongs | Choose an actual Bryan/project statement first. Typeface selection and exact line breaks follow that content; the previous prototype's fonts are not selected |
| U2 — Spatial presentation | [Unseen homepage](https://unseen.co/): architectural depth, foreground/background layers, and a clear work action share a composition | The use of depth to frame content and a real destination | Define a portfolio-specific content transition or work presentation. The reference's gallery setting explains its scene; Bryan's scene needs an equally clear purpose |
| U3 — Cursor behaviour | [Unseen homepage](https://unseen.co/); custom cursor liked by Bryan | Select the actual cursor states and their corresponding actions, then reuse those relationships | Cursor shape, size, tracking response, labels, and eligible targets still need a specific state-by-state review; no invented motion-preview label |
| K1 — Scroll choreography | [KPR Scroll by Resn](https://www.awwwards.com/inspiration/scroll-kpr): the 10.4-second recorded sequence changes the framing and scale of large illustrated content surfaces within an editorial layout | The selected sequence's content continuity and choreography; define start, intermediate, and end frames before implementation | Map it to actual portfolio content, such as the introduction of Work or a project cover/detail transition. Exact trigger and segment remain to be selected; exclude the gamified navigation |

The [KPR recording](https://assets.awwwards.com/awards/element/2022/12/63894ba076f82036571339.mp4) is a research reference. Its visual motion does not establish that a particular effect requires real-time 3D or a particular library.

## Required record for a selected piece

For each piece selected for the next composition, document:

1. Source URL and exact section, state, or clip interval.
2. The content/action it serves in Bryan's portfolio.
3. The source's arrangement, hierarchy, spacing relationships, and interaction states to retain.
4. The changes required by Bryan's content and agreed visual direction.
5. A static composition and, for motion, annotated start/intermediate/end frames with the user trigger.
6. Mobile, keyboard, and reduced-motion treatments.
7. Review outcome, followed by implementation only after the composition is agreed.
