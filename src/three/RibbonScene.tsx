"use client";

import { useEffect, useRef } from "react";
import { scroll } from "motion";
import { AmbientLight, BufferAttribute, BufferGeometry, Color, DirectionalLight, DoubleSide, Group, Mesh, MeshPhysicalMaterial, PerspectiveCamera, Scene, Vector3, WebGLRenderer, ACESFilmicToneMapping } from "three";

function ribbonGeometry() {
  const positions: number[] = [];
  const indices: number[] = [];
  const segments = 240;
  for (let i = 0; i <= segments; i++) {
    const t = i / segments * Math.PI * 2;
    const radius = 2.4 + .5 * Math.cos(t * 3);
    for (let side = 0; side <= 8; side++) {
      const across = (side / 8 - .5) * 1.35;
      const twist = t * 2 + .3;
      positions.push((radius + across * Math.cos(twist)) * Math.cos(t), (radius + across * Math.cos(twist)) * Math.sin(t), .75 * Math.sin(t * 2) + across * Math.sin(twist));
      if (i < segments && side < 8) {
        const a = i * 9 + side;
        indices.push(a, a + 9, a + 1, a + 1, a + 9, a + 10);
      }
    }
  }
  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new BufferAttribute(new Float32Array(positions), 3));
  geometry.setIndex(indices); geometry.computeVertexNormals();
  return geometry;
}

export default function RibbonScene() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    const main = document.querySelector("main");
    if (!canvas || !main) return;
    let renderer: WebGLRenderer;
    try { renderer = new WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "low-power" }); }
    catch { return; }
    renderer.toneMapping = ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.6;
    const scene = new Scene();
    const camera = new PerspectiveCamera(35, 1, .1, 80);
    const geometry = ribbonGeometry();
    const material = new MeshPhysicalMaterial({ color: new Color("#3f5546"), metalness: .28, roughness: .29, clearcoat: .65, clearcoatRoughness: .3, side: DoubleSide });
    const sculpture = new Group();
    sculpture.add(new Mesh(geometry, material));
    scene.add(sculpture, new AmbientLight("#f5f4ef", 2.3));
    const key = new DirectionalLight("#f5f4ef", 5); key.position.set(-3, 7, 6);
    const rim = new DirectionalLight("#bac3b6", 3); rim.position.set(5, -2, -4);
    scene.add(key, rim);
    const sections = [...main.querySelectorAll<HTMLElement>("[data-ribbon-stop]")];
    let stops: number[] = [];
    let progress = 0;
    let renderedProgress = 0;
    let mouseX = 0;
    let mouseY = 0;
    let frame = 0;
    let width = 0;
    let height = 0;
    let unavailable = false;
    let portraitCenter = 0;
    const target = new Vector3();
    const draw = () => {
      frame = 0;
      if (unavailable) return;
      if (width !== canvas.clientWidth || height !== canvas.clientHeight) {
        width = canvas.clientWidth; height = canvas.clientHeight;
        if (!width || !height) return;
        renderer.setPixelRatio(Math.min(devicePixelRatio, width < 640 ? 1 : 1.5));
        renderer.setSize(width, height, false); camera.aspect = width / height; camera.updateProjectionMatrix();
      }
      const compact = width < 700;
      renderedProgress += (progress - renderedProgress) * .14;
      const p = renderedProgress;
      sculpture.rotation.set(.4 + p * .37 + mouseY * .035, -.45 + p * .8 + mouseX * .05, -.3 + p * .45);
      const phone = width <= 640;
      const opening = phone ? Math.max(0, 1 - p) : 0;
      const portraitY = (0.5 - (portraitCenter - scrollY) / height) * 2 * Math.tan(35 * Math.PI / 360) * 15;
      sculpture.position.set(compact ? 1.4 : 2.6, phone ? portraitY * opening + 1.3 * (1 - opening) : compact ? 1.3 : .1, 0);
      const scale = p < 1 ? 1 + Math.sin(p * Math.PI) * .4 : 1 + Math.sin((p - 1) * Math.PI / 2) * .18;
      sculpture.scale.setScalar(scale * (1 - opening * .22));
      camera.position.set(mouseX * .12, mouseY * .08, compact ? 15 : 12 - Math.sin(p * Math.PI) * 1.4);
      target.set(0, 0, 0); camera.lookAt(target);
      renderer.render(scene, camera);
      canvas.dataset.ready = "true";
      if (Math.abs(progress - renderedProgress) > .001) invalidate();
    };
    const invalidate = () => { if (!frame && !document.hidden) frame = requestAnimationFrame(draw); };
    const seek = () => {
      let index = 0;
      while (index < stops.length - 2 && scrollY > stops[index + 1]) index++;
      progress = index + Math.max(0, Math.min(1, (scrollY - stops[index]) / Math.max(1, stops[index + 1] - stops[index])));
      invalidate();
    };
    const measure = () => {
      const portrait = main.querySelector(".ribbon-portrait")?.getBoundingClientRect();
      portraitCenter = portrait ? portrait.top + scrollY + portrait.height * .48 : innerHeight * .7;
      stops = sections.map(section => section.getBoundingClientRect().top + scrollY); seek(); };
    const resize = new ResizeObserver(measure); resize.observe(main); resize.observe(canvas);
    const cancel = scroll(seek);
    const pointer = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      mouseX = event.clientX / innerWidth * 2 - 1; mouseY = event.clientY / innerHeight * 2 - 1; invalidate();
    };
    const lost = (event: Event) => { event.preventDefault(); unavailable = true; canvas.dataset.ready = "false"; };
    const restored = () => { unavailable = false; invalidate(); };
    document.addEventListener("pointermove", pointer, { passive: true });
    document.addEventListener("visibilitychange", invalidate);
    canvas.addEventListener("webglcontextlost", lost); canvas.addEventListener("webglcontextrestored", restored);
    measure();
    return () => {
      cancel(); resize.disconnect(); cancelAnimationFrame(frame);
      document.removeEventListener("pointermove", pointer); document.removeEventListener("visibilitychange", invalidate);
      canvas.removeEventListener("webglcontextlost", lost); canvas.removeEventListener("webglcontextrestored", restored);
      geometry.dispose(); material.dispose(); renderer.dispose();
    };
  }, []);
  return <canvas ref={ref} className="ribbon-canvas" />;
}
