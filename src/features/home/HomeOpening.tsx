import { BrandMark } from "@/components/ui/BrandMark";
import "@/styles/home-opening.css";

// This fixed script runs as the homepage HTML is parsed, before the hero paints.
// It owns the decorative layer and leaves the server-rendered content readable.
const startHomeOpening = `
(() => {
  if (
    location.hash || window.scrollY !== 0 || document.hidden ||
    matchMedia("(prefers-reduced-motion: reduce)").matches ||
    !CSS.supports("selector(:has(*))")
  ) return;

  const opening = document.getElementById("home-opening");
  const mark = opening?.firstElementChild;
  const headerMark = document.querySelector(".site-header .identity-mark");
  if (!mark || !headerMark) return;

  const start = mark.getBoundingClientRect();
  const end = headerMark.getBoundingClientRect();
  if (!start.width || !end.width) return;

  opening.style.setProperty("--handoff-x", (end.left + end.width / 2 - start.left - start.width / 2) + "px");
  opening.style.setProperty("--handoff-y", (end.top + end.height / 2 - start.top - start.height / 2) + "px");
  opening.style.setProperty("--handoff-scale", end.width / start.width);

  const listeners = new AbortController();
  const stop = () => {
    opening.removeAttribute("data-playing");
    opening.removeAttribute("style");
    listeners.abort();
    clearTimeout(deadline);
  };
  const deadline = setTimeout(stop, 3000);
  opening.addEventListener("animationend", (event) => {
    if (event.animationName === "home-opening-visibility") stop();
  }, { signal: listeners.signal });
  for (const event of ["keydown", "focusin", "pointerdown", "scroll", "resize", "pagehide"]) {
    window.addEventListener(event, stop, { capture: true, passive: true, signal: listeners.signal });
  }
  opening.setAttribute("data-playing", "");
})();`;

export function HomeOpening() {
  return (
    <>
      <div
        id="home-opening"
        className="home-opening"
        aria-hidden="true"
        suppressHydrationWarning
      >
        <BrandMark className="home-opening-mark" />
      </div>
      <script dangerouslySetInnerHTML={{ __html: startHomeOpening }} />
    </>
  );
}
