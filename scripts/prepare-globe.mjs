import { readFile, writeFile, mkdir } from "node:fs/promises";
import { ShapeUtils, Vector2 } from "three";

const polygons = JSON.parse(await readFile(new URL("../src/content/globe-land.json", import.meta.url), "utf8"));
const radians = Math.PI / 180;
function point([lon, lat], radius = 1) {
  const l = (lon - 20) * radians, p = lat * radians, tilt = 4 * radians;
  return [radius * Math.cos(p) * Math.sin(l), radius * (Math.sin(p) * Math.cos(tilt) - Math.cos(p) * Math.cos(l) * Math.sin(tilt)), radius * (Math.sin(p) * Math.sin(tilt) + Math.cos(p) * Math.cos(l) * Math.cos(tilt))];
}
const positions = [], indices = [], vertices = new Map();
function vertex(coordinate, radius) {
  const p = point(coordinate, radius).map(n => Number(n.toFixed(5)));
  const key = p.join(",");
  if (vertices.has(key)) return vertices.get(key);
  const index = positions.length / 3;
  positions.push(...p); vertices.set(key, index);
  return index;
}
function triangle(a, b, c, depth = 0) {
  const distance = (p, q) => Math.hypot(p[0] - q[0], p[1] - q[1]);
  const distances = [distance(a, b), distance(b, c), distance(c, a)];
  const longest = Math.max(...distances);
  if (longest > 4 && depth < 15) {
    const [p, q, r] = distances[0] === longest ? [a, b, c] : distances[1] === longest ? [b, c, a] : [c, a, b];
    const midpoint = [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
    triangle(p, midpoint, r, depth + 1); triangle(midpoint, q, r, depth + 1);
  } else {
    const pa = point(a), pb = point(b), pc = point(c);
    const ab = pb.map((v, i) => v - pa[i]), ac = pc.map((v, i) => v - pa[i]);
    const dot = (ab[1] * ac[2] - ab[2] * ac[1]) * pa[0] + (ab[2] * ac[0] - ab[0] * ac[2]) * pa[1] + (ab[0] * ac[1] - ab[1] * ac[0]) * pa[2];
    const ids = [vertex(a, 1.018), vertex(b, 1.018), vertex(c, 1.018)];
    indices.push(...(dot >= 0 ? ids : [ids[0], ids[2], ids[1]]));
  }
}
let path = "";
for (const polygon of polygons) {
  const rings = polygon.map(ring => ring.slice(0, -1).map(p => new Vector2(...p)));
  const points = rings.flat();
  for (const [a, b, c] of ShapeUtils.triangulateShape(rings[0], rings.slice(1))) triangle(points[a].toArray(), points[b].toArray(), points[c].toArray());
  for (const ring of polygon) {
    for (let i = 1; i < ring.length; i++) {
      const a = ring[i - 1], b = ring[i];
      const a0 = vertex(a, .998), a1 = vertex(a, 1.018), b0 = vertex(b, .998), b1 = vertex(b, 1.018);
      indices.push(a0, b0, a1, b0, b1, a1);
    }
    const sampled = [];
    for (let i = 1; i < ring.length; i++) {
      const a = ring[i - 1], b = ring[i], steps = Math.max(1, Math.ceil(Math.hypot(a[0] - b[0], a[1] - b[1]) / 2));
      for (let s = 0; s < steps; s++) sampled.push(point([a[0] + (b[0] - a[0]) * s / steps, a[1] + (b[1] - a[1]) * s / steps], 1.018));
    }
    const project = p => `${(300 + p[0] * 300 / 1.28).toFixed(2)},${(300 - p[1] * 300 / 1.28).toFixed(2)}`;
    const back = sampled.findIndex(p => p[2] < 0);
    if (back === -1) {
      path += sampled.map((p, i) => `${i ? "L" : "M"}${project(p)}`).join("") + "Z";
      continue;
    }
    let segment = [];
    for (let step = 0; step < sampled.length; step++) {
      const a = sampled[(back + step) % sampled.length], b = sampled[(back + step + 1) % sampled.length];
      if ((a[2] >= 0) !== (b[2] >= 0)) {
        const t = a[2] / (a[2] - b[2]);
        const edge = a.map((v, j) => v + (b[j] - v) * t);
        const radius = Math.hypot(edge[0], edge[1]);
        edge[0] *= 1.018 / radius; edge[1] *= 1.018 / radius;
        segment.push(edge);
        if (b[2] < 0 && segment.length > 2) {
          const first = segment[0], last = segment.at(-1);
          const startAngle = Math.atan2(-first[1], first[0]), endAngle = Math.atan2(-last[1], last[0]);
          const delta = (startAngle - endAngle + 3 * Math.PI) % (2 * Math.PI) - Math.PI;
          const r = (1.018 * 300 / 1.28).toFixed(2);
          path += segment.map((p, i) => `${i ? "L" : "M"}${project(p)}`).join("") + `A${r},${r} 0 0 ${delta > 0 ? 1 : 0} ${project(first)}Z`;
          segment = [];
        }
      }
      if (b[2] >= 0) segment.push(b);
    }
  }
}
await mkdir(new URL("../public/models/", import.meta.url), { recursive: true });
await writeFile(new URL("../public/models/work-globe.json", import.meta.url), JSON.stringify({ positions, indices }) + "\n");
await writeFile(new URL("../src/content/globe-shape.json", import.meta.url), JSON.stringify({ path }) + "\n");
console.log(`Prepared globe: ${positions.length / 3} vertices, ${indices.length / 3} triangles.`);
