import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, Navigate, useSearchParams } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowLeft } from "lucide-react";
import { all_projects } from "../constants/projects";
import { RepoModal } from "../components/common/RepoModal";
import { Odometer } from "../components/motion";
import {
  FeaturedCarousel,
  KIND_LABELS,
  ProjectCard,
  isAi,
  matchesKind,
  projectBySlug,
  projectYear,
  type ProjectKind,
} from "../components/all-projects";

gsap.registerPlugin(ScrollTrigger);

const SORTED = [...all_projects].sort((a, b) => b.finished_date.localeCompare(a.finished_date));
const YEARS = Array.from(new Set(SORTED.map(projectYear))).sort((a, b) => b - a);
const STATS = [
  { label: "PROJECTS", value: SORTED.length },
  { label: "SINCE", value: Math.min(...YEARS) },
  { label: "AI PROJECTS", value: SORTED.filter(isAi).length },
  {
    label: "TECHNOLOGIES",
    value: new Set(SORTED.flatMap((p) => p.tech.map((t) => t.toLowerCase()))).size,
  },
];
const KINDS: ProjectKind[] = ["all", "ai", "web", "other"];
const CAROUSEL_COUNT = 5;
const CAROUSEL_INTERVAL_MS = 9000;

const chip = (active: boolean) =>
  `inline-flex items-center rounded-full px-3.5 py-1.5 text-xs transition-colors [@media(pointer:coarse)]:min-h-[44px] [@media(pointer:coarse)]:px-4 ${
    active
      ? "bg-core-ink text-core-obsidian"
      : "border border-white/10 text-core-mist hover:border-white/25 hover:text-core-ink"
  }`;

const AllProjects: React.FC = () => {
  const pageRef = useRef<HTMLDivElement>(null);
  const [year, setYear] = useState<number | "all">("all");
  const [kind, setKind] = useState<ProjectKind>("all");
  const [modalRepos, setModalRepos] = useState<string[] | null>(null);

  // legacy drawer links (?project=<slug>) now go to the case-study page
  const [params] = useSearchParams();
  const legacySlug = params.get("project");

  const filtered = useMemo(
    () =>
      SORTED.filter(
        (p) => (year === "all" || projectYear(p) === year) && matchesKind(p, kind),
      ),
    [year, kind],
  );
  // unfiltered view: the latest projects rotate in the carousel, the rest fill the grid
  const showFeatured = year === "all" && kind === "all";
  const gridProjects = showFeatured ? filtered.slice(CAROUSEL_COUNT) : filtered;

  const openRepos = (repos: string | string[]) => {
    if (Array.isArray(repos)) setModalRepos(repos);
    else window.open(repos, "_blank", "noopener");
  };

  // header entrance (once)
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".ap-head > *", { y: 28, opacity: 0, duration: 0.9, stagger: 0.08, ease: "power3.out" });
    }, pageRef);
    return () => ctx.revert();
  }, []);

  // cards rise in as they enter; re-run whenever the filter changes the set
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(".ap-card", { y: 32, opacity: 0 });
      ScrollTrigger.batch(".ap-card", {
        start: "top 92%",
        once: true,
        onEnter: (els) =>
          gsap.to(els, { y: 0, opacity: 1, duration: 0.7, stagger: 0.06, ease: "power3.out" }),
      });
    }, pageRef);
    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, [filtered]);

  if (legacySlug && projectBySlug(legacySlug)) {
    return <Navigate to={`/projects/${legacySlug}`} replace />;
  }

  return (
    <div ref={pageRef} className="min-h-screen bg-core-obsidian pb-32 pt-32 text-core-ink">
      {/* same edges as Home and the case-study pages */}
      <div className="mx-auto w-full max-w-7xl px-6 md:px-12 xl:max-w-[1440px] 2xl:max-w-[1600px] 2xl:px-16">
        <header className="ap-head">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-core-mist transition-colors hover:text-core-ink"
          >
            <ArrowLeft className="h-4 w-4" /> Home
          </Link>
          <p className="mt-10 font-mono text-[11px] tracking-[0.3em] text-core-icy">ALL PROJECTS</p>
          <h1 className="mt-4 max-w-4xl text-5xl font-semibold leading-[0.98] tracking-[-0.04em] md:text-7xl lg:text-8xl">
            Everything I&apos;ve built.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-core-mist md:text-lg">
            Full-stack products, AI features, tools and experiments, from university projects to
            production apps.
          </p>
          <dl className="mt-12 grid grid-cols-2 gap-6 border-t border-core-graphite pt-6 md:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.label}>
                <dt className="font-mono text-[10px] tracking-[0.2em] text-core-mist">{s.label}</dt>
                <dd className="mt-1 text-3xl font-semibold tracking-tight">
                  <Odometer value={s.value} />
                </dd>
              </div>
            ))}
          </dl>
        </header>

        {/* filters */}
        <div className="z-40 mt-14 md:sticky md:top-24 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/[0.06] bg-core-obsidian/90 p-3 backdrop-blur-xl">
          <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter by type">
            {KINDS.map((k) => (
              <button key={k} type="button" aria-pressed={kind === k} onClick={() => setKind(k)} className={chip(kind === k)}>
                {KIND_LABELS[k]}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter by year">
            <button type="button" aria-pressed={year === "all"} onClick={() => setYear("all")} className={chip(year === "all")}>
              Any year
            </button>
            {YEARS.map((y) => (
              <button key={y} type="button" aria-pressed={year === y} onClick={() => setYear(y)} className={chip(year === y)}>
                {y}
              </button>
            ))}
          </div>
        </div>

        <p className="mt-6 font-mono text-[11px] tracking-[0.2em] text-core-mist" aria-live="polite">
          {String(filtered.length).padStart(2, "0")} RESULT{filtered.length === 1 ? "" : "S"}
        </p>

        {filtered.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-dashed border-white/10 p-16 text-center">
            <p className="text-core-mist">No projects match these filters.</p>
            <button
              type="button"
              onClick={() => {
                setKind("all");
                setYear("all");
              }}
              className="mt-4 text-sm text-core-icy hover:underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <>
            {showFeatured && (
              // `isolate` keeps the carousel's z-30 controls under the sticky filter bar
              <div className="isolate mt-6">
                <FeaturedCarousel
                  projects={filtered.slice(0, CAROUSEL_COUNT)}
                  onRepos={openRepos}
                  interval={CAROUSEL_INTERVAL_MS}
                />
              </div>
            )}
            <div className="isolate mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {gridProjects.map((p) => (
                <ProjectCard key={p.id} project={p} onRepos={openRepos} />
              ))}
            </div>
          </>
        )}
      </div>

      <RepoModal isOpen={modalRepos !== null} repos={modalRepos} onClose={() => setModalRepos(null)} />
    </div>
  );
};

export default AllProjects;
