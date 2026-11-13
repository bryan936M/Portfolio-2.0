import { SiteLink } from "@/components/layout/SiteLink";
import type { Profile } from "@/content/types";
import { siteLinks } from "@/components/layout/navigation";
import { Arrow } from "@/components/ui/Arrow";
import { BrandMark } from "@/components/ui/BrandMark";

export function Footer({ profile }: { profile: Profile }) {
  return (
    <footer className="site-footer" id="contact">
      <div className="content-width">
        <div className="footer-main">
          <div className="footer-lead">
            <h2>Let’s work <em>together.</em></h2>
            <p>Have a project or a role in mind?</p>
            <div className="footer-actions">
              <SiteLink className="footer-cta" href="/contact/">
                Get in touch <Arrow diagonal />
              </SiteLink>
              <a className="footer-email" href={`mailto:${profile.email}`}>
                {profile.email}
              </a>
            </div>
          </div>
          <nav aria-label="Footer navigation">
            <p className="footer-label">Quick links</p>
            <ul className="footer-links">
              <li>
                <SiteLink href="/">Home</SiteLink>
              </li>
              {siteLinks.map(([label, href]) => (
                <li key={href}>
                  <SiteLink href={href}>{label}</SiteLink>
                </li>
              ))}
            </ul>
          </nav>
          <div>
            <p className="footer-label">Social</p>
            <ul className="footer-links">
              <li>
                <a href={profile.github} target="_blank" rel="noreferrer">
                  GitHub <Arrow diagonal />
                </a>
              </li>
              <li>
                <a href={profile.linkedin} target="_blank" rel="noreferrer">
                  LinkedIn <Arrow diagonal />
                </a>
              </li>
            </ul>
            <p className="footer-location">{profile.location}</p>
          </div>
        </div>
        <div className="footer-bottom">
          <SiteLink className="footer-identity" href="/">
            <BrandMark />
            <span>© {new Date().getFullYear()} {profile.name}</span>
            <span className="sr-only">Home</span>
          </SiteLink>
          <a className="footer-top-link" href="#top">
            Back to top <Arrow />
          </a>
        </div>
      </div>
    </footer>
  );
}
