# Homepage evolution · visitor journey draft

Draft for review · 13 November 2026

The homepage is one continuous 3D environment built around a tree at the scale of a place. Scroll moves the camera through that space. Each destination gives the visitor a moment to look, read a short piece of context, or follow a link. Scrolling back retraces the route. The familiar navigation gives visitors a direct way to reach Work, Lab, About, or Contact.

The visual starting point is Bryan’s current site. Carry forward the BM monogram, portrait, editorial typography, and green tones. Compose each view around the tree first, then find a quiet part of the frame for Bryan’s name, the story, or a project link. The visitor should be able to recognise the same tree from roots to canopy through recurring details such as the bark, the first fork, and the direction of the light.

## What the visitor experiences

1. **Arrive at the base.** The familiar BM loader hands off to the first view. The camera is at ground level and close enough that the trunk rises out of frame. A root in the foreground and leaves far above establish scale. Bryan’s name, portrait, and both engineering roles introduce him. A scroll cue invites exploration and **Selected work** gives a recruiter or client a shortcut.
2. **Go beneath the roots.** The first scroll takes the visitor forward under a raised root. The ground passes close to the camera and the light changes as the camera enters the space beneath it. Once the view settles, a short About passage explains where Bryan’s story began. The draft can use the current bio until Bryan supplies a specific memory or turning point.
3. **Climb alongside the trunk.** The camera comes back into daylight and follows the bark upwards. This is where a short explanation connects Bryan’s work across web applications, backend systems, and generative AI. The first large fork comes into view before the visitor reaches the work.
4. **Reach selected work at the fork.** The camera opens onto a view across several limbs. The selected projects are reachable from this one stop. Start with Umucyo Catalog AI as the featured project because it spans full-stack and AI engineering. Its name and a short description lead to the existing case study. Hovering or focusing a project link can bring its branch or preview into focus. A visitor can open any listed project directly, including on touch.
5. **Enter the canopy for the Lab.** Near leaves cross the foreground and gaps open to the sky. A small Lab introduction points to current experiments such as schema generation and catalog retrieval. The environment provides the transition while the Lab link explains where the visitor can read more.
6. **End with a view out from the canopy.** The camera settles on an open horizon with room for the contact invitation. Use the current footer’s contact action, direct email, and link groups to make the next step familiar.

## What each animation does

| Animation | What the visitor sees |
| --- | --- |
| Smooth loader | The existing BM assembly and handoff on homepage loads and reloads. A matching still can carry the first frame while the 3D scene finishes loading. |
| Entrance reveal | The name and roles come in with the opening. Later, short chapter text appears as the camera reaches a readable view. |
| 3D motion | Native scroll moves the camera through one world. Compose the camera position and where it looks together, with room to pause and read at each destination. |
| Parallax | Nearby roots, bark, and leaves pass across the screen faster than distant geometry as the camera moves. Keep copy steady while visitors read. |
| Hover effects | Project links give immediate visual feedback and can highlight the corresponding part of the scene. Keyboard focus gets the same cue, and touch uses direct taps. |

The HTML carries the headings, copy, and links. A visitor with reduced motion or without WebGL can read the same journey with still frames and use the same links. In the eventual implementation, use the Motion AI Kit for animation guidance and examples, Motion for new interface animations, and the existing Three.js stack for the environment. One scroll position should drive the camera and chapter state. [Motion AI Kit](https://motion.dev/docs/ai-kit-install) · [Motion scroll and parallax](https://motion.dev/docs/react-scroll-animations)

Before implementing, decide how much of the opening frame belongs to the portrait, what personal moment belongs beneath the roots, and which project deserves the first close view. The next design review can compare three frames from the same opening move: standing beside the trunk, passing beneath the root, and arriving at the first readable view.

The references for that opening are Montfort’s full-screen scale and sparse copy, Selva’s continuous movement between composed views, and Verdant’s transition below ground. [Montfort Trading](https://mont-fort.com/trading/) · [Selva case study](https://isolume.studio/work/selva) · [Verdant source](https://github.com/AcidAlchamy/verdant)
