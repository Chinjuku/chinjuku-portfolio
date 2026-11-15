import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight, Github } from "lucide-react";
import { projects, type Project } from "../constants/projects";
import { RepoModal } from "./common/RepoModal";
import { useIsMobile, useReducedMotion } from "./hero/core/hooks";

gsap.registerPlugin(ScrollTrigger);

const year = (p: Project) => p.finished_date.slice(0, 4);
const pad = (n: number) => String(n).padStart(2, "0");

interface ProjectActionsProps {
  project: Project;
  onRepos: (repos: string | string[]) => void;
}

const ProjectActions: React.FC<ProjectActionsProps> = ({ project, onRepos }) => (
  <div className="flex flex-wrap gap-3">
    {project.web_url && (
      <a
        href={project.web_url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-full bg-core-chrome px-5 py-2.5 text-sm font-medium text-core-obsidian transition-colors hover:bg-core-ink"
      >
        Live demo <ArrowUpRight className="h-4 w-4" />
      </a>
    )}
    <button
      type="button"
      onClick={() => onRepos(project.repos)}
      className="inline-flex items-center gap-2 rounded-full border border-core-graphite px-5 py-2.5 text-sm font-medium text-core-ink transition-colors hover:border-core-mist"
    >
      <Github className="h-4 w-4" /> Source
    </button>
  </div>
);

const ProjectMeta: React.FC<{ project: Project }> = ({ project }) => (
  <>
    <p className="font-mono text-[11px] tracking-[0.2em] text-core-mist">
      {project.role.toUpperCase()} · {year(project)}
    </p>
    <p className="mt-4 text-base leading-relaxed text-core-mist">{project.description}</p>
    <ul className="mt-5 flex flex-wrap gap-1.5">
      {project.tech.map((t) => (
        <li
          key={t}
          className="rounded-full border border-white/10 px-2.5 py-1 font-mono text-[11px] text-core-chrome"
        >
          {t}
        </li>
      ))}
    </ul>
  </>
);

/**
 * "Selected Work": desktop pins the section and steps through the featured
 * projects with scroll (titles on the left, media + details on the right).
 * Mobile and reduced motion get a simple stacked list.
 */
const Projects: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const triggerRef = useRef<ScrollTrigger | null>(null);
  const [active, setActive] = useState(0);
  const [modalRepos, setModalRepos] = useState<string[] | null>(null);
  const isMobile = useIsMobile();
  const reduced = useReducedMotion();
  const stacked = isMobile || reduced;

  const openRepos = (repos: string | string[]) => {
    if (Array.isArray(repos)) setModalRepos(repos);
    else window.open(repos, "_blank", "noopener");
  };

  useEffect(() => {
    if (stacked) return;
    const ctx = gsap.context(() => {
      gsap.from(".work-head > *", {
        y: 24,
        opacity: 0,
        duration: 0.8,
        stagger: 0.08,
        ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
      });

      triggerRef.current = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: `+=${(projects.length - 1) * 80}%`,
        pin: true,
        snap: {
          snapTo: 1 / (projects.length - 1),
          duration: { min: 0.2, max: 0.5 },
          ease: "power2.inOut",
        },
        onUpdate: (self) => {
          const next = Math.round(self.progress * (projects.length - 1));
          setActive((prev) => (prev === next ? prev : next));
        },
      });
    }, sectionRef);
    ScrollTrigger.refresh();
    return () => {
      triggerRef.current = null;
      ctx.revert();
    };
  }, [stacked]);

  // crossfade + slow push-in on the media when the active project changes
  useEffect(() => {
    if (stacked) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".work-media-active",
        { opacity: 0, scale: 1.06 },
        { opacity: 1, scale: 1, duration: 0.9, ease: "power3.out" },
      );
      gsap.fromTo(
        ".work-detail > *",
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.05, ease: "power3.out" },
      );
    }, sectionRef);
    return () => ctx.revert();
  }, [active, stacked]);

  const goTo = (i: number) => {
    const st = triggerRef.current;
    if (!st) return;
    window.scrollTo({
      top: st.start + ((st.end - st.start) * i) / (projects.length - 1),
      behavior: "smooth",
    });
  };

  const header = (
    <div className="work-head flex flex-wrap items-end justify-between gap-6">
      <div>
        <p className="font-mono text-[11px] tracking-[0.3em] text-core-icy">SELECTED WORK</p>
        <h2 className="mt-4 text-4xl font-semibold tracking-[-0.03em] text-core-ink md:text-6xl">
          Products, shipped.
        </h2>
      </div>
      <Link
        to="/projects"
        className="inline-flex items-center gap-1.5 text-sm text-core-mist transition-colors hover:text-core-ink"
      >
        All projects <ArrowUpRight className="h-4 w-4" />
      </Link>
    </div>
  );

  const modal = (
    <RepoModal isOpen={modalRepos !== null} repos={modalRepos} onClose={() => setModalRepos(null)} />
  );

  if (stacked) {
    return (
      <section className="bg-core-obsidian px-6 py-24 md:px-12">
        {header}
        <div className="mt-12 space-y-14">
          {projects.map((p, i) => (
            <article key={p.id}>
              <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-white/10">
                <img src={p.image} alt="" loading="lazy" className="h-full w-full object-cover opacity-80 saturate-[0.7]" />
                <div className="absolute inset-0 bg-gradient-to-t from-core-obsidian/80 to-transparent" />
                <span className="absolute left-4 top-4 font-mono text-[11px] tracking-[0.2em] text-core-ink">
                  {pad(i + 1)} / {pad(projects.length)}
                </span>
              </div>
              <h3 className="mt-6 text-3xl font-semibold tracking-tight text-core-ink">{p.title}</h3>
              <div className="mt-3">
                <ProjectMeta project={p} />
              </div>
              <div className="mt-6">
                <ProjectActions project={p} onRepos={openRepos} />
              </div>
            </article>
          ))}
        </div>
        {modal}
      </section>
    );
  }

  const current = projects[active];

  return (
    // React-owned wrapper so the pin-spacer never confuses React on unmount
    <div>
      <section
        ref={sectionRef}
        className="relative flex h-screen flex-col overflow-hidden bg-core-obsidian px-12 pb-12 pt-28"
      >
        {header}

        <div className="mt-10 grid flex-1 grid-cols-12 gap-10 overflow-hidden">
          {/* project index */}
          <nav aria-label="Featured projects" className="col-span-4 flex flex-col justify-center gap-2">
            {projects.map((p, i) => (
              <button
                key={p.id}
                type="button"
                onClick={() => goTo(i)}
                aria-current={i === active ? "true" : undefined}
                className="group flex items-baseline gap-4 py-2 text-left"
              >
                <span
                  className={`font-mono text-[11px] tracking-[0.2em] transition-colors ${
                    i === active ? "text-core-icy" : "text-core-mist/60"
                  }`}
                >
                  {pad(i + 1)}
                </span>
                <span
                  className={`text-3xl font-semibold tracking-[-0.02em] transition-all duration-500 xl:text-4xl ${
                    i === active
                      ? "translate-x-1 text-core-ink"
                      : "text-core-ink/25 group-hover:text-core-ink/50"
                  }`}
                >
                  {p.title}
                </span>
              </button>
            ))}
            <div className="mt-6 h-px w-full bg-core-graphite">
              <div
                className="h-px bg-core-icy transition-[width] duration-500"
                style={{ width: `${((active + 1) / projects.length) * 100}%` }}
              />
            </div>
          </nav>

          {/* media + details */}
          <div className="col-span-8 grid grid-cols-8 gap-8 overflow-hidden">
            <div className="relative col-span-5 overflow-hidden rounded-2xl border border-white/10">
              {projects.map((p, i) => (
                <img
                  key={p.id}
                  src={p.image}
                  alt={i === active ? `${p.title} preview` : ""}
                  loading={i === 0 ? "eager" : "lazy"}
                  className={`absolute inset-0 h-full w-full object-cover ${
                    i === active ? "work-media-active opacity-90 saturate-[0.7]" : "opacity-0"
                  }`}
                />
              ))}
              <div className="absolute inset-0 bg-gradient-to-tr from-core-obsidian/70 via-transparent to-transparent" />
              <span className="absolute bottom-5 left-5 font-mono text-[11px] tracking-[0.2em] text-core-ink">
                {pad(active + 1)} / {pad(projects.length)}
              </span>
            </div>
            <div key={current.id} className="work-detail col-span-3 flex flex-col justify-center">
              <h3 className="text-2xl font-semibold tracking-tight text-core-ink">{current.title}</h3>
              <div className="mt-3">
                <ProjectMeta project={current} />
              </div>
              <div className="mt-8">
                <ProjectActions project={current} onRepos={openRepos} />
              </div>
            </div>
          </div>
        </div>
      </section>
      {modal}
    </div>
  );
};

export default Projects;
