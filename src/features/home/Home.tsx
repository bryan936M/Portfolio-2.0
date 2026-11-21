import { SiteLink } from "@/components/layout/SiteLink";
import type { Portfolio } from "@/content/types";
import { Arrow } from "@/components/ui/Arrow";
import { HomeOpening } from "./HomeOpening";
import { MobileHeroMarquee } from "./MobileHeroMarquee";
import { RibbonJourney } from "./RibbonJourney";
import { WorkLocations } from "./WorkLocations";
import "@/styles/ribbon-journey.css";

const cutoutPortrait = "https://cdn.sanity.io/images/i5u4ixfm/production/1321881be0c51d809b84fb2e240643bc320d38ee-2000x2500.jpg";

export function Home({ portfolio }: { portfolio: Portfolio }) {
  const { profile, projects, experiments } = portfolio;
  const featured = projects.filter(project => project.featured);
  const hasCutout = profile.portrait === cutoutPortrait;
  return <>
    <HomeOpening />
    <RibbonJourney />
    <section className="hero ribbon-hero" aria-labelledby="hero-title" data-ribbon-stop tabIndex={-1}>
      <div className="ribbon-hero-intro">
        <p className="eyebrow">{profile.location}</p>
        <p className="ribbon-role">{profile.roles.map((role, index) => index === 0 ? <span key={role}>{role}.<br /></span> : <em key={role}>{role}.</em>)}</p>
        <a href="#selected-work" className="ribbon-link">Explore my work <Arrow diagonal /></a>
      </div>
      <div className={`ribbon-portrait ${hasCutout ? "ribbon-portrait-cutout" : ""}`}>
        <img src={hasCutout ? "/images/bryan-hero-cutout.webp" : profile.portrait} alt={profile.name} width={hasCutout ? 1121 : 2000} height={hasCutout ? 1403 : 2500} fetchPriority="high" />
      </div>
      <h1 id="hero-title">
        <span className="ribbon-given-name">{profile.name.slice(0, profile.name.lastIndexOf(" ") + 1)}</span>
        <span className="ribbon-surname">{profile.name.slice(profile.name.lastIndexOf(" ") + 1)}</span>
        <span className="ribbon-name-period">.</span>
      </h1>
      <MobileHeroMarquee name={profile.name} />
      <a className="ribbon-mobile-scroll" href="#about-bryan" aria-label="Scroll to About Bryan">
        <Arrow />
      </a>
      <div className="ribbon-hero-bottom"><a href="#about-bryan">Scroll to discover <span aria-hidden="true">↓</span></a></div>
    </section>
    <section className={`ribbon-section ribbon-about${profile.workCountries.length ? " ribbon-about-with-globe" : ""}`} id="about-bryan" data-ribbon-stop tabIndex={-1}>
      <div className="ribbon-copy">
        <p className="eyebrow">About me</p>
        <h2>Engineering,<br /><em>with curiosity.</em></h2>
        <p>{profile.introduction}</p>
        <details className="ribbon-detail" data-disclosure-key="about"><summary>How I work <span aria-hidden="true">+</span></summary><div data-disclosure-panel><p>{profile.about}</p><SiteLink href="/about/" className="ribbon-link">More about me <Arrow diagonal /></SiteLink></div></details>
      </div>
      <WorkLocations codes={profile.workCountries} />
    </section>
    <section className="ribbon-section ribbon-work" id="selected-work" data-ribbon-stop tabIndex={-1}>
      <div className="ribbon-work-heading"><p className="eyebrow">Selected work</p><h2>Ideas, <em>built.</em></h2><SiteLink href="/work/" className="ribbon-link">All projects <Arrow diagonal /></SiteLink></div>
      <div className="ribbon-projects">
        {featured.map(project => <details className="ribbon-project" key={project.slug} data-disclosure-key={`project:${project.slug}`} name="selected-project">
          <summary><span><small>{project.category}</small><strong>{project.title}</strong></span><span className="ribbon-expand" aria-hidden="true">+</span></summary>
          <div className="ribbon-project-body" data-disclosure-panel>
            <img src={project.cover} alt={`${project.title} project identity`} width={800} height={500} loading="lazy" />
            <p>{project.summary}</p><ul className="ribbon-stack">{project.stack.map(technology => <li key={technology}>{technology}</li>)}</ul>
            <SiteLink href={`/work/${project.slug}/`} className="ribbon-link">Explore the project <Arrow diagonal /></SiteLink>
          </div>
        </details>)}
      </div>
    </section>
    <section className="ribbon-section ribbon-lab" id="inside-lab" data-ribbon-stop tabIndex={-1}>
      <div className="ribbon-copy"><p className="eyebrow">Ongoing exploration</p><h2>A closer<br /><em>look.</em></h2>
        <div className="ribbon-experiments">{experiments.map(experiment => <details className="ribbon-detail" key={experiment.slug} data-disclosure-key={`lab:${experiment.slug}`}><summary>{experiment.title}<span aria-hidden="true">+</span></summary><div data-disclosure-panel><p>{experiment.summary}</p><SiteLink href={`/work/${experiment.project}/`} className="ribbon-link">Related project <Arrow diagonal /></SiteLink></div></details>)}</div>
        <SiteLink href="/lab/" className="ribbon-link">Inside the lab <Arrow diagonal /></SiteLink>
      </div>
    </section>
  </>;
}
