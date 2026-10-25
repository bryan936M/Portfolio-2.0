"use client";

import dynamic from "next/dynamic";
import {
  Component,
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Project } from "@/content/types";

const WorkScene = dynamic(() => import("@/three/WorkScene"), { ssr: false });
class SceneBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}
export function WorkStage({ projects }: { projects: Project[] }) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false),
    [ready, setReady] = useState(false),
    [progress, setProgress] = useState(0);
  const onReady = useCallback(() => setReady(true), []);
  useEffect(() => {
    if (
      !ref.current ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { rootMargin: "150px" },
    );
    observer.observe(ref.current);
    gsap.registerPlugin(ScrollTrigger);
    const trigger = ScrollTrigger.create({
      trigger: ref.current,
      start: "top bottom",
      end: "bottom top",
      onUpdate: (self) => setProgress(self.progress),
    });
    return () => {
      observer.disconnect();
      trigger.kill();
    };
  }, []);
  return (
    <section
      ref={ref}
      className="work-stage"
      aria-labelledby="selected-work-title"
      data-ready={visible && ready}
    >
      <div className="work-stage-heading">
        <p className="eyebrow">Selected projects</p>
        <h2 id="selected-work-title">
          The <em>work.</em>
        </h2>
      </div>
      <div className="work-stage-fallback" aria-hidden="true">
        {projects.slice(0, 2).map((project) => (
          <img
            src={project.cover}
            alt=""
            key={project.slug}
            width="600"
            height="400"
          />
        ))}
      </div>
      {visible && projects.length > 1 && (
        <div className="work-stage-canvas">
          <SceneBoundary>
            <WorkScene
              images={projects.slice(0, 2).map((project) => project.cover)}
              progress={progress}
              onReady={onReady}
            />
          </SceneBoundary>
        </div>
      )}
      <p className="work-stage-caption">
        AI systems, web applications, and mobile experiences.
      </p>
    </section>
  );
}
