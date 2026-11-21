"use client";

import { useEffect, useRef } from "react";
import {
  ACESFilmicToneMapping, AmbientLight, BufferGeometry, Color, CylinderGeometry,
  DirectionalLight, Float32BufferAttribute, Group, Mesh, MeshPhysicalMaterial,
  MeshStandardMaterial, OrthographicCamera, PMREMGenerator, Scene,
  SphereGeometry, Vector3, WebGLRenderer, type Material,
} from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { countryLabels, globePoint, globeScreen, globeView, type WorkCountry } from "@/content/work-countries";

interface Props {
  countries: WorkCountry[];
  active: string | null;
  onReady: (value: boolean) => void;
}

export default function WorkLocationsScene({ countries, active, onReady }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);
  const activeRef = useRef(active);
  const invalidateRef = useRef<(() => void) | null>(null);
  activeRef.current = active;

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const host = canvas.closest(".work-globe");
    if (!host) return;
    const controller = new AbortController();
    let disposed = false;
    let renderer: WebGLRenderer;
    try { renderer = new WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "low-power" }); }
    catch { return; }
    renderer.toneMapping = ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    const scene = new Scene();
    scene.background = new Color("#f5f4ef");
    const extent = globeView.extent;
    const camera = new OrthographicCamera(-extent, extent, extent, -extent, .1, 20);
    camera.position.z = 5;
    const world = new Group();
    scene.add(world);
    const geometries: BufferGeometry[] = [];
    const materials: Material[] = [];
    const ownGeometry = <T extends BufferGeometry>(value: T): T => { geometries.push(value); return value; };
    const ownMaterial = <T extends Material>(value: T): T => { materials.push(value); return value; };
    const room = new RoomEnvironment();
    const pmrem = new PMREMGenerator(renderer);
    const environment = pmrem.fromScene(room, .04, .1, 20);
    scene.environment = environment.texture;
    room.dispose(); pmrem.dispose();
    const ocean = ownMaterial(new MeshPhysicalMaterial({
      color: "#bfcebd", roughness: .16, metalness: 0,
      transmission: .9, thickness: .8, ior: 1.3,
      clearcoat: 1, clearcoatRoughness: .16, envMapIntensity: 1.3,
      attenuationColor: new Color("#b4c7b4"), attenuationDistance: 2,
    }));
    world.add(new Mesh(ownGeometry(new SphereGeometry(1, 64, 48)), ocean));
    const core = ownMaterial(new MeshStandardMaterial({ color: "#e0e7d9", roughness: .5, metalness: .05 }));
    world.add(new Mesh(ownGeometry(new SphereGeometry(.96, 48, 32)), core));
    const landMaterial = ownMaterial(new MeshPhysicalMaterial({
      color: "#789782", roughness: .24, metalness: .08,
      transmission: .18, thickness: .14, ior: 1.3,
      clearcoat: 1, clearcoatRoughness: .18, envMapIntensity: .8,
    }));
    scene.add(new AmbientLight("#f5f4ef", 1));
    const key = new DirectionalLight("#ffffff", 1.7); key.position.set(-3, 4, 6);
    const rim = new DirectionalLight("#d4e2ca", 1.5); rim.position.set(3, -1, -3);
    scene.add(key, rim);
    const stemGeometry = ownGeometry(new CylinderGeometry(.0022, .0022, 1, 6));
    const tipGeometry = ownGeometry(new SphereGeometry(.009, 10, 8));
    const up = new Vector3(0, 1, 0);
    const labels = countryLabels(countries);
    const pins = labels.map(country => {
      const root = new Vector3(...globePoint(country.longitude, country.latitude, 1.023));
      const tip = new Vector3(...globePoint(country.longitude, country.latitude, 1.14));
      const material = ownMaterial(new MeshStandardMaterial({ color: "#3f5546", roughness: .3, metalness: .2 }));
      const stem = new Mesh(stemGeometry, material);
      stem.position.copy(root).lerp(tip, .5);
      stem.scale.y = root.distanceTo(tip);
      stem.quaternion.setFromUnitVectors(up, tip.clone().sub(root).normalize());
      const dot = new Mesh(tipGeometry, material); dot.position.copy(tip);
      world.add(stem, dot);
      const overlay = host.querySelector<SVGGElement>(`[data-country="${country.code}"]`);
      return {
        country, root, tip, material, projectedRoot: new Vector3(), projectedTip: new Vector3(),
        line: overlay?.querySelector("[data-stem]"), base: overlay?.querySelector("[data-root]"),
        dot: overlay?.querySelector("[data-tip]"), leader: overlay?.querySelector("[data-leader]"),
      };
    });
    let available = false;
    let loaded = false;
    let visible = false;
    let frame = 0;
    let previousTime = 0;
    let elapsed = 0;
    let width = 0;
    let lastActive: string | null | undefined;
    const draw = (time: number) => {
      frame = 0;
      if (disposed || !available || !visible || document.hidden) { previousTime = 0; return; }
      const paused = Boolean(activeRef.current);
      if (!paused) frame = requestAnimationFrame(draw);
      if (!paused && previousTime && time - previousTime < 1000 / 30 - .5) return;
      const delta = previousTime ? Math.min(time - previousTime, 100) : 0;
      previousTime = paused ? 0 : time;
      if (!activeRef.current) elapsed += delta;
      world.rotation.y = Math.sin(elapsed / 14000 * Math.PI * 2) * 5 * Math.PI / 180;
      world.updateMatrixWorld();
      if (lastActive !== activeRef.current) {
        for (const pin of pins) {
          const highlighted = activeRef.current === pin.country.code;
          pin.material.color.set(highlighted ? "#223e2d" : "#3f5546");
          pin.material.emissive.set(highlighted ? "#3f5546" : "#000000");
          pin.material.emissiveIntensity = highlighted ? .18 : 0;
        }
        lastActive = activeRef.current;
      }
      for (const pin of pins) {
        pin.projectedRoot.copy(pin.root).applyMatrix4(world.matrixWorld);
        pin.projectedTip.copy(pin.tip).applyMatrix4(world.matrixWorld);
        const rx = 300 + pin.projectedRoot.x * 300 / extent, ry = 300 - pin.projectedRoot.y * 300 / extent;
        const tx = 300 + pin.projectedTip.x * 300 / extent, ty = 300 - pin.projectedTip.y * 300 / extent;
        pin.line?.setAttribute("x1", String(rx)); pin.line?.setAttribute("y1", String(ry));
        pin.line?.setAttribute("x2", String(tx)); pin.line?.setAttribute("y2", String(ty));
        pin.base?.setAttribute("cx", String(rx)); pin.base?.setAttribute("cy", String(ry));
        pin.dot?.setAttribute("cx", String(tx)); pin.dot?.setAttribute("cy", String(ty));
        const end = pin.country.side === "left" ? pin.country.x + 78 : pin.country.x - 78;
        pin.leader?.setAttribute("points", `${tx},${ty} ${end + (pin.country.side === "left" ? 14 : -14)},${pin.country.y} ${end},${pin.country.y}`);
      }
      try { renderer.render(scene, camera); }
      catch { available = false; cancelAnimationFrame(frame); frame = 0; onReady(false); return; }
      if (canvas.dataset.ready !== "true") { canvas.dataset.ready = "true"; onReady(true); }
    };
    const start = () => {
      if (available && visible && !document.hidden && !frame && !disposed) frame = requestAnimationFrame(draw);
      else if (document.hidden || !visible) { cancelAnimationFrame(frame); frame = 0; previousTime = 0; }
    };
    invalidateRef.current = start;
    const measure = () => {
      const nextWidth = canvas.clientWidth;
      if (!nextWidth || width === nextWidth) return;
      width = nextWidth;
      renderer.setPixelRatio(Math.min(devicePixelRatio, matchMedia("(max-width: 640px)").matches ? 1 : 1.5));
      renderer.setSize(width, width, false);
      start();
    };
    const resize = new ResizeObserver(measure); resize.observe(canvas);
    const observer = new IntersectionObserver(entries => { visible = entries[0].isIntersecting; start(); });
    observer.observe(canvas);
    const lost = (event: Event) => { event.preventDefault(); available = false; cancelAnimationFrame(frame); frame = 0; canvas.dataset.ready = "false"; onReady(false); };
    const restored = () => { available = loaded; start(); };
    canvas.addEventListener("webglcontextlost", lost); canvas.addEventListener("webglcontextrestored", restored);
    document.addEventListener("visibilitychange", start);
    fetch("/models/work-globe.json", { signal: controller.signal })
      .then(response => { if (!response.ok) throw new Error("Globe geometry unavailable"); return response.json() as Promise<{ positions: number[]; indices: number[] }>; })
      .then(data => {
        if (disposed) return;
        const geometry = ownGeometry(new BufferGeometry());
        geometry.setAttribute("position", new Float32BufferAttribute(data.positions, 3));
        geometry.setIndex(data.indices); geometry.computeVertexNormals();
        world.add(new Mesh(geometry, landMaterial));
        loaded = true; available = true; measure(); start();
      })
      .catch(() => { if (!disposed) onReady(false); });
    return () => {
      disposed = true; controller.abort(); cancelAnimationFrame(frame);
      invalidateRef.current = null;
      resize.disconnect(); observer.disconnect();
      document.removeEventListener("visibilitychange", start);
      canvas.removeEventListener("webglcontextlost", lost); canvas.removeEventListener("webglcontextrestored", restored);
      for (const geometry of geometries) geometry.dispose();
      for (const material of materials) material.dispose();
      environment.dispose(); renderer.dispose();
      for (const country of labels) {
        const root = globeScreen(globePoint(country.longitude, country.latitude, 1.023));
        const tip = globeScreen(globePoint(country.longitude, country.latitude, 1.14));
        const overlay = host.querySelector(`[data-country="${country.code}"]`);
        const line = overlay?.querySelector("[data-stem]");
        line?.setAttribute("x1", String(root[0])); line?.setAttribute("y1", String(root[1])); line?.setAttribute("x2", String(tip[0])); line?.setAttribute("y2", String(tip[1]));
        for (const [selector, point] of [["[data-root]", root], ["[data-tip]", tip]] as const) {
          overlay?.querySelector(selector)?.setAttribute("cx", String(point[0])); overlay?.querySelector(selector)?.setAttribute("cy", String(point[1]));
        }
        const end = country.side === "left" ? country.x + 78 : country.x - 78;
        overlay?.querySelector("[data-leader]")?.setAttribute("points", `${tip.join(",")} ${end + (country.side === "left" ? 14 : -14)},${country.y} ${end},${country.y}`);
      }
    };
  }, [countries, onReady]);
  useEffect(() => { invalidateRef.current?.(); }, [active]);
  return <canvas ref={ref} className="work-globe-canvas" aria-hidden="true" />;
}
