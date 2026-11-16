import {
  all_projects,
  type Project,
  type ProjectShot,
  type ShotDevice,
} from "../../constants/projects";

const DEVICE_ORDER: ShotDevice[] = ["desktop", "phone"];

export function projectBySlug(slug: string | null): Project | undefined {
  if (!slug) return undefined;
  return all_projects.find((p) => p.slug === slug);
}

export function galleryDevices(project: Project): ShotDevice[] {
  const present = new Set((project.gallery ?? []).map((s) => s.device));
  return DEVICE_ORDER.filter((d) => present.has(d));
}

export function shotsFor(project: Project, device: ShotDevice): ProjectShot[] {
  return (project.gallery ?? []).filter((s) => s.device === device);
}

export function stepIndex(index: number, delta: number, length: number): number {
  if (length <= 1) return 0;
  return (((index + delta) % length) + length) % length;
}
