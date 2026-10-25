import Link from "next/link";
import { getPortfolio } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";
import { Arrow } from "@/components/ui/Arrow";
export const metadata = pageMetadata(
  "About",
  "Meet Bryan Murasira, a full-stack software engineer and generative AI engineer based in Kigali, Rwanda.",
  "/about/",
);
export default async function AboutPage() {
  const { profile } = await getPortfolio();
  return (
    <div className="page-shell">
      <header className="page-heading content-width">
        <p className="eyebrow">About me</p>
        <h1>
          About
          <br />
          <em>Bryan.</em>
        </h1>
      </header>
      <section className="about-profile content-width">
        <div className="about-portrait">
          <img
            src={profile.portrait}
            alt="Bryan Murasira"
            width="920"
            height="920"
          />
        </div>
        <div className="about-copy" data-reveal>
          <h2>{profile.introduction}</h2>
          <p>{profile.about}</p>
          <p>
            Based in {profile.location}. Open to conversations about software
            engineering roles and full-stack or AI projects.
          </p>
          <Link className="text-link" href="/contact/">
            Get in touch
            <Arrow diagonal />
          </Link>
        </div>
      </section>
      <section className="about-disciplines content-width">
        <p className="eyebrow">Areas of work</p>
        <div className="discipline">
          <span>01</span>
          <h2>
            Full-stack
            <br />
            <em>engineering.</em>
          </h2>
          <p>
            Web interfaces, application workflows, APIs, and the data systems
            behind them.
          </p>
        </div>
        <div className="discipline">
          <span>02</span>
          <h2>
            Generative
            <br />
            <em>AI.</em>
          </h2>
          <p>
            Model-driven workflows, structured generation, retrieval, and human
            review.
          </p>
        </div>
      </section>
    </div>
  );
}
