import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { experiences } from "../constants/experiences";
import { ExperienceSlide } from "./experience/index";
import { RevealText } from "./motion";
import { useIsMobile, useReducedMotion } from "./hero/core/hooks";
import Container from "./common/Container";

gsap.registerPlugin(ScrollTrigger);

const years = experiences.map((e) => new Date(e.finished_date).getFullYear());
const SPAN = `${Math.min(...years)} – ${Math.max(...years)}`;
const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Experience as a horizontal timeline (newest → oldest, left → right).
 * Desktop pins the section and slides the track left with the scroll while
 * the rail fills and the role closest to center lights up. Mobile and
 * reduced motion get a plain vertical list.
 */
const Experience: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<ScrollTrigger | null>(null);
  const [active, setActiveIndex] = useState(0);
  const isMobile = useIsMobile();
  const reduced = useReducedMotion();
  const horizontal = !isMobile && !reduced;

  useEffect(() => {
    const ctx = gsap.context(() => {
      // fromTo (not from): explicit end values, so a CSS transition or a
      // StrictMode re-run can never be captured as the "to" state
      gsap.fromTo(
        ".exp-head > *",
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 75%", once: true },
        },
      );

      if (!horizontal) {
        const slides = gsap.utils.toArray<HTMLElement>(".exp-slide");
        if (reduced) {
          slides.forEach((s) => s.classList.add("is-active"));
          return;
        }
        // the rail draws itself down as you scroll through the roles
        gsap.fromTo(
          ".exp-vfill",
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: { trigger: trackRef.current, start: "top 60%", end: "bottom 60%", scrub: 0.6 },
          },
        );
        slides.forEach((s) => {
          // dot + year + card light up once the rail reaches them
          ScrollTrigger.create({ trigger: s, start: "top 60%", toggleClass: "is-active" , end: "max" });
          const yearEl = s.querySelector<HTMLElement>(".exp-year");
          const year = Number(yearEl?.textContent);
          const tl = gsap.timeline({ scrollTrigger: { trigger: s, start: "top 85%", once: true } });
          tl.fromTo(s.querySelector(".exp-card"), { x: 48, opacity: 0, rotate: 1.5 }, { x: 0, opacity: 1, rotate: 0, duration: 0.8, ease: "power3.out" });
          if (yearEl && year) {
            const n = { v: year - 6 };
            tl.fromTo(yearEl, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" }, 0).to(
              n,
              {
                v: year,
                duration: 0.9,
                ease: "power2.out",
                onUpdate: () => {
                  yearEl.textContent = String(Math.round(n.v));
                },
              },
              0,
            );
          }
        });
        return;
      }

      const track = trackRef.current!;
      const slides = gsap.utils.toArray<HTMLElement>(".exp-slide", track);
      const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);

      const setActive = (progress: number) => {
        const active = Math.round(progress * (slides.length - 1));
        slides.forEach((s, i) => s.classList.toggle("is-active", i === active));
        setActiveIndex(active);
      };
      setActive(0);

      const slide = gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 1,
          // settle on the nearest role when the user stops scrolling
          snap: { snapTo: 1 / (slides.length - 1), duration: { min: 0.2, max: 0.5 }, ease: "power1.inOut" },
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (fillRef.current) fillRef.current.style.transform = `scaleX(${self.progress})`;
            setActive(self.progress);
          },
        },
      });

      triggerRef.current = slide.scrollTrigger ?? null;

      // each role rises in as it slides into view from the right
      slides.forEach((s) => {
        gsap.fromTo(
          s.querySelector(".exp-card"),
          { y: 40, opacity: 0.2, rotate: 1.5 },
          {
            y: 0,
            opacity: 1,
            rotate: 0,
            ease: "none",
            scrollTrigger: { trigger: s, containerAnimation: slide, start: "left 95%", end: "left 60%", scrub: true },
          },
        );
      });
    }, sectionRef);
    ScrollTrigger.refresh();
    return () => {
      triggerRef.current = null;
      ctx.revert();
    };
  }, [horizontal, reduced]);

  const goTo = (i: number) => {
    const st = triggerRef.current;
    if (!st) return;
    const target = Math.min(Math.max(i, 0), experiences.length - 1);
    window.scrollTo({
      top: st.start + ((st.end - st.start) * target) / (experiences.length - 1),
      behavior: "smooth",
    });
  };

  return (
    // React-owned wrapper: the pin-spacer wraps <section>, so React removes this div
    <div>
      <section
        ref={sectionRef}
        aria-label="Experience"
        className={`relative overflow-hidden bg-core-obsidian ${
          horizontal ? "flex h-screen flex-col justify-center" : "py-24"
        }`}
      >
        <Container className="exp-head flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="font-mono text-[11px] tracking-[0.3em] text-core-icy">EXPERIENCE</p>
            <RevealText
              as="h2"
              className="mt-4 text-4xl font-semibold tracking-[-0.03em] text-core-ink md:text-6xl"
              text="Where I've worked"
            />
            <p className="mt-3 max-w-md text-base text-core-mist">
              Full-time work, an internship, part-time roles and the university events I built for.
            </p>
          </div>
          <dl className="flex gap-8 font-mono text-[10px] tracking-[0.2em] text-core-mist">
            <div>
              <dt>ROLES</dt>
              <dd className="mt-1 text-2xl tracking-tight text-core-ink">{experiences.length}</dd>
            </div>
            <div>
              <dt>YEARS</dt>
              <dd className="mt-1 text-2xl tracking-tight text-core-ink">{SPAN}</dd>
            </div>
          </dl>
        </Container>

        <div className={`relative mt-12 ${horizontal ? "" : "px-6"}`}>
          {/* the rail the dots sit on (desktop) */}
          {horizontal && (
            <div aria-hidden="true" className="absolute left-0 right-0 top-3 h-px bg-core-graphite">
              <div ref={fillRef} className="h-px origin-left scale-x-0 bg-gradient-to-r from-core-chrome to-core-icy" />
            </div>
          )}
          <div
            ref={trackRef}
            className={
              horizontal
                ? "exp-horizontal flex w-max gap-10 pl-[calc(max(0px,(100%_-_80rem)/2)_+_3rem)] pr-[calc(max(0px,(100%_-_80rem)/2)_+_3rem)]"
                : "exp-vertical relative mx-auto flex max-w-xl flex-col gap-12 pl-6"
            }
          >
            {!horizontal && (
              <div aria-hidden="true" className="absolute bottom-0 left-[6px] top-3 w-px bg-core-graphite">
                <div className="exp-vfill h-full w-px origin-top bg-gradient-to-b from-core-chrome to-core-icy" />
              </div>
            )}
            {experiences.map((e, i) => (
              <ExperienceSlide key={e.id} experience={e} index={i} />
            ))}
          </div>
        </div>

        {horizontal && (
          <Container className="mt-10 flex items-center gap-4 font-mono text-[11px] tracking-[0.2em] text-core-chrome">
            <span aria-live="polite">
              {pad(active + 1)} / {pad(experiences.length)}
            </span>
            <span className="text-core-mist">SCROLL OR USE THE ARROWS</span>
            <div className="ml-auto flex gap-2">
              <button
                type="button"
                onClick={() => goTo(active - 1)}
                disabled={active === 0}
                aria-label="Previous role"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-core-mist/50 text-core-ink transition-colors hover:border-core-ink disabled:opacity-40 disabled:hover:border-core-mist/50"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => goTo(active + 1)}
                disabled={active === experiences.length - 1}
                aria-label="Next role"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-core-mist/50 text-core-ink transition-colors hover:border-core-ink disabled:opacity-40 disabled:hover:border-core-mist/50"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </Container>
        )}
      </section>
    </div>
  );
};

export default Experience;
