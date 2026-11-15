import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { experiences } from "../constants/experiences";
import { ExperienceSlide } from "./experience/index";
import { RevealText } from "./motion";
import { useIsMobile, useReducedMotion } from "./hero/core/hooks";

gsap.registerPlugin(ScrollTrigger);

const years = experiences.map((e) => new Date(e.finished_date).getFullYear());
const SPAN = `${Math.min(...years)} – ${Math.max(...years)}`;

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
  const counterRef = useRef<HTMLSpanElement>(null);
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
        gsap.fromTo(
          ".exp-slide",
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: { trigger: trackRef.current, start: "top 85%", once: true },
          },
        );
        return;
      }

      const track = trackRef.current!;
      const slides = gsap.utils.toArray<HTMLElement>(".exp-slide", track);
      const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);

      const setActive = (progress: number) => {
        const active = Math.round(progress * (slides.length - 1));
        slides.forEach((s, i) => s.classList.toggle("is-active", i === active));
        if (counterRef.current) {
          counterRef.current.textContent = `${String(active + 1).padStart(2, "0")} / ${String(slides.length).padStart(2, "0")}`;
        }
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
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (fillRef.current) fillRef.current.style.transform = `scaleX(${self.progress})`;
            setActive(self.progress);
          },
        },
      });

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
    return () => ctx.revert();
  }, [horizontal]);

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
        <div className="exp-head mx-auto flex w-full max-w-6xl flex-wrap items-end justify-between gap-6 px-6 md:px-12">
          <div>
            <p className="font-mono text-[11px] tracking-[0.3em] text-core-icy">EXPERIENCE</p>
            <RevealText
              as="h2"
              className="mt-4 text-4xl font-semibold tracking-[-0.03em] text-core-ink md:text-6xl"
              text="Where I've worked"
              accentWords={["worked"]}
            />
            <p className="mt-3 max-w-md text-base text-core-mist">
              Internships, part-time roles and the university events I built for.
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
        </div>

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
                ? "exp-horizontal flex w-max gap-10 pl-[max(3rem,calc((100vw-72rem)/2+3rem))] pr-[20vw]"
                : "exp-vertical mx-auto flex max-w-xl flex-col gap-12"
            }
          >
            {experiences.map((e, i) => (
              <ExperienceSlide key={e.id} experience={e} index={i} />
            ))}
          </div>
        </div>

        {horizontal && (
          <div className="mx-auto mt-10 flex w-full max-w-6xl items-center gap-4 px-6 font-mono text-[11px] tracking-[0.2em] text-core-mist md:px-12">
            <span ref={counterRef}>01 / {String(experiences.length).padStart(2, "0")}</span>
            <span className="text-core-mist/60">SCROLL →</span>
          </div>
        )}
      </section>
    </div>
  );
};

export default Experience;
