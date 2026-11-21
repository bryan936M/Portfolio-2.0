"use client";

import dynamic from "next/dynamic";
import { Component, useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { countryLabels, globePoint, globeScreen, type WorkCountry } from "@/content/work-countries";

const WorkLocationsScene = dynamic(() => import("@/three/WorkLocationsScene"), { ssr: false });
class SceneBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? null : this.props.children; }
}

export function WorkGlobe({ countries, children }: { countries: WorkCountry[]; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);
  const [reduced, setReduced] = useState(true);
  const [ready, setReady] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const [focused, setFocused] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const active = hovered || focused || selected;
  const dense = countries.length > 6;
  const labels = countryLabels(countries);
  const onReady = useCallback((value: boolean) => setReady(value), []);
  useEffect(() => {
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    const colors = matchMedia("(forced-colors: active)");
    const sync = () => { const staticOnly = media.matches || colors.matches; setReduced(staticOnly); if (staticOnly) setReady(false); };
    sync(); media.addEventListener("change", sync); colors.addEventListener("change", sync);
    const observer = new IntersectionObserver(entries => { if (entries.some(entry => entry.isIntersecting)) { setNear(true); observer.disconnect(); } }, { rootMargin: "200px" });
    if (ref.current) observer.observe(ref.current);
    return () => { media.removeEventListener("change", sync); colors.removeEventListener("change", sync); observer.disconnect(); };
  }, []);

  return <div ref={ref} className={`work-globe${dense ? " work-globe-dense" : ""}`} data-ready={ready} data-active={active || undefined}>
    <div className="work-globe-stage">
      {children}
      {near && !reduced && <SceneBoundary><WorkLocationsScene countries={countries} active={active} onReady={onReady} /></SceneBoundary>}
      <svg className="work-globe-leaders" viewBox="0 0 600 600" aria-hidden="true" focusable="false">
        {labels.map(country => {
          const root = globeScreen(globePoint(country.longitude, country.latitude, 1.023));
          const tip = globeScreen(globePoint(country.longitude, country.latitude, 1.14));
          const endX = country.side === "left" ? country.x + 78 : country.x - 78;
          return <g key={country.code} data-country={country.code} data-highlight={active === country.code}>
            {!dense && <polyline data-leader points={`${tip.join(",")} ${endX + (country.side === "left" ? 14 : -14)},${country.y} ${endX},${country.y}`} />}
            <line data-stem x1={root[0]} y1={root[1]} x2={tip[0]} y2={tip[1]} />
            <circle data-root cx={root[0]} cy={root[1]} r="3" />
            <circle data-tip cx={tip[0]} cy={tip[1]} r="4.5" />
          </g>;
        })}
      </svg>
    </div>
    <ul className="work-globe-labels" aria-label="Countries where I’ve worked">
      {labels.map(country => <li key={country.code} style={dense ? undefined : { left: `${country.x / 6}%`, top: `${country.y / 6}%` }} data-side={country.side}>
        <button type="button" aria-pressed={selected === country.code} data-work-country={country.code} data-highlight={active === country.code}
          onPointerEnter={event => { if (event.pointerType === "mouse") setHovered(country.code); }} onPointerLeave={() => setHovered(null)}
          onFocus={() => setFocused(country.code)} onBlur={() => setFocused(null)}
          onClick={() => setSelected(value => value === country.code ? null : country.code)}
          onKeyDown={event => { if (event.key === "Escape") { setSelected(null); event.currentTarget.blur(); } }}>
          <span className="work-country-dot" aria-hidden="true" />{country.name}
        </button>
      </li>)}
    </ul>
  </div>;
}
