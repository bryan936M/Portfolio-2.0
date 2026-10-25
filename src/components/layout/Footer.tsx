import Link from "next/link";
import type { Profile } from "@/content/types";
import { Arrow } from "@/components/ui/Arrow";

export function Footer({ profile }: { profile: Profile }) {
  return (
    <footer className="site-footer" id="contact">
      <div className="footer-top">
        <p className="eyebrow">Have a project or a role in mind?</p>
        <Link className="footer-contact" href="/contact/">
          Let’s work
          <br />
          <em>together.</em>
          <Arrow diagonal />
        </Link>
      </div>
      <div className="footer-details">
        <a href={`mailto:${profile.email}`}>
          {profile.email}
          <Arrow diagonal />
        </a>
        <span>{profile.location}</span>
      </div>
      <div className="footer-bottom">
        <span>
          © {new Date().getFullYear()} {profile.name}
        </span>
        <div>
          <a href={profile.github} target="_blank" rel="noreferrer">
            GitHub ↗
          </a>
          <a href={profile.linkedin} target="_blank" rel="noreferrer">
            LinkedIn ↗
          </a>
          <a href="#top">Back to top ↑</a>
        </div>
      </div>
    </footer>
  );
}
