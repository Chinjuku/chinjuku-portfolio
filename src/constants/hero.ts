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

export interface HeroLayerDetail {
  id: HeroLayerId;
  title: string;
  description: string;
  /** matches a project's tech list to show related work */
  match: RegExp;
}

export const HERO_LAYER_DETAILS: Record<HeroLayerId, HeroLayerDetail> = {
  frontend: {
    id: "frontend",
    title: "Frontend",
    description:
      "Interfaces people use every day: responsive React and Next.js apps, PWAs and LINE LIFF front ends.",
    match: /react|next|vue|nuxt|tailwind/i,
  },
  backend: {
    id: "backend",
    title: "Backend",
    description:
      "APIs and services across Node, Django, FastAPI and Laravel: auth, scheduling, integrations and tooling.",
    match: /node|express|django|fastapi|laravel|flask|nest|elysia/i,
  },
  data: {
    id: "data",
    title: "Data",
    description:
      "Relational and document data modelling with PostgreSQL, MongoDB, Prisma and Supabase realtime.",
    match: /postgres|mongo|mysql|prisma|supabase|sqlite/i,
  },
  ai: {
    id: "ai",
    title: "AI Core",
    description:
      "AI inside real products: Gemini-powered OCR, ML stock forecasting and AI-assisted developer tooling.",
    match: /gemini|machine learning|\bml\b|\bai\b|llm/i,
  },
};
