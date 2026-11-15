import { all_projects, type Project } from "../../constants/projects";
import { HERO_LAYER_DETAILS, type HeroLayerId } from "../../constants/hero";

/** Most recent projects whose tech matches a Core layer. */
export const relatedProjects = (id: HeroLayerId, n = 3): Project[] =>
  [...all_projects]
    .filter((p) => p.tech.some((t) => HERO_LAYER_DETAILS[id].match.test(t)))
    .sort((a, b) => b.finished_date.localeCompare(a.finished_date))
    .slice(0, n);

export const primaryRepo = (p: Project): string =>
  Array.isArray(p.repos) ? p.repos[0] : p.repos;
