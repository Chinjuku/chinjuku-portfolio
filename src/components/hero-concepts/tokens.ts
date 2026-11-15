// Scoped design tokens for the /hero-concepts exploration.
// Intentionally NOT added to tailwind.config.js until a concept is chosen.

export const COLORS = {
  obsidian: "#080B12",
  graphite: "#222B39",
  chrome: "#C9D1DB",
  icy: "#8ABFFF",
  text: "#F4F6FA",
  muted: "#929EAF",
} as const;

export const COPY = {
  eyebrow: "FULL-STACK × AI DEVELOPER",
  title: "Building ideas into intelligent systems.",
  sub: "I design and build modern web applications, full-stack systems and AI-powered experiences.",
  ctaProjects: { label: "View Projects", href: "/projects" },
  ctaAbout: { label: "About Me", href: "/#about" },
  placeholderNotice:
    "Core = temporary placeholder geometry · final Blender model pending",
} as const;

export type ConceptId = 1 | 2 | 3;

export const CONCEPTS: { id: ConceptId; label: string }[] = [
  { id: 1, label: "Editorial" },
  { id: 2, label: "Immersive" },
  { id: 3, label: "System" },
];
