import React, { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ArrowLeft, ArrowRight, ArrowUpRight, Github, Pause, Play } from "lucide-react";
import type { Project } from "../../constants/projects";
import { usePrefersReducedMotion } from "../motion";
import { ProjectCover } from "./ProjectCover";
import { isAi } from "./projectKinds";

interface FeaturedCarouselProps {
  projects: Project[];
  onRepos: (repos: string | string[]) => void;
  /** auto-advance interval in ms */
  interval?: number;
}

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Large featured-project carousel. Auto-advances (default 9 s) with a
 * progress bar; pauses on hover, keyboard focus, when the tab is hidden or
 * when the user presses pause. Arrows, dots, ←/→ keys and swipe all work.
 */
export const FeaturedCarousel: React.FC<FeaturedCarouselProps> = ({
  projects,
  onRepos,
  interval = 9000,
}) => {
  const rootRef = useRef<HTMLElement>(null);
  const timerRef = useRef<gsap.core.Tween | null>(null);
  const hoverRef = useRef(false);
  const swipeX = useRef<number | null>(null);
  const [index, setIndex] = useState(0);
  const [userPaused, setUserPaused] = useState(false);
  const reduced = usePrefersReducedMotion();
  const count = projects.length;
  const autoplay = !reduced && count > 1;

  const go = useCallback((i: number) => setIndex(((i % count) + count) % count), [count]);
  const next = useCallback(() => setIndex((i) => (i + 1) % count), [count]);
  const prev = useCallback(() => setIndex((i) => (i - 1 + count) % count), [count]);

  // slide-in: image wipes and settles, text staggers up
  useEffect(() => {
    if (reduced || !rootRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".fc-media-active",
        { clipPath: "inset(0% 0% 0% 100%)", scale: 1.08 },
        { clipPath: "inset(0% 0% 0% 0%)", scale: 1, duration: 1.1, ease: "power4.out" },
      );
      gsap.fromTo(
        ".fc-copy > *",
        { y: 22, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, stagger: 0.06, ease: "power3.out", delay: 0.15 },
      );
    }, rootRef);
    return () => ctx.revert();
  }, [index, reduced]);

  // progress bar drives the auto-advance; restarts on every slide change
  useEffect(() => {
    if (!autoplay) return;
    const bar = rootRef.current?.querySelector(".fc-progress-active");
    if (!bar) return;
    const tween = gsap.fromTo(
      bar,
      { scaleX: 0 },
      { scaleX: 1, duration: interval / 1000, ease: "none", onComplete: next },
    );
    timerRef.current = tween;
    if (hoverRef.current || userPaused || document.hidden) tween.pause();
    return () => {
      tween.kill();
      timerRef.current = null;
    };
  }, [index, autoplay, interval, next, userPaused]);

  // pause while the tab is hidden
  useEffect(() => {
    const onVis = () => {
      const t = timerRef.current;
      if (!t) return;
      if (document.hidden) t.pause();
      else if (!hoverRef.current && !userPaused) t.resume();
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, [userPaused]);

  const hold = () => {
    hoverRef.current = true;
    timerRef.current?.pause();
  };
  const release = () => {
    hoverRef.current = false;
    if (!userPaused) timerRef.current?.resume();
  };

  if (count === 0) return null;
  const current = projects[index];

  return (
    <section
      ref={rootRef}
      aria-roledescription="carousel"
      aria-label="Latest projects"
      tabIndex={0}
      onMouseEnter={hold}
      onMouseLeave={release}
      onFocus={hold}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) release();
      }}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") next();
        if (e.key === "ArrowLeft") prev();
      }}
      onPointerDown={(e) => {
        swipeX.current = e.clientX;
      }}
      onPointerUp={(e) => {
        if (swipeX.current === null) return;
        const dx = e.clientX - swipeX.current;
        swipeX.current = null;
        if (Math.abs(dx) > 50) (dx < 0 ? next : prev)();
      }}
      className="ap-carousel relative overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.02] outline-none focus-visible:ring-2 focus-visible:ring-core-icy/40"
    >
      <div className="flex flex-col md:min-h-[520px] md:flex-row">
        {/* media */}
        <div className="relative aspect-[16/10] overflow-hidden md:aspect-auto md:w-3/5">
          {projects.map((p, i) => (
            <div
              key={p.id}
              aria-hidden={i !== index}
              className={`absolute inset-0 ${i === index ? "fc-media-active z-10" : "z-0 opacity-0"}`}
            >
              <ProjectCover src={p.image} title={p.title} className="h-full w-full" />
            </div>
          ))}
          <div className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-r from-transparent via-transparent to-core-obsidian/60" />
          <span className="absolute left-5 top-5 z-30 font-mono text-[11px] tracking-[0.2em] text-core-ink">
            LATEST · {pad(index + 1)} / {pad(count)}
          </span>
        </div>

        {/* copy */}
        <div className="relative flex flex-1 flex-col p-6 md:p-10">
          <div key={current.id} className="fc-copy flex flex-1 flex-col justify-center" aria-live="polite">
            <p className="font-mono text-[10px] tracking-[0.2em] text-core-mist">
              {current.finished_date.slice(0, 4)} · {current.role.toUpperCase()}
              {isAi(current) && <span className="ml-2 text-core-icy">· AI</span>}
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-core-ink md:text-5xl">
              {current.title}
            </h2>
            <p className="mt-4 line-clamp-4 text-sm leading-relaxed text-core-mist md:text-base">
              {current.description}
            </p>
            <ul className="mt-5 flex flex-wrap gap-1.5">
              {current.tech.slice(0, 7).map((t) => (
                <li
                  key={t}
                  className="rounded-full border border-white/10 px-2.5 py-1 font-mono text-[10px] text-core-chrome"
                >
                  {t}
                </li>
              ))}
            </ul>
            <div className="mt-7 flex flex-wrap gap-2">
              {current.web_url && (
                <a
                  href={current.web_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full bg-core-chrome px-5 py-2.5 text-sm font-medium text-core-obsidian transition-colors hover:bg-core-ink"
                >
                  Live demo <ArrowUpRight className="h-4 w-4" />
                </a>
              )}
              <button
                type="button"
                onClick={() => onRepos(current.repos)}
                className="inline-flex items-center gap-1.5 rounded-full border border-core-graphite px-5 py-2.5 text-sm font-medium text-core-ink transition-colors hover:border-core-mist"
              >
                <Github className="h-4 w-4" /> Source
              </button>
            </div>
          </div>

          {/* controls */}
          <div className="mt-8 flex items-center justify-between gap-4">
            <div className="flex flex-1 items-center gap-2" role="tablist" aria-label="Choose project">
              {projects.map((p, i) => (
                <button
                  key={p.id}
                  type="button"
                  role="tab"
                  aria-selected={i === index}
                  aria-label={`Show ${p.title}`}
                  onClick={() => go(i)}
                  className={`relative h-1 overflow-hidden rounded-full bg-white/10 transition-all duration-500 ${
                    i === index ? "w-14" : "w-6 hover:bg-white/25"
                  }`}
                >
                  {i === index && (
                    <span
                      className={`fc-progress-active absolute inset-0 origin-left bg-core-icy ${
                        autoplay ? "scale-x-0" : ""
                      }`}
                    />
                  )}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              {autoplay && (
                <button
                  type="button"
                  onClick={() => setUserPaused((v) => !v)}
                  aria-label={userPaused ? "Resume auto-play" : "Pause auto-play"}
                  className="rounded-full border border-white/10 p-2 text-core-mist transition-colors hover:border-white/25 hover:text-core-ink"
                >
                  {userPaused ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}
                </button>
              )}
              <button
                type="button"
                onClick={prev}
                aria-label="Previous project"
                className="rounded-full border border-white/10 p-2 text-core-ink transition-colors hover:border-white/25"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={next}
                aria-label="Next project"
                className="rounded-full border border-white/10 p-2 text-core-ink transition-colors hover:border-white/25"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
