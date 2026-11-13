import { animate } from "motion/react";

const scrollKeys = new Set(["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " ", "Tab"]);

export function bindChapterScroll(main: HTMLElement, motion: MediaQueryList) {
  const listeners = new AbortController();
  const { signal } = listeners;
  let animation: ReturnType<typeof animate> | undefined;
  const stop = () => {
    animation?.stop();
    animation = undefined;
  };

  main.addEventListener("click", (event) => {
    if (event.defaultPrevented || event.button !== 0 ||
        event.metaKey || event.ctrlKey || event.shiftKey || event.altKey ||
        !(event.target instanceof Element)) return;
    const link = event.target.closest<HTMLAnchorElement>(
      '.ribbon-hero a[href^="#"], .ribbon-navigation a[href^="#"]',
    );
    if (!link || link.target || link.hasAttribute("download")) return;
    const hash = link.hash;
    const chapter = hash === "#top" ? main.querySelector<HTMLElement>(".ribbon-hero") :
      document.getElementById(hash.slice(1));
    if (!chapter) return;

    event.preventDefault();
    stop();
    const start = window.scrollY;
    const root = document.documentElement;
    const padding = parseFloat(getComputedStyle(root).scrollPaddingTop) || 0;
    const margin = parseFloat(getComputedStyle(chapter).scrollMarginTop) || 0;
    const target = hash === "#top" ? 0 : Math.max(0, Math.min(
      root.scrollHeight - root.clientHeight,
      chapter.getBoundingClientRect().top + start - padding - margin,
    ));
    if (location.hash !== hash) {
      history.pushState({ ribbonOpenPanels: history.state?.ribbonOpenPanels }, "", hash);
    }
    const finish = () => {
      window.scrollTo({ top: target, behavior: "instant" });
      chapter.focus({ preventScroll: true });
      animation = undefined;
    };
    const distance = Math.abs(start - target);
    if (motion.matches || distance < 2) {
      finish();
      return;
    }
    animation = animate(start, target, {
      duration: Math.min(1.4, Math.max(0.65, distance / 1550)),
      ease: [0.45, 0, 0.25, 1],
      onUpdate: (top) => window.scrollTo({ top, behavior: "instant" }),
      onComplete: finish,
    });
  }, { signal });
  for (const event of ["wheel", "touchstart", "popstate", "pagehide"]) {
    window.addEventListener(event, stop, { passive: true, signal });
  }
  window.addEventListener("keydown", (event) => {
    if (scrollKeys.has(event.key)) stop();
  }, { signal });
  motion.addEventListener("change", stop, { signal });
  return () => {
    stop();
    listeners.abort();
  };
}
