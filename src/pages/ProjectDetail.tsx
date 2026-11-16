import React, { useEffect, useRef, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import gsap from "gsap";
import { ArrowLeft, ArrowRight, ArrowUpRight, Github } from "lucide-react";
import { all_projects } from "../constants/projects";
import { RepoModal } from "../components/common/RepoModal";
import { usePrefersReducedMotion } from "../components/motion";
import { ProjectGallery, isAi, projectBySlug } from "../components/all-projects";

// same order as the All Projects page: newest first
const ORDERED = [...all_projects].sort((a, b) => b.finished_date.localeCompare(a.finished_date));
const pad = (n: number) => String(n).padStart(2, "0");

/** Case-study page for one project: gallery, overview, highlights and stack. */
const ProjectDetail: React.FC = () => {
  const { slug } = useParams();
  const project = projectBySlug(slug ?? null);
  const pageRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const [modalRepos, setModalRepos] = useState<string[] | null>(null);

  // page title for shared links; restored when leaving the page
  useEffect(() => {
    if (!project) return;
    const prev = document.title;
    document.title = `${project.title} · Chinjuku`;
    return () => {
      document.title = prev;
    };
  }, [project]);

  useEffect(() => {
    if (!project || reduced) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".pd-reveal",
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, stagger: 0.07, ease: "power3.out" },
      );
    }, pageRef);
    return () => ctx.revert();
  }, [project, reduced]);

  if (!project) return <Navigate to="/projects" replace />;

  const position = ORDERED.findIndex((p) => p.slug === project.slug);
  const next = ORDERED[(position + 1) % ORDERED.length];
  const overview = project.overview && project.overview.length > 0 ? project.overview : [project.description];

  const openRepos = (repos: string | string[]) => {
    if (Array.isArray(repos)) setModalRepos(repos);
    else window.open(repos, "_blank", "noopener");
  };

  const row = "grid gap-3 border-t border-core-graphite py-6 md:grid-cols-[9rem_1fr]";
  const label = "font-mono text-[11px] tracking-[0.2em] text-core-mist";

  return (
    <div ref={pageRef} className="min-h-screen bg-core-obsidian pb-32 pt-32 text-core-ink">
      <article className="mx-auto w-full max-w-7xl px-6 md:px-12 xl:max-w-[1440px] 2xl:max-w-[1600px] 2xl:px-16">
        <div className="pd-reveal flex items-center justify-between">
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 text-sm text-core-mist transition-colors hover:text-core-ink"
          >
            <ArrowLeft className="h-4 w-4" /> All projects
          </Link>
          <span className={label}>
            {pad(position + 1)} / {pad(ORDERED.length)}
          </span>
        </div>

        <header className="pd-reveal mt-10 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className={label}>
              {project.role.toUpperCase()} · {project.finished_date.slice(0, 4)}
              {isAi(project) && <span className="ml-2 text-core-icy">· AI</span>}
            </p>
            <h1 className="mt-4 text-5xl font-semibold leading-[0.98] tracking-[-0.04em] md:text-7xl">
              {project.title}
            </h1>
          </div>
          <div className="flex flex-wrap gap-2">
            {project.web_url && (
              <a
                href={project.web_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full bg-core-chrome px-5 py-2.5 text-sm font-medium text-core-obsidian transition-colors hover:bg-core-ink"
              >
                Live demo <ArrowUpRight className="h-4 w-4" />
              </a>
            )}
            <button
              type="button"
              onClick={() => openRepos(project.repos)}
              className="inline-flex items-center gap-1.5 rounded-full border border-core-graphite px-5 py-2.5 text-sm font-medium text-core-ink transition-colors hover:border-core-mist"
            >
              <Github className="h-4 w-4" /> Source
            </button>
          </div>
        </header>

        <div className="mt-14 grid gap-12 lg:grid-cols-12 lg:gap-16">
          {/* gallery stays in view while the write-up scrolls on large screens */}
          <div className="pd-reveal min-w-0 lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <ProjectGallery project={project} />
            </div>
          </div>

          <div className="pd-reveal min-w-0 lg:col-span-7">
            <section className={`${row} border-t-0 pt-0`}>
              <h2 className={label}>OVERVIEW</h2>
              <div className="space-y-4 text-base leading-relaxed text-core-chrome md:text-lg">
                {overview.map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </section>

            <section className={row}>
              <h2 className={label}>MY ROLE</h2>
              <p className="text-base text-core-ink">{project.role}</p>
            </section>

            {project.highlights && project.highlights.length > 0 && (
              <section className={row}>
                <h2 className={label}>HIGHLIGHTS</h2>
                <ul className="list-disc space-y-2 pl-5 text-base leading-relaxed text-core-chrome marker:text-core-icy">
                  {project.highlights.map((h) => (
                    <li key={h}>{h}</li>
                  ))}
                </ul>
              </section>
            )}

            <section className={row}>
              <h2 className={label}>STACK</h2>
              <ul className="flex flex-wrap gap-1.5">
                {project.tech.map((t) => (
                  <li
                    key={t}
                    className="rounded-full border border-white/10 px-2.5 py-1 font-mono text-[11px] text-core-chrome"
                  >
                    {t}
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>

        <Link
          to={`/projects/${next.slug}`}
          className="group mt-20 flex items-center justify-between gap-6 border-t border-core-graphite pt-8"
        >
          <span className={label}>NEXT PROJECT</span>
          <span className="flex items-center gap-3 text-2xl font-semibold tracking-tight text-core-ink md:text-4xl">
            {next.title}
            <ArrowRight className="h-6 w-6 transition-transform group-hover:translate-x-1" />
          </span>
        </Link>
      </article>

      <RepoModal isOpen={modalRepos !== null} repos={modalRepos} onClose={() => setModalRepos(null)} />
    </div>
  );
};

export default ProjectDetail;
