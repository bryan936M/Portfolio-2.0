export const openingBootstrap = `(() => {
  const root = document.documentElement;
  const navigation = performance.getEntriesByType("navigation")[0];
  const motion = matchMedia("(prefers-reduced-motion: reduce)");
  if (location.pathname !== "/" || location.hash || scrollY !== 0 ||
      !navigation || navigation.type === "back_forward" || document.hidden ||
      motion.matches || !CSS.supports("selector(:has(*))")) return;

  const listeners = new AbortController();
  const { signal } = listeners;
  let deadline;
  let frame;

  function finish() {
    root.removeAttribute("data-home-opening");
    for (const property of ["--handoff-x", "--handoff-y", "--handoff-scale"]) {
      root.style.removeProperty(property);
    }
    listeners.abort();
    clearTimeout(deadline);
    cancelAnimationFrame(frame);
  }

  function start() {
    const opening = document.getElementById("home-opening");
    const mark = opening?.firstElementChild;
    const headerMark = document.querySelector(".site-header .identity-mark");
    if (!opening || !mark || !headerMark) {
      finish();
      return;
    }

    frame = requestAnimationFrame(() => {
      const from = mark.getBoundingClientRect();
      const to = headerMark.getBoundingClientRect();
      if (!from.width || !to.width) {
        finish();
        return;
      }

      root.style.setProperty("--handoff-x", (to.left + to.width / 2 - from.left - from.width / 2) + "px");
      root.style.setProperty("--handoff-y", (to.top + to.height / 2 - from.top - from.height / 2) + "px");
      root.style.setProperty("--handoff-scale", String(to.width / from.width));
      opening.addEventListener("animationend", event => {
        if (event.target === opening && event.animationName === "home-opening-visibility") finish();
      }, { signal });

      clearTimeout(deadline);
      deadline = setTimeout(finish, 3500);
      root.dataset.homeOpening = "playing";
    });
  }

  root.dataset.homeOpening = "pending";
  deadline = setTimeout(finish, 8000);
  for (const event of ["pointerdown", "wheel", "touchmove", "keydown"]) {
    window.addEventListener(event, event => {
      if (event.isTrusted) finish();
    }, { capture: true, passive: true, signal });
  }
  for (const event of ["pagehide", "popstate", "hashchange"]) {
    window.addEventListener(event, finish, { signal });
  }
  motion.addEventListener("change", finish, { signal });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true, signal });
  } else {
    start();
  }
})();`;
