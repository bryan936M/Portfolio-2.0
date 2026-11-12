import Link from "next/link";
import type { Portfolio } from "@/content/types";
import { Arrow } from "@/components/ui/Arrow";
import { ProjectList } from "@/features/work/ProjectList";
import { WorkStage } from "@/features/work/WorkStage";

// The cutout belongs to this specific Sanity portrait asset.
const portraitWithCutout =
  "https://cdn.sanity.io/images/i5u4ixfm/production/1321881be0c51d809b84fb2e240643bc320d38ee-2000x2500.jpg";

export function Home({ portfolio }: { portfolio: Portfolio }) {
  const { profile, projects } = portfolio;
  const featuredProjects = projects.filter((project) => project.featured);
  const hasPortraitCutout = profile.portrait === portraitWithCutout;
  const heroPortrait = hasPortraitCutout
    ? "/images/bryan-hero-cutout.webp"
    : profile.portrait;
  return (
    <>
      <section className="hero" aria-labelledby="hero-title">
        <div
          className={
            hasPortraitCutout ? "hero-media hero-media--cutout" : "hero-media"
          }
        >
          <img
            src={heroPortrait}
            alt="Bryan Murasira"
            width={hasPortraitCutout ? 1121 : 2000}
            height={hasPortraitCutout ? 1403 : 2500}
            fetchPriority="high"
          />
        </div>
        <div className="hero-role">
          <span className="hero-role-arrow" aria-hidden="true">
            ↘
          </span>
          <p>
            {profile.roles.map((role, index) =>
              index === 0 ? (
                <span className="primary-role" key={role}>
                  {role}
                </span>
              ) : (
                <em key={role}>{role}</em>
              ),
            )}
          </p>
        </div>
        <p className="hero-location">
          <span className="location-dot" />
          {profile.location}
        </p>
        <h1 id="hero-title" data-hero-name>
          <span>{profile.name}</span>
          <span className="hero-name-period">.</span>
        </h1>
        <a href="#selected-work" className="hero-scroll">
          Selected work
          <Arrow />
        </a>
      </section>
      <section className="home-intro content-width" aria-label="About Bryan">
        <p className="intro-statement" data-reveal>
          {profile.introduction}
        </p>
        <div className="intro-detail" data-reveal>
          <p>{profile.about}</p>
          <Link href="/about/" className="circle-link">
            About me
            <Arrow diagonal />
          </Link>
        </div>
      </section>
      <div id="selected-work">
        <WorkStage projects={featuredProjects} />
      </div>
      <section className="home-work content-width" aria-label="Selected work">
        <ProjectList projects={featuredProjects} />
        <Link href="/work/" className="outline-link">
          All work <sup>{projects.length}</sup>
          <Arrow diagonal />
        </Link>
      </section>
      <section className="home-lab content-width">
        <div className="section-intro" data-reveal>
          <p className="eyebrow">Ongoing exploration</p>
          <h2>
            Inside
            <br />
            the <em>lab.</em>
          </h2>
        </div>
        <div className="lab-introduction" data-reveal>
          <p>
            Generative workflows, structured information, and retrieval. A
            closer look at the engineering within the projects.
          </p>
          <Link href="/lab/" className="text-link">
            Explore the lab
            <Arrow diagonal />
          </Link>
        </div>
      </section>
    </>
  );
}
