"use client";

import { usePathname } from "next/navigation";
import { motion, useSpring } from "motion/react";
import { useEffect, useRef } from "react";

const interactive = 'a[href], button:not(:disabled), summary, [role="button"], select:not(:disabled)';
const nativePointer = 'input, textarea, [contenteditable]:not([contenteditable="false"]), [role="textbox"], iframe';

export function GlassCursor() {
  const path = usePathname();
  const cursor = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);
  const x = useSpring(0, { stiffness: 650, damping: 44 });
  const y = useSpring(0, { stiffness: 650, damping: 44 });

  useEffect(() => {
    if (!cursor.current || !label.current) return;
    const lens = cursor.current;
    const caption = label.current;
    const root = document.documentElement;
    const media = matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference) and (forced-colors: none)");
    const listeners = new AbortController();
    const { signal } = listeners;
    let active = false;
    let previous: Element | null = null;
    let ripple: Animation | undefined;
    let pointerX = 0;
    let pointerY = 0;
    let frame = 0;

    function hide() {
      active = false;
      previous = null;
      lens.removeAttribute("data-visible");
      lens.dataset.mode = "idle";
      caption.textContent = "";
      root.removeAttribute("data-glass-cursor");
      ripple?.cancel();
      cancelAnimationFrame(frame);
      frame = 0;
    }

    function updateTarget(target: Element | null) {
      if (!target || target.closest(nativePointer)) {
        hide();
        return;
      }
      if (!active) {
        x.jump(pointerX);
        y.jump(pointerY);
        lens.setAttribute("data-visible", "");
        root.setAttribute("data-glass-cursor", "");
        active = true;
      }
      const control = target.closest(interactive);
      if (control === previous) return;
      previous = control;
      const text = control?.getAttribute("data-cursor") ?? "";
      caption.textContent = text;
      lens.dataset.mode = text ? "label" : control ? "hover" : "idle";
      ripple?.cancel();
      if (control) ripple = lens.querySelector(".glass-cursor-ripple")?.animate([
        { opacity: 0.8, transform: "scale(.58)" },
        { opacity: 0, transform: "scale(1.45)" },
      ], { duration: 420, easing: "ease-out" });
    }

    document.addEventListener("pointermove", (event) => {
      if (!media.matches || event.pointerType !== "mouse") {
        hide();
        return;
      }
      pointerX = event.clientX;
      pointerY = event.clientY;
      x.set(pointerX);
      y.set(pointerY);
      updateTarget(event.target instanceof Element ? event.target : null);
    }, { passive: true, signal });
    document.addEventListener("pointerleave", hide, { signal });
    document.addEventListener("scroll", () => {
      if (!active || frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        updateTarget(document.elementFromPoint(pointerX, pointerY));
      });
    }, { capture: true, passive: true, signal });
    window.addEventListener("blur", hide, { signal });
    document.addEventListener("visibilitychange", hide, { signal });
    media.addEventListener("change", hide, { signal });
    return () => {
      hide();
      listeners.abort();
    };
  }, [path, x, y]);

  return (
    <motion.div ref={cursor} className="glass-cursor" style={{ x, y }} aria-hidden="true">
      <div className="glass-cursor-lens">
        <span className="glass-cursor-ripple" />
        <span className="glass-cursor-label" ref={label} />
      </div>
    </motion.div>
  );
}
