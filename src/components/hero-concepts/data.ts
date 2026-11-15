// Real content for the hero concepts, derived from src/constants.
// No invented numbers: every stat is computed from the project list.
import { all_projects, type Project } from "../../constants/projects";
import { experiences, type Experience } from "../../constants/experiences";

export type LayerId = "frontend" | "backend" | "data" | "ai";

export interface StackLayer {
  id: LayerId;
  label: string;
  items: string[];
}

export const STACK_LAYERS: StackLayer[] = [
  { id: "frontend", label: "FRONTEND", items: ["React", "Next.js", "Tailwind"] },
  { id: "backend", label: "BACKEND", items: ["Node", "Django", "FastAPI", "Laravel"] },
  { id: "data", label: "DATA", items: ["PostgreSQL", "MongoDB", "Prisma"] },
  { id: "ai", label: "AI CORE", items: ["Gemini", "ML forecasting", "agents"] },
];

const AI_PATTERN = /gemini|machine learning|\bml\b|\bai\b|llm|agent/i;

export const isAiProject = (p: Project): boolean =>
  p.tech.some((t) => AI_PATTERN.test(t));

export const recentProjects = (n: number, source: Project[] = all_projects): Project[] =>
  [...source]
    .sort((a, b) => b.finished_date.localeCompare(a.finished_date))
    .slice(0, n);

export const aiProjects = (): Project[] => recentProjects(all_projects.length).filter(isAiProject);

export const fullstackProjects = (n: number): Project[] =>
  recentProjects(all_projects.length)
    .filter((p) => !isAiProject(p) && /fullstack/i.test(p.role))
    .slice(0, n);

export const STATS = {
  projects: all_projects.length,
  since: Math.min(...all_projects.map((p) => Number(p.finished_date.slice(0, 4)))),
  techCount: new Set(all_projects.flatMap((p) => p.tech.map((t) => t.toLowerCase()))).size,
  aiProjects: all_projects.filter(isAiProject).length,
};

export const latestExperiences = (n: number): Experience[] =>
  [...experiences]
    .sort((a, b) => b.finished_date.localeCompare(a.finished_date))
    .slice(0, n);

export const openProject = (
  p: Project,
  openModal: (repos: string[]) => void,
): void => {
  if (Array.isArray(p.repos)) {
    openModal(p.repos);
  } else {
    window.open(p.repos, "_blank", "noopener");
  }
};
