"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function SiteMotion() {
  const path = usePathname();
  const cursor = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((node) => {
        gsap.from(node, {
          y: 36,
          opacity: 0,
          duration: 0.85,
          ease: "power3.out",
          scrollTrigger: { trigger: node, start: "top 92%", once: true },
          clearProps: "transform,opacity",
        });
      });
      const name = document.querySelector("[data-hero-name]");
      if (name)
        gsap.to(name, {
          xPercent: -7,
          ease: "none",
          scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: "bottom top",
            scrub: 0.7,
          },
        });
    });
    let x = 0,
      y = 0,
      frame = 0;
    const fine = window.matchMedia("(hover:hover) and (pointer:fine)");
    const move = (event: PointerEvent) => {
      if (!cursor.current || !fine.matches) return;
      const link = (event.target as HTMLElement).closest("[data-cursor]");
      cursor.current.classList.toggle("is-visible", Boolean(link));
      if (link)
        cursor.current.textContent = link.getAttribute("data-cursor") || "View";
      x = event.clientX;
      y = event.clientY;
      if (!frame)
        frame = requestAnimationFrame(() => {
          if (cursor.current)
            cursor.current.style.transform = `translate3d(${x}px,${y}px,0)`;
          frame = 0;
        });
    };
    const hide = () => cursor.current?.classList.remove("is-visible");
    document.addEventListener("pointermove", move);
    document.addEventListener("pointerleave", hide);
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    document.fonts.ready.then(refresh);
    return () => {
      mm.revert();
      cancelAnimationFrame(frame);
      document.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", hide);
      window.removeEventListener("load", refresh);
      hide();
    };
  }, [path]);
  return (
    <div ref={cursor} className="context-cursor" aria-hidden="true">
      View
    </div>
  );
}
