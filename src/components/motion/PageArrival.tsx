"use client";

import { usePathname } from "next/navigation";
import { useLayoutEffect, useRef } from "react";
import { clearPageTopRequest, consumePageTopRequest } from "@/components/layout/SiteLink";

export function PageArrival() {
  const path = usePathname();
  const previousPath = useRef(path);
  const veil = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    window.addEventListener("popstate", clearPageTopRequest, { capture: true });
    return () => window.removeEventListener("popstate", clearPageTopRequest, { capture: true });
  }, []);

  useLayoutEffect(() => {
    if (previousPath.current === path) return;
    previousPath.current = path;
    let restoreFrame: number | undefined;
    if (consumePageTopRequest(path)) {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      document.getElementById("main")?.focus({ preventScroll: true });
    } else if (path === "/" && Number.isFinite(history.state?.ribbonReadingScroll)) {
      const top = history.state.ribbonReadingScroll;
      restoreFrame = requestAnimationFrame(() => window.scrollTo({ top, behavior: "instant" }));
    }
    const animation = matchMedia("(prefers-reduced-motion: reduce)").matches ? undefined :
      veil.current?.animate([{ opacity: 0.94 }, { opacity: 0 }], {
      duration: 260,
      easing: "ease-out",
    });
    return () => {
      if (restoreFrame !== undefined) cancelAnimationFrame(restoreFrame);
      animation?.cancel();
    };
  }, [path]);

  return <div ref={veil} className="page-arrival" aria-hidden="true" />;
}
