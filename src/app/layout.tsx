import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SiteMotion } from "@/components/motion/SiteMotion";
import { getPortfolio, siteOrigin } from "@/lib/content";
import "@/styles/globals.css";

export const dynamic = "force-static";

export const metadata: Metadata = {
  metadataBase: new URL(siteOrigin),
  title: {
    default: "Bryan Murasira — Full-stack & Generative AI Engineer",
    template: "%s — Bryan Murasira",
  },
  description:
    "Selected work by Bryan Murasira, a full-stack software engineer and generative AI engineer based in Kigali, Rwanda.",
  robots: { index: true, follow: true },
  alternates: { types: { "text/plain": `${siteOrigin}/llms.txt` } },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { profile } = await getPortfolio();
  const identity = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${siteOrigin}/#bryan`,
    name: profile.name,
    url: siteOrigin,
    image: profile.portrait.startsWith("/")
      ? `${siteOrigin}${profile.portrait}`
      : profile.portrait,
    jobTitle: profile.roles,
    email: `mailto:${profile.email}`,
    sameAs: [profile.github, profile.linkedin],
    address: {
      "@type": "PostalAddress",
      addressLocality: "Kigali",
      addressCountry: "RW",
    },
  };
  return (
    <html lang="en">
      <body id="top">
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer profile={profile} />
        <SiteMotion />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(identity).replace(/</g, "\\u003c"),
          }}
        />
      </body>
    </html>
  );
}
