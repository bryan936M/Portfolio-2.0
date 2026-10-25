import { defineArrayMember, defineField, defineType } from "sanity";

const alt = defineField({
  name: "alt",
  title: "Alternative text",
  type: "string",
  validation: (rule) => rule.required(),
});
const caption = defineField({ name: "caption", type: "string" });
const imageFields = [alt, caption];
const richText = defineField({
  name: "body",
  title: "Content",
  type: "array",
  of: [
    defineArrayMember({
      type: "block",
      styles: [
        { title: "Normal", value: "normal" },
        { title: "Subheading", value: "h3" },
        { title: "Quote", value: "blockquote" },
      ],
      marks: {
        decorators: [
          { title: "Strong", value: "strong" },
          { title: "Emphasis", value: "em" },
          { title: "Code", value: "code" },
        ],
        annotations: [
          {
            name: "link",
            type: "object",
            fields: [
              defineField({
                name: "href",
                title: "URL",
                type: "url",
                validation: (rule) =>
                  rule.uri({ scheme: ["http", "https", "mailto"] }),
              }),
            ],
          },
        ],
      },
    }),
  ],
});
const textSection = defineType({
  name: "textSection",
  title: "Text section",
  type: "object",
  fields: [defineField({ name: "heading", type: "string" }), richText],
  preview: {
    select: { title: "heading" },
    prepare: ({ title }) => ({ title: title || "Text section" }),
  },
});
const imageSection = defineType({
  name: "imageSection",
  title: "Image",
  type: "object",
  fields: [
    defineField({
      name: "image",
      type: "image",
      options: { hotspot: true },
      fields: imageFields,
      validation: (rule) => rule.required(),
    }),
  ],
  preview: { select: { title: "image.alt", media: "image" } },
});
const gallerySection = defineType({
  name: "gallerySection",
  title: "Image gallery",
  type: "object",
  fields: [
    defineField({ name: "heading", type: "string" }),
    defineField({
      name: "images",
      type: "array",
      of: [
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: imageFields,
        }),
      ],
      validation: (rule) => rule.min(1),
    }),
  ],
  preview: {
    select: { title: "heading" },
    prepare: ({ title }) => ({ title: title || "Image gallery" }),
  },
});
const factsSection = defineType({
  name: "factsSection",
  title: "Facts / Architecture",
  type: "object",
  fields: [
    defineField({ name: "heading", type: "string" }),
    defineField({
      name: "items",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "fact",
          fields: [
            defineField({
              name: "label",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "value",
              type: "string",
              validation: (rule) => rule.required(),
            }),
          ],
          preview: { select: { title: "label", subtitle: "value" } },
        }),
      ],
    }),
  ],
  preview: { select: { title: "heading" } },
});
const portfolioProject = defineType({
  name: "portfolioProject",
  title: "Project",
  type: "document",
  groups: [
    { name: "overview", title: "Overview", default: true },
    { name: "content", title: "Case study" },
    { name: "publishing", title: "Publishing" },
  ],
  fields: [
    defineField({
      name: "title",
      type: "string",
      group: "overview",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      type: "slug",
      group: "overview",
      options: { source: "title", maxLength: 80 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "summary",
      type: "text",
      rows: 3,
      group: "overview",
      validation: (rule) => rule.required().max(350),
    }),
    defineField({
      name: "category",
      title: "Discipline label",
      type: "string",
      group: "overview",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "kind",
      title: "Project category",
      type: "string",
      group: "overview",
      options: {
        list: [
          { title: "AI engineering", value: "ai" },
          { title: "Web application", value: "web" },
          { title: "Mobile", value: "mobile" },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "cover",
      title: "Project cover",
      type: "image",
      options: { hotspot: true },
      fields: [alt],
      group: "overview",
    }),
    defineField({ name: "coverUrl", type: "string", hidden: true }),
    defineField({
      name: "color",
      title: "Cover background colour",
      type: "string",
      initialValue: "#dce3cf",
      group: "overview",
      validation: (rule) => rule.regex(/^#[0-9a-fA-F]{6}$/),
    }),
    defineField({
      name: "stack",
      title: "Technologies",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      group: "overview",
    }),
    defineField({
      name: "sections",
      title: "Case-study sections",
      description: "Add sections and drag them into the order you want.",
      type: "array",
      of: [
        { type: "textSection" },
        { type: "imageSection" },
        { type: "gallerySection" },
        { type: "factsSection" },
      ],
      group: "content",
    }),
    defineField({
      name: "website",
      title: "Public project URL",
      type: "url",
      group: "publishing",
      validation: (rule) => rule.uri({ scheme: ["https", "http"] }),
    }),
    defineField({
      name: "featured",
      title: "Show on homepage",
      type: "boolean",
      initialValue: true,
      group: "publishing",
    }),
    defineField({
      name: "order",
      title: "Display order",
      type: "number",
      initialValue: 10,
      group: "publishing",
    }),
  ],
  orderings: [
    {
      title: "Display order",
      name: "displayOrder",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: { select: { title: "title", subtitle: "category", media: "cover" } },
});
const portfolioProfile = defineType({
  name: "portfolioProfile",
  title: "Profile",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Full name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "roles",
      title: "Engineering roles",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "portrait",
      type: "image",
      options: { hotspot: true },
      fields: [alt],
    }),
    defineField({ name: "portraitUrl", type: "string", hidden: true }),
    defineField({ name: "location", type: "string" }),
    defineField({
      name: "introduction",
      title: "Homepage introduction",
      type: "text",
      rows: 3,
    }),
    defineField({ name: "about", title: "About", type: "text", rows: 6 }),
    defineField({
      name: "email",
      type: "string",
      validation: (rule) => rule.email(),
    }),
    defineField({ name: "github", title: "GitHub URL", type: "url" }),
    defineField({ name: "linkedin", title: "LinkedIn URL", type: "url" }),
  ],
});
const portfolioExperiment = defineType({
  name: "portfolioExperiment",
  title: "Lab entry",
  type: "document",
  fields: [
    defineField({
      name: "title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "title" },
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "category", type: "string" }),
    defineField({
      name: "summary",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "project",
      title: "Related project",
      type: "reference",
      to: [{ type: "portfolioProject" }],
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "order", type: "number", initialValue: 10 }),
  ],
});
export const schemaTypes = [
  portfolioProfile,
  portfolioProject,
  portfolioExperiment,
  textSection,
  imageSection,
  gallerySection,
  factsSection,
];
