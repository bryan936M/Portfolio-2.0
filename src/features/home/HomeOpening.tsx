"use client";

import { useLayoutEffect, useRef } from "react";
import { BrandMark } from "@/components/ui/BrandMark";
import "@/styles/home-opening.css";

let hasPlayed = false;

export function HomeOpening() {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const navigation = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    if (hasPlayed) return;
    if (!navigation || navigation.type === "back_forward" ||
        new URL(navigation.name).pathname !== "/" || location.hash ||
        window.scrollY !== 0 || document.hidden || motion.matches ||
        !CSS.supports("selector(:has(*))")) {
      hasPlayed = true;
      return;
    }

    const opening = ref.current;
    const mark = opening?.firstElementChild;
    const headerMark = document.querySelector(".site-header .identity-mark");
    if (!opening || !mark || !headerMark) return;
    const start = mark.getBoundingClientRect();
    const end = headerMark.getBoundingClientRect();
    if (!start.width || !end.width) return;

    opening.style.setProperty("--handoff-x", `${end.left + end.width / 2 - start.left - start.width / 2}px`);
    opening.style.setProperty("--handoff-y", `${end.top + end.height / 2 - start.top - start.height / 2}px`);
    opening.style.setProperty("--handoff-scale", String(end.width / start.width));

    const listeners = new AbortController();
    const { signal } = listeners;
    const frame = requestAnimationFrame(() => { hasPlayed = true; });
    const deadline = window.setTimeout(stop, 3000);

    function cleanup() {
      listeners.abort();
      cancelAnimationFrame(frame);
      clearTimeout(deadline);
      opening?.removeAttribute("data-playing");
      opening?.removeAttribute("style");
    }

    function stop() {
      hasPlayed = true;
      cleanup();
    }

    opening.addEventListener("animationend", (event) => {
      if (event.animationName === "home-opening-visibility") stop();
    }, { signal });
    for (const event of ["keydown", "focusin", "pointerdown", "scroll", "resize", "pagehide"]) {
      window.addEventListener(event, stop, { capture: true, passive: true, signal });
    }
    motion.addEventListener("change", stop, { signal });
    opening.setAttribute("data-playing", "");
    return cleanup;
  }, []);

  return (
    <div id="home-opening" className="home-opening" ref={ref} aria-hidden="true">
      <BrandMark className="home-opening-mark" />
    </div>
  );
}
