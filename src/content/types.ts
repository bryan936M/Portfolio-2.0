import type { PortableTextBlock } from "@portabletext/react";

export interface ContentImage {
  url: string;
  alt: string;
  caption?: string;
}
export interface ContentSection {
  _key: string;
  _type: "textSection" | "imageSection" | "gallerySection" | "factsSection";
  heading?: string;
  text?: string;
  body?: PortableTextBlock[];
  image?: ContentImage;
  images?: ContentImage[];
  items?: { label: string; value: string }[];
}
export interface Project {
  slug: string;
  title: string;
  category: string;
  kind: "ai" | "web" | "mobile";
  summary: string;
  cover: string;
  color: string;
  stack: string[];
  featured: boolean;
  website?: string;
  sections: ContentSection[];
}
export interface Profile {
  name: string;
  roles: string[];
  location: string;
  email: string;
  github: string;
  linkedin: string;
  portrait: string;
  introduction: string;
  about: string;
}
export interface Experiment {
  slug: string;
  title: string;
  category: string;
  summary: string;
  project: string;
}
export interface Portfolio {
  profile: Profile;
  projects: Project[];
  experiments: Experiment[];
}
