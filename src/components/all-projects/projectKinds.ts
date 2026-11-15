import type { Project } from "../../constants/projects";

export type ProjectKind = "all" | "ai" | "web" | "other";

const AI = /gemini|machine learning|\bml\b|\bai\b|llm/i;
const WEB = /react|next|vue|nuxt|laravel|django|flask|fastapi|php|html|express|node|nest|elysia/i;

export const isAi = (p: Project) => p.tech.some((t) => AI.test(t));
export const isWeb = (p: Project) => p.tech.some((t) => WEB.test(t));

export const matchesKind = (p: Project, kind: ProjectKind): boolean => {
  if (kind === "all") return true;
  if (kind === "ai") return isAi(p);
  if (kind === "web") return isWeb(p);
  return !isWeb(p);
};

export const KIND_LABELS: Record<ProjectKind, string> = {
  all: "All",
  ai: "AI",
  web: "Web apps",
  other: "Other",
};

export const projectYear = (p: Project) => Number(p.finished_date.slice(0, 4));
