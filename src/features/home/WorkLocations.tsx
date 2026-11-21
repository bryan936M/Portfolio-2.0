import { useId } from "react";
import shape from "@/content/globe-shape.json";
import { resolveWorkCountries } from "@/content/work-countries";
import { WorkGlobe } from "./WorkGlobe";
import "@/styles/work-globe.css";

export function WorkLocations({ codes }: { codes: string[] }) {
  const countries = resolveWorkCountries(codes);
  const id = useId().replace(/:/g, "");
  if (!countries.length) return null;
  return <figure className="work-locations" aria-labelledby={`${id}-caption`}>
    <WorkGlobe countries={countries}>
      <svg className="work-globe-still" viewBox="0 0 600 600" aria-hidden="true" focusable="false">
        <defs>
          <radialGradient id={`${id}-ocean`} cx="32%" cy="24%" r="80%">
            <stop stopColor="#fafbf7" /><stop offset=".48" stopColor="#e0e7dc" /><stop offset=".82" stopColor="#b5c5b6" /><stop offset="1" stopColor="#e8eee4" />
          </radialGradient>
          <linearGradient id={`${id}-land`} x2="1" y2="1">
            <stop stopColor="#d9e5d7" /><stop offset=".5" stopColor="#92ac9b" /><stop offset="1" stopColor="#c9d7c4" />
          </linearGradient>
          <radialGradient id={`${id}-shine`} cx="29%" cy="22%" r="75%">
            <stop stopColor="#fff" stopOpacity=".8" /><stop offset=".42" stopColor="#fff" stopOpacity="0" /><stop offset=".9" stopColor="#fff" stopOpacity="0" /><stop offset="1" stopColor="#fff" stopOpacity=".6" />
          </radialGradient>
          <clipPath id={`${id}-clip`}><circle cx="300" cy="300" r="239" /></clipPath>
        </defs>
        <circle cx="300" cy="300" r="234" fill={`url(#${id}-ocean)`} stroke="#b6c5b5" strokeWidth="1" />
        <g clipPath={`url(#${id}-clip)`}>
          <path d={shape.path} transform="translate(1 2)" fill="#637e6e" opacity=".3" />
          <path d={shape.path} fill={`url(#${id}-land)`} fillRule="evenodd" stroke="#f4f8f0" strokeWidth=".9" strokeLinejoin="round" />
        </g>
        <circle cx="300" cy="300" r="233" fill={`url(#${id}-shine)`} />
        <path d="M120 225C139 160 177 120 234 100" fill="none" stroke="#fff" strokeWidth="5" strokeLinecap="round" opacity=".4" />
      </svg>
    </WorkGlobe>
    <figcaption id={`${id}-caption`}>Where I’ve <em>worked.</em></figcaption>
  </figure>;
}
