"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { GlassCursor } from "./GlassCursor";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function SiteMotion() {
  const path = usePathname();
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
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    let active = true;
    void document.fonts.ready.then(() => { if (active) refresh(); });
    return () => {
      mm.revert();
      active = false;
      window.removeEventListener("load", refresh);
    };
  }, [path]);
  return <GlassCursor />;
}
