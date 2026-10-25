import Link from "next/link";
export default function NotFound() {
  return (
    <section className="not-found content-width">
      <p className="eyebrow">404</p>
      <h1>
        Nothing
        <br />
        <em>here.</em>
      </h1>
      <Link href="/" className="text-link">
        Back to home ↗
      </Link>
    </section>
  );
}
