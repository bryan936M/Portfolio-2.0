"use client";

import { scroll } from "motion";
import { useEffect, useId, useRef } from "react";
import "@/styles/home-branch.css";

const shoots = [
  { x: 96, y: 9.6, angle: -21 },
  { x: 74, y: 19.4, angle: 25, reverse: true },
  { x: 112, y: 31.8, angle: -17 },
  { x: 81, y: 44.6, angle: 21, reverse: true },
  { x: 104, y: 56.8, angle: 7 },
  { x: 82, y: 69.1, angle: -14 },
  { x: 115, y: 80.8, angle: 8, reverse: true },
  { x: 90, y: 91.7, angle: 21 },
];

export function HomeBranch() {
  const branch = useRef<HTMLDivElement>(null);
  const artwork = useRef<HTMLDivElement>(null);
  const stemGradient = useId();
  const leafGradient = useId();

  useEffect(() => {
    const target = branch.current;
    const layer = artwork.current;
    if (!target || !layer) return;

    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let cancelScroll: (() => void) | undefined;
    const syncMotion = () => {
      cancelScroll?.();
      if (preference.matches) {
        layer.style.removeProperty("clip-path");
        return;
      }
      cancelScroll = scroll(
        (progress) => {
          layer.style.clipPath = `inset(0 0 ${(1 - progress) * 100}% 0)`;
        },
        { target, offset: ["start 0.68", "end end"] },
      );
    };

    syncMotion();
    preference.addEventListener("change", syncMotion);
    return () => {
      preference.removeEventListener("change", syncMotion);
      cancelScroll?.();
      layer.style.removeProperty("clip-path");
    };
  }, []);

  return (
    <div className="home-branch" ref={branch} aria-hidden="true">
      <div className="home-branch-artwork" ref={artwork}>
        <svg className="home-branch-stem" viewBox="0 0 150 1000" preserveAspectRatio="none">
          <defs>
            <linearGradient id={stemGradient}>
              <stop offset="0" stopColor="var(--branch-highlight)" />
              <stop offset=".48" stopColor="var(--accent)" />
              <stop offset="1" stopColor="var(--branch-shadow)" />
            </linearGradient>
          </defs>
          <path
            fill={`url(#${stemGradient})`}
            d="M151 -4C131 24 109 53 96 84S65 147 69 187 111 248 115 304 67 373 75 432 112 492 105 554 67 624 77 680 121 745 113 800 79 868 87 916 108 968 112 997C105 965 88 951 83 916S106 835 109 800 82 733 73 680 94 597 99 554 79 477 70 432 111 346 108 304 65 228 61 187 74 119 86 84 120 24 140-4Z"
          />
        </svg>
        <svg className="home-branch-defs">
          <defs>
            <linearGradient id={leafGradient} x2=".7" y2="1">
              <stop stopColor="var(--branch-highlight)" />
              <stop offset="1" stopColor="var(--accent)" />
            </linearGradient>
          </defs>
        </svg>
        {shoots.map(({ x, y, angle, reverse }) => (
          <svg
            key={y}
            className="home-branch-shoot"
            viewBox="0 0 96 78"
            style={{
              left: `${x / 1.5}%`,
              top: `${y}%`,
              transform: `translate(-50%, -50%) rotate(${angle}deg) scaleX(${reverse ? -1 : 1})`,
            }}
          >
            <path
              d="M48 39C33 37 22 26 13 19M34 35C28 38 23 47 14 51"
              stroke="var(--accent)"
              strokeWidth="1.4"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M28 33C13 34 5 22 1 8 14 10 27 16 28 33ZM29 39C24 51 11 56 2 55 9 43 20 38 29 39Z"
              fill={`url(#${leafGradient})`}
            />
            <path
              d="M28 33C18 25 11 18 1 8M29 39C21 47 12 51 2 55"
              stroke="var(--branch-highlight)"
              strokeWidth=".65"
              fill="none"
            />
          </svg>
        ))}
      </div>
    </div>
  );
}
