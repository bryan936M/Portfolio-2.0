import { getPortfolio } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";
import { Arrow } from "@/components/ui/Arrow";
export const metadata = pageMetadata(
  "Contact",
  "Contact Bryan Murasira about a software engineering role, a full-stack project, or generative AI work.",
  "/contact/",
);
export default async function ContactPage() {
  const { profile } = await getPortfolio();
  return (
    <div className="page-shell contact-page">
      <header className="page-heading content-width">
        <p className="eyebrow">Contact</p>
        <h1>
          Let’s start
          <br />
          <em>a conversation.</em>
        </h1>
      </header>
      <section className="contact-layout content-width">
        <div className="contact-main">
          <a className="contact-email" href={`mailto:${profile.email}`}>
            {profile.email}
            <Arrow diagonal />
          </a>
          <p>{profile.location}</p>
        </div>
        <div className="contact-paths">
          <a
            href={`mailto:${profile.email}?subject=${encodeURIComponent("Project inquiry")}`}
          >
            <span>
              <small>For clients</small>Discuss a project
            </span>
            <Arrow diagonal />
          </a>
          <a
            href={`mailto:${profile.email}?subject=${encodeURIComponent("Engineering role")}`}
          >
            <span>
              <small>For hiring teams</small>Discuss a role
            </span>
            <Arrow diagonal />
          </a>
          <div className="contact-socials">
            <a href={profile.github} target="_blank" rel="noreferrer">
              GitHub ↗
            </a>
            <a href={profile.linkedin} target="_blank" rel="noreferrer">
              LinkedIn ↗
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
