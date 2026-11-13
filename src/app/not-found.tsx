import { SiteLink } from "@/components/layout/SiteLink";
export default function NotFound() {
  return (
    <section className="not-found content-width">
      <p className="eyebrow">404</p>
      <h1>
        Nothing
        <br />
        <em>here.</em>
      </h1>
      <SiteLink href="/" className="text-link">
        Back to home ↗
      </SiteLink>
    </section>
  );
}
