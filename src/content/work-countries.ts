import countries from "./african-countries.json" with { type: "json" };

export interface WorkCountry {
  code: string;
  name: string;
  latitude: number;
  longitude: number;
}

export const africanCountries: readonly WorkCountry[] = countries;
export const initialWorkCountries = ["RW", "BJ", "ZM"];
const catalogue = new Map(africanCountries.map(country => [country.code, country]));

export function resolveWorkCountries(value: unknown): WorkCountry[] {
  const codes = value === undefined || value === null ? initialWorkCountries : value;
  if (!Array.isArray(codes)) return [];
  return [...new Set(codes)].flatMap(code => typeof code === "string" && catalogue.has(code) ? [catalogue.get(code)!] : []);
}

export const globeView = { longitude: 20, latitude: 4, extent: 1.28 };

export function globePoint(longitude: number, latitude: number, radius = 1): [number, number, number] {
  const lon = (longitude - globeView.longitude) * Math.PI / 180;
  const lat = latitude * Math.PI / 180;
  const tilt = globeView.latitude * Math.PI / 180;
  return [
    radius * Math.cos(lat) * Math.sin(lon),
    radius * (Math.sin(lat) * Math.cos(tilt) - Math.cos(lat) * Math.cos(lon) * Math.sin(tilt)),
    radius * (Math.sin(lat) * Math.sin(tilt) + Math.cos(lat) * Math.cos(lon) * Math.cos(tilt)),
  ];
}

export function globeScreen(point: readonly number[]): [number, number] {
  return [300 + point[0] * 300 / globeView.extent, 300 - point[1] * 300 / globeView.extent];
}

export function countryLabels(countries: readonly WorkCountry[]) {
  const left = countries.filter(country => country.longitude < globeView.longitude);
  const right = countries.filter(country => country.longitude >= globeView.longitude);
  const positions = new Map<string, { x: number; y: number; side: "left" | "right" }>();
  for (const [group, side] of [[left, "left"], [right, "right"]] as const) {
    const sorted = [...group].sort((a, b) => b.latitude - a.latitude);
    sorted.forEach((country, i) => positions.set(country.code, {
      x: side === "left" ? 18 : 582,
      y: sorted.length === 1 ? 224 : sorted.length === 2 ? 264 + i * 168 : 170 + i * 260 / (sorted.length - 1),
      side,
    }));
  }
  return countries.map(country => ({ ...country, ...positions.get(country.code)! }));
}
