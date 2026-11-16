import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight, Github } from "lucide-react";
import type { Project } from "../../constants/projects";
import { isAi } from "./projectKinds";
import { ProjectCover } from "./ProjectCover";

interface ProjectCardProps {
  project: Project;
  featured?: boolean;
  onRepos: (repos: string | string[]) => void;
}

/** Glass project card with a cursor-following light and a slow image push-in. */
export const ProjectCard: React.FC<ProjectCardProps> = ({ project, featured = false, onRepos }) => {
  const ref = useRef<HTMLElement>(null);
  const ai = isAi(project);

  return (
    <article
      ref={ref}
      data-slug={project.slug}
      onMouseMove={(e) => {
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        el.style.setProperty("--mx", `${e.clientX - r.left}px`);
        el.style.setProperty("--my", `${e.clientY - r.top}px`);
      }}
      className={`ap-card group relative flex overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02] transition-colors duration-300 hover:border-white/20 ${
        featured ? "flex-col md:col-span-2 md:flex-row" : "flex-row sm:flex-col"
      }`}
    >
      {/* cursor light */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(420px circle at var(--mx, 50%) var(--my, 50%), rgba(138,191,255,0.10), transparent 45%)",
        }}
      />

      <div
        className={`relative overflow-hidden ${
          featured
            ? "aspect-[16/10] md:aspect-auto md:w-3/5"
            : "w-28 shrink-0 self-stretch sm:aspect-[16/10] sm:w-auto sm:self-auto"
        }`}
      >
        <ProjectCover
          src={project.image}
          title={project.title}
          className="h-full w-full transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-core-obsidian/70 to-transparent" />
        {ai && (
          <span className="absolute left-2 top-2 rounded-full border border-core-icy/40 sm:left-4 sm:top-4 bg-core-obsidian/60 px-2.5 py-1 font-mono text-[10px] tracking-[0.2em] text-core-icy backdrop-blur-md">
            AI
          </span>
        )}
      </div>

      {/* z-[15] without `relative`: a flex item's z-index lifts the text above the cursor
          light (z-10) without becoming the containing block of the title's stretched ::after */}
      <div className={`z-[15] flex min-w-0 flex-1 flex-col ${featured ? "p-6 md:justify-center md:p-10" : "p-4 sm:p-6"}`}>
        <p className="font-mono text-[10px] tracking-[0.2em] text-core-mist">
          {project.finished_date.slice(0, 4)} · {project.role.toUpperCase()}
        </p>
        <h3
          className={`mt-2 font-semibold tracking-tight text-core-ink ${
            featured ? "text-3xl md:text-4xl" : "text-lg sm:text-xl"
          }`}
        >
          <Link
            to={`/projects/${project.slug}`}
            className="after:absolute after:inset-0 after:z-20 after:content-[''] focus-visible:after:outline focus-visible:after:outline-2 focus-visible:after:outline-core-icy"
          >
            {project.title}
          </Link>
        </h3>
        <p
          className={`mt-3 text-sm leading-relaxed text-core-mist ${
            featured ? "line-clamp-5" : "line-clamp-2 sm:line-clamp-3"
          }`}
        >
          {project.description}
        </p>
        <ul className={`mt-4 flex-wrap gap-1.5 ${featured ? "flex" : "hidden sm:flex"}`}>
          {project.tech.slice(0, featured ? 8 : 4).map((t) => (
            <li
              key={t}
              className="rounded-full border border-white/10 px-2 py-0.5 font-mono text-[10px] text-core-chrome"
            >
              {t}
            </li>
          ))}
          {!featured && project.tech.length > 4 && (
            <li className="px-1 py-0.5 font-mono text-[10px] text-core-mist">
              +{project.tech.length - 4}
            </li>
          )}
        </ul>
        {/* phone: the whole card opens the case study; demo/source live there */}
        <div className={`mt-auto flex-wrap gap-2 pt-6 ${featured ? "flex" : "hidden sm:flex"}`}>
          {project.web_url && (
            <a
              href={project.web_url}
              target="_blank"
              rel="noopener noreferrer"
              className="relative z-30 inline-flex items-center gap-1.5 rounded-full bg-core-chrome px-4 py-2 text-xs font-medium text-core-obsidian transition-colors hover:bg-core-ink"
            >
              Live demo <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          )}
          <button
            type="button"
            onClick={() => onRepos(project.repos)}
            className="relative z-30 inline-flex items-center gap-1.5 rounded-full border border-core-graphite px-4 py-2 text-xs font-medium text-core-ink transition-colors hover:border-core-mist"
          >
            <Github className="h-3.5 w-3.5" /> Source
          </button>
          <span
            aria-hidden="true"
            className="inline-flex items-center gap-1.5 px-2 py-2 text-xs font-medium text-core-mist transition-colors group-hover:text-core-ink"
          >
            Details <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>
    </article>
  );
};
