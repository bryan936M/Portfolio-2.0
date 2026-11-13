"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { scroll } from "motion";

const RibbonScene = dynamic(() => import("@/three/RibbonScene"), { ssr: false });
const destinations = [{ id: "top", label: "Bryan" }, { id: "about-bryan", label: "About" }, { id: "selected-work", label: "Work" }, { id: "inside-lab", label: "Lab" }];

export function RibbonJourney() {
  const [current, setCurrent] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(true);
  useEffect(() => {
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduceMotion(media.matches);
    sync(); media.addEventListener("change", sync);
    const sections = [...document.querySelectorAll<HTMLElement>("[data-ribbon-stop]")];
    const cancel = scroll(() => {
      let active = 0;
      sections.forEach((section, index) => { if (section.getBoundingClientRect().top <= innerHeight * .5) active = index; });
      setCurrent(active);
    });
    return () => { cancel(); media.removeEventListener("change", sync); };
  }, []);
  return <>
    <div className="ribbon-world" aria-hidden="true"><div className="ribbon-still" />{!reduceMotion && <RibbonScene />}</div>
    <nav className="ribbon-navigation" aria-label="Homepage chapters">{destinations.map((destination, index) => <a key={destination.id} href={`#${destination.id}`} aria-current={index === current ? "location" : undefined}><span className="ribbon-nav-dot" />{destination.label}</a>)}</nav>
  </>;
}
