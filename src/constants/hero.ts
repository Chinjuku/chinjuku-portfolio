export const HERO_COPY = {
  eyebrow: "FULL-STACK × AI DEVELOPER",
  title: "Building ideas into intelligent systems.",
  sub: "I design and build modern web applications, full-stack systems and AI-powered experiences.",
  ctaProjects: { label: "View Projects", href: "/projects" },
  ctaAbout: { label: "About Me", href: "#about" },
  explore: "Explore the work →",
} as const;

export type HeroLayerId = "frontend" | "backend" | "data" | "ai";

export interface HeroStackLayer {
  id: HeroLayerId;
  label: string;
  items: string[];
}

/** Labels for the Core's exploded layers: chrome shell = full-stack, glass core = AI. */
export const HERO_STACK_LAYERS: HeroStackLayer[] = [
  { id: "frontend", label: "FRONTEND", items: ["React", "Next.js", "Tailwind"] },
  { id: "backend", label: "BACKEND", items: ["Node", "Django", "FastAPI", "Laravel"] },
  { id: "data", label: "DATA", items: ["PostgreSQL", "MongoDB", "Prisma"] },
  { id: "ai", label: "AI CORE", items: ["Gemini", "ML forecasting", "agents"] },
];
