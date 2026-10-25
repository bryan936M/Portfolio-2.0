import { PortableText } from "@portabletext/react";
import type { ContentSection } from "@/content/types";
import { safeUrl } from "@/lib/content";

export function CaseStudySections({
  sections,
}: {
  sections: ContentSection[];
}) {
  return (
    <div className="case-sections">
      {sections.map((section) => {
        if (section._type === "textSection")
          return (
            <section
              className="case-text content-width"
              key={section._key}
              data-reveal
            >
              <h2>{section.heading}</h2>
              <div>
                {section.text && <p>{section.text}</p>}
                {section.body && (
                  <PortableText
                    value={section.body}
                    components={{
                      marks: {
                        link: ({ value, children }) => (
                          <a href={safeUrl(value?.href, "#")} rel="noreferrer">
                            {children}
                          </a>
                        ),
                      },
                    }}
                  />
                )}
              </div>
            </section>
          );
        if (section._type === "factsSection")
          return (
            <section
              className="case-text content-width"
              key={section._key}
              data-reveal
            >
              <h2>{section.heading}</h2>
              <dl className="fact-list">
                {section.items?.map((item) => (
                  <div key={item.label}>
                    <dt>{item.label}</dt>
                    <dd>{item.value}</dd>
                  </div>
                ))}
              </dl>
            </section>
          );
        if (section._type === "imageSection" && section.image)
          return (
            <figure className="case-image content-width" key={section._key}>
              <img
                src={safeUrl(section.image.url)}
                alt={section.image.alt}
                loading="lazy"
              />
              {section.image.caption && (
                <figcaption>{section.image.caption}</figcaption>
              )}
            </figure>
          );
        if (section._type === "gallerySection")
          return (
            <section
              className="case-gallery content-width"
              key={section._key}
              aria-label={section.heading || "Project gallery"}
            >
              {section.images?.map((image, index) => (
                <figure key={`${section._key}-${index}`}>
                  <img
                    src={safeUrl(image.url)}
                    alt={image.alt}
                    loading="lazy"
                  />
                  {image.caption && <figcaption>{image.caption}</figcaption>}
                </figure>
              ))}
            </section>
          );
        return null;
      })}
    </div>
  );
}
