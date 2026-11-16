import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight, Github } from "lucide-react";
import { projects, type Project } from "../constants/projects";
import { RepoModal } from "./common/RepoModal";
import { useIsMobile, useReducedMotion } from "./hero/core/hooks";
import Container from "./common/Container";

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
        className="inline-flex items-center gap-2 rounded-full bg-core-chrome min-h-[44px] px-5 py-2.5 text-sm font-medium text-core-obsidian transition-colors hover:bg-core-ink"
      >
        Live demo <ArrowUpRight className="h-4 w-4" />
      </a>
    )}
    <button
      type="button"
      onClick={() => onRepos(project.repos)}
      className="inline-flex items-center gap-2 rounded-full border border-core-graphite min-h-[44px] px-5 py-2.5 text-sm font-medium text-core-ink transition-colors hover:border-core-mist"
    >
      <Github className="h-4 w-4" /> Source
    </button>
  </div>
);

const projectKind = (p: Project) => `${p.role.toUpperCase()} · ${year(p)}`;

const ProjectTags: React.FC<{ project: Project; max?: number }> = ({ project, max }) => {
  const shown = max ? project.tech.slice(0, max) : project.tech;
  const more = project.tech.length - shown.length;
  return (
    <ul className="flex flex-wrap gap-1.5">
      {shown.map((t) => (
        <li key={t} className="rounded-full border border-white/10 px-2.5 py-1 font-mono text-[11px] text-core-chrome">
          {t}
        </li>
      ))}
      {more > 0 && (
        <li className="rounded-full border border-white/10 px-2.5 py-1 font-mono text-[11px] text-core-mist">
          +{more}
        </li>
      )}
    </ul>
  );
};

const ProjectMeta: React.FC<{ project: Project }> = ({ project }) => (
  <>
    <p className="font-mono text-[11px] tracking-[0.2em] text-core-mist">{projectKind(project)}</p>
    <p className="mt-4 line-clamp-4 text-base leading-relaxed text-core-mist">{project.description}</p>
    <div className="mt-5">
      <ProjectTags project={project} max={5} />
    </div>
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
  // the pinned three-column stage needs a laptop-wide screen; tablets get the stacked list
  const [narrow, setNarrow] = useState(() => window.matchMedia("(max-width: 1023px)").matches);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1023px)");
    const on = () => setNarrow(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  const reduced = useReducedMotion();
  const stacked = narrow || reduced;
  // phones swipe through the projects instead of scrolling a long list
  const isMobile = useIsMobile();
  const carousel = stacked && isMobile;
  const railRef = useRef<HTMLDivElement>(null);
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    const rail = railRef.current;
    if (!carousel || !rail) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const center = rail.scrollLeft + rail.clientWidth / 2;
      let nearest = 0;
      let best = Infinity;
      Array.from(rail.children).forEach((node, i) => {
        const el = node as HTMLElement;
        const d = Math.abs(el.offsetLeft + el.offsetWidth / 2 - center);
        if (d < best) {
          best = d;
          nearest = i;
        }
        if (reduced) return;
        // neighbours shrink and dim the further they sit from center
        const t = Math.min(1, d / el.offsetWidth);
        el.style.transform = `scale(${1 - t * 0.08})`;
        el.style.opacity = String(1 - t * 0.55);
      });
      setSlide(nearest);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    rail.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      rail.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      Array.from(rail.children).forEach((node) => {
        (node as HTMLElement).style.transform = "";
        (node as HTMLElement).style.opacity = "";
      });
    };
  }, [carousel, reduced]);

  const scrollToSlide = (i: number) => {
    const rail = railRef.current;
    const el = rail?.children[i] as HTMLElement | undefined;
    if (!rail || !el) return;
    rail.scrollTo({
      left: el.offsetLeft - (rail.clientWidth - el.offsetWidth) / 2,
      behavior: reduced ? "auto" : "smooth",
    });
  };

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
          inertia: false,
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

  // stacked (tablet/mobile): reveal each card on scroll, drift the image inside its frame
  const stackRef = useRef<HTMLElement>(null);
  useEffect(() => {
    if (!stacked || reduced) return;
    const ctx = gsap.context(() => {
      gsap.from(".work-head > *", {
        y: 24,
        opacity: 0,
        duration: 0.8,
        stagger: 0.08,
        ease: "power3.out",
        scrollTrigger: { trigger: ".work-head", start: "top 85%", once: true },
      });
      gsap.utils.toArray<HTMLElement>(".work-card").forEach((card) => {
        gsap.fromTo(
          card.querySelector(".work-media"),
          { clipPath: "inset(12% 8% 12% 8% round 24px)", opacity: 0.4 },
          {
            clipPath: "inset(0% 0% 0% 0% round 16px)",
            opacity: 1,
            duration: 1,
            ease: "power3.out",
            clearProps: "clipPath",
            scrollTrigger: { trigger: card, start: "top 80%", once: true },
          },
        );
        gsap.from(card.querySelectorAll(".work-text > *"), {
          y: 22,
          opacity: 0,
          duration: 0.7,
          stagger: 0.07,
          ease: "power3.out",
          scrollTrigger: { trigger: card, start: "top 70%", once: true },
        });
        gsap.fromTo(
          card.querySelector(".work-img"),
          { yPercent: -5 },
          {
            yPercent: 5,
            ease: "none",
            scrollTrigger: { trigger: card, start: "top bottom", end: "bottom top", scrub: true },
          },
        );
      });
    }, stackRef);
    return () => ctx.revert();
  }, [stacked, reduced]);

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
      <section ref={stackRef} className="bg-core-obsidian py-24">
        <Container>
          {header}
          <div
            ref={railRef}
            className={
              carousel
                ? "-mx-6 mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                : "mt-12 space-y-16 md:space-y-24"
            }
            aria-roledescription={carousel ? "carousel" : undefined}
          >
            {projects.map((p, i) => (
              <article
                key={p.id}
                aria-label={carousel ? `${i + 1} of ${projects.length}: ${p.title}` : undefined}
                className={`work-card group md:grid md:grid-cols-12 md:items-center md:gap-10 ${
                  carousel ? "w-[86%] shrink-0 snap-center will-change-transform" : ""
                }`}
              >
                <div className="work-media relative aspect-[16/10] overflow-hidden rounded-2xl border border-white/10 transition-colors duration-500 hover:border-core-icy/40 md:col-span-6 md:aspect-square">
                  <img
                    src={p.image}
                    alt=""
                    loading="lazy"
                    className="work-img absolute inset-x-0 -top-[6%] h-[112%] w-full object-cover opacity-80 saturate-[0.7] transition-[opacity,filter,transform] duration-700 group-hover:scale-[1.03] group-hover:opacity-100 group-hover:saturate-100"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-core-obsidian/80 to-transparent" />
                  <span className="absolute left-4 top-4 rounded-full border border-white/10 bg-core-obsidian/80 px-2.5 py-1 font-mono text-[11px] tracking-[0.2em] text-core-ink backdrop-blur-md">
                    {pad(i + 1)} / {pad(projects.length)}
                  </span>
                </div>
                <div className="work-text mt-6 md:col-span-6 md:mt-0">
                  <h3 className="text-3xl font-semibold tracking-tight text-core-ink">{p.title}</h3>
                  <div className="mt-3">
                    <ProjectMeta project={p} />
                  </div>
                  <div className="mt-6">
                    <ProjectActions project={p} onRepos={openRepos} />
                  </div>
                </div>
              </article>
            ))}
          </div>
          {carousel && (
            <div className="mt-6 flex items-center gap-4 font-mono text-[11px] tracking-[0.2em] text-core-chrome">
              <span aria-live="polite">
                {pad(slide + 1)} / {pad(projects.length)}
              </span>
              <div className="h-px flex-1 bg-core-graphite">
                <div
                  className="h-px bg-core-icy transition-[width] duration-500"
                  style={{ width: `${((slide + 1) / projects.length) * 100}%` }}
                />
              </div>
              <div className="flex gap-1.5">
                {projects.map((p, i) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => scrollToSlide(i)}
                    aria-label={`Show ${p.title}`}
                    aria-current={i === slide ? "true" : undefined}
                    className="flex h-11 w-7 items-center justify-center"
                  >
                    <span
                      className={`block h-1.5 rounded-full transition-all duration-300 ${
                        i === slide ? "w-4 bg-core-icy" : "w-1.5 bg-core-mist/50"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </Container>
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
        className="relative flex h-screen flex-col overflow-hidden bg-core-obsidian pb-12 pt-28"
      >
        <Container className="flex min-h-0 flex-1 flex-col">
        {header}

        <div className="mt-10 grid flex-1 grid-cols-12 gap-10 overflow-hidden">
          {/* project index */}
          <nav aria-label="Featured projects" className="col-span-3 flex flex-col justify-start gap-2 pt-1">
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
                    i === active ? "text-core-icy" : "text-core-mist"
                  }`}
                >
                  {pad(i + 1)}
                </span>
                <span
                  className={`text-3xl font-semibold tracking-[-0.02em] transition-all duration-500 xl:text-4xl ${
                    i === active
                      ? "translate-x-1 text-core-ink"
                      : "text-core-mist group-hover:text-core-ink"
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

          {/* media on top, details underneath: one wide stage */}
          <div className="col-span-9 flex min-h-0 flex-col gap-6">
            <div className="relative min-h-[200px] flex-1 overflow-hidden rounded-2xl border border-white/10">
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
            <div key={current.id} className="work-detail grid shrink-0 grid-cols-12 gap-8">
              <div className="col-span-5">
                <h3 className="text-2xl font-semibold tracking-tight text-core-ink">{current.title}</h3>
                <p className="mt-2 font-mono text-[11px] tracking-[0.2em] text-core-mist">{projectKind(current)}</p>
                <div className="mt-4">
                  <ProjectTags project={current} />
                </div>
                <div className="mt-5">
                  <ProjectActions project={current} onRepos={openRepos} />
                </div>
              </div>
              <p className="col-span-7 text-base leading-relaxed text-core-mist">{current.description}</p>
            </div>
          </div>
        </div>
        </Container>
      </section>
      {modal}
    </div>
  );
};

export default Projects;
