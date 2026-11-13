type Disclosure = {
  details: HTMLDetailsElement;
  summary: HTMLElement;
  panel: HTMLElement;
  group: string | null;
  motion?: Animation;
  closing: boolean;
};

export function bindDisclosures(main: HTMLElement, reducedMotion: MediaQueryList) {
  const items: Disclosure[] = [];
  for (const details of main.querySelectorAll<HTMLDetailsElement>(".ribbon-detail, .ribbon-project")) {
    const summary = details.querySelector("summary");
    const panel = details.querySelector<HTMLElement>("[data-disclosure-panel]");
    if (summary && panel) items.push({ details, summary, panel, group: details.getAttribute("name"), closing: false });
  }
  const saved = history.state?.ribbonOpenPanels;
  if (Array.isArray(saved)) {
    for (const { details } of items) {
      details.open = saved.includes(details.dataset.disclosureKey);
    }
  }
  const listeners = new AbortController();
  const { signal } = listeners;
  const projects = main.querySelector(".ribbon-projects");
  let heldHeading: HTMLElement | undefined;
  let headingTop = 0;
  let frame = 0;

  function releaseHeading() {
    cancelAnimationFrame(frame);
    heldHeading = undefined;
    projects?.removeAttribute("data-holding-heading");
  }

  function followHeading() {
    if (!heldHeading) return;
    const delta = heldHeading.getBoundingClientRect().top - headingTop;
    if (Math.abs(delta) >= 1) window.scrollBy({ top: delta, behavior: "instant" });
    if (items.some(item => item.group && item.motion)) frame = requestAnimationFrame(followHeading);
    else releaseHeading();
  }

  function settle(item: Disclosure, open: boolean) {
    item.details.open = open;
    item.motion?.cancel();
    item.motion = undefined;
    item.closing = false;
    item.panel.inert = false;
    item.summary.removeAttribute("aria-expanded");
    item.details.removeAttribute("data-closing");
  }

  function toggle(item: Disclosure, open: boolean) {
    const { details, summary, panel } = item;
    const start = details.open ? panel.getBoundingClientRect().height : 0;
    const opacity = details.open ? getComputedStyle(panel).opacity : "0";
    if (!open && panel.contains(document.activeElement)) summary.focus({ preventScroll: true });
    item.motion?.cancel();
    details.open = true;
    item.closing = !open;
    panel.inert = !open;
    details.toggleAttribute("data-closing", !open);
    summary.setAttribute("aria-expanded", String(open));
    const end = open ? panel.scrollHeight : 0;
    const animation = panel.animate([
      { height: `${start}px`, opacity },
      { height: `${end}px`, opacity: open ? 1 : 0 },
    ], { duration: 300, easing: "cubic-bezier(.25, .1, .25, 1)", fill: "both" });
    item.motion = animation;
    animation.onfinish = () => {
      if (item.motion === animation) settle(item, open);
    };
  }

  function syncMotion() {
    releaseHeading();
    for (const item of items) {
      if (item.motion) settle(item, !item.closing);
      if (!item.group) continue;
      if (reducedMotion.matches) item.details.setAttribute("name", item.group);
      else item.details.removeAttribute("name");
    }
  }

  function saveOpenPanels() {
    const ribbonOpenPanels = items.filter(item => item.details.open && !item.closing)
      .map(item => item.details.dataset.disclosureKey);
    history.replaceState({ ...history.state, ribbonOpenPanels, ribbonReadingScroll: undefined }, "");
  }

  for (const item of items) {
    item.details.addEventListener("toggle", () => {
      if (reducedMotion.matches && main.contains(item.details)) saveOpenPanels();
    }, { signal });
    item.summary.addEventListener("click", (event) => {
      if (reducedMotion.matches) return;
      event.preventDefault();
      releaseHeading();
      const open = !item.details.open || item.closing;
      if (open && item.group) {
        const others = items.filter(other => other !== item && other.group === item.group && other.details.open);
        const closingAbove = others.some(other => Boolean(
          other.details.compareDocumentPosition(item.details) & Node.DOCUMENT_POSITION_FOLLOWING,
        ));
        if (closingAbove) {
          heldHeading = item.summary;
          const rect = heldHeading.getBoundingClientRect();
          headingTop = Math.max(24, Math.min(rect.top, window.innerHeight - rect.height - 92));
          projects?.setAttribute("data-holding-heading", "");
          frame = requestAnimationFrame(followHeading);
        }
        for (const other of others) if (!other.closing) toggle(other, false);
      }
      toggle(item, open);
      saveOpenPanels();
    }, { signal });
  }

  syncMotion();
  reducedMotion.addEventListener("change", syncMotion, { signal });
  for (const event of ["wheel", "touchstart", "popstate", "pagehide"]) {
    window.addEventListener(event, releaseHeading, { passive: true, signal });
  }
  window.addEventListener("keydown", (event) => {
    if (["ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End", "Tab", " "].includes(event.key)) releaseHeading();
  }, { signal });
  return () => {
    listeners.abort();
    releaseHeading();
    for (const item of items) if (item.motion) settle(item, !item.closing);
    for (const item of items) if (item.group) item.details.setAttribute("name", item.group);
  };
}
