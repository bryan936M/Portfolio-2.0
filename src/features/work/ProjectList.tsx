"use client";

import Link from "next/link";
import { useState } from "react";
import type { Project } from "@/content/types";
import { Arrow } from "@/components/ui/Arrow";

export function ProjectList({
  projects,
  filterable = false,
}: {
  projects: Project[];
  filterable?: boolean;
}) {
  const [filter, setFilter] = useState("all");
  const [active, setActive] = useState<string | null>(null);
  const filtered = projects.filter(
    (project) => filter === "all" || project.kind === filter,
  );
  return (
    <>
      {filterable && (
        <div className="work-filters" role="group" aria-label="Filter projects">
          {[
            ["all", "All work"],
            ["ai", "AI engineering"],
            ["web", "Web applications"],
            ["mobile", "Mobile"],
          ].map(([value, label]) => (
            <button
              type="button"
              key={value}
              aria-pressed={filter === value}
              onClick={() => setFilter(value)}
            >
              {label}
              {value === "all" && <sup>{projects.length}</sup>}
            </button>
          ))}
        </div>
      )}
      <div className="project-list" onMouseLeave={() => setActive(null)}>
        <p className="project-list-caption">
          <span>Project</span>
          <span>Discipline</span>
        </p>
        {filtered.map((project, index) => (
          <Link
            key={project.slug}
            href={`/work/${project.slug}/`}
            className="project-row"
            data-cursor="View"
            onMouseEnter={() => setActive(project.slug)}
            onFocus={() => setActive(project.slug)}
            onBlur={() => setActive(null)}
          >
            <span className="project-number">
              {String(index + 1).padStart(2, "0")}
            </span>
            <h3>{project.title}</h3>
            <span className="project-category">{project.category}</span>
            <Arrow diagonal />
            <div
              className={`project-hover-cover ${active === project.slug ? "is-active" : ""}`}
              aria-hidden="true"
            >
              <img
                src={project.cover}
                alt=""
                width="600"
                height="400"
                loading="lazy"
              />
              <span>View project ↗</span>
            </div>
          </Link>
        ))}
      </div>
      <p className="sr-only" aria-live="polite">
        {filtered.length} projects shown.
      </p>
    </>
  );
}
