"use client";

import { useState } from "react";

export function MobileHeroMarquee({ name }: { name: string }) {
  const [paused, setPaused] = useState(false);

  return (
    <div className="ribbon-mobile-marquee" data-paused={paused}>
      <div className="ribbon-marquee-window" aria-hidden="true">
        <div className="ribbon-marquee-track">
          <span>{name}</span>
          <span>{name}</span>
        </div>
      </div>
      <button
        type="button"
        className="ribbon-marquee-pause"
        aria-label={paused ? "Resume name animation" : "Pause name animation"}
        onClick={() => setPaused(value => !value)}
      >
        {paused ? "▶" : "Ⅱ"}
      </button>
    </div>
  );
}
