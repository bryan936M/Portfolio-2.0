import { PortableText } from "@portabletext/react";
import type { ContentSection } from "../src/content/types";

type SanityImage = { asset?: { _ref: string }; alt?: string };
function imageUrl(image: SanityImage | undefined) {
  const ref = image?.asset?._ref;
  if (!ref) return "";
  const match = ref.match(/^image-(.+)-(\d+x\d+)-(\w+)$/);
  return match
    ? `https://cdn.sanity.io/images/i5u4ixfm/production/${match[1]}-${match[2]}.${match[3]}`
    : "";
}
export function ProjectPreview({
  document,
}: {
  document: { displayed: Record<string, unknown> };
}) {
  const doc = document.displayed;
  const cover =
    imageUrl(doc.cover as SanityImage) || String(doc.coverUrl || "");
  const sections = (doc.sections || []) as (ContentSection & {
    image?: SanityImage;
    images?: SanityImage[];
  })[];
  return (
    <article
      style={{
        padding: "40px",
        fontFamily: "Arial,sans-serif",
        background: "#f5f4ef",
        color: "#242723",
        minHeight: "100%",
      }}
    >
      <p style={{ fontSize: 12, textTransform: "uppercase" }}>
        {String(doc.category || "")}
      </p>
      <h1
        style={{
          fontSize: 48,
          lineHeight: 1.05,
          letterSpacing: "-.04em",
          fontWeight: 400,
        }}
      >
        {String(doc.title || "Untitled project")}
      </h1>
      <p style={{ fontSize: 20, lineHeight: 1.6 }}>
        {String(doc.summary || "")}
      </p>
      {cover.startsWith("https:") && (
        <img src={cover} alt="" style={{ width: "100%", margin: "25px 0" }} />
      )}
      {sections.map((section, index) => (
        <section
          key={section._key || index}
          style={{ padding: "30px 0", borderTop: "1px solid #d8d9d0" }}
        >
          <h2 style={{ fontSize: 28, fontWeight: 400 }}>{section.heading}</h2>
          {section.body && <PortableText value={section.body} />}
          <p>{section.text}</p>
          {section.items?.map((item) => (
            <p key={item.label}>
              <strong>{item.label}:</strong> {item.value}
            </p>
          ))}
          {section.image && imageUrl(section.image) && (
            <img
              src={imageUrl(section.image)}
              alt={section.image.alt || ""}
              style={{ width: "100%" }}
            />
          )}
          {section.images?.map((image, i) => (
            <img
              key={i}
              src={imageUrl(image)}
              alt={image.alt || ""}
              style={{ width: "100%", marginBottom: 15 }}
            />
          ))}
        </section>
      ))}
    </article>
  );
}
