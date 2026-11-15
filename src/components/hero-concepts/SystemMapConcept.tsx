import React, { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { COPY } from "./tokens";
import {
  STACK_LAYERS,
  STATS,
  aiProjects,
  fullstackProjects,
  latestExperiences,
} from "./data";
import { CtaButtons } from "./CtaButtons";
import { ConceptNav } from "./ConceptNav";
import {
  CoreCanvas,
  IntelligenceCore,
  createCoreState,
  useIsMobile,
  useReducedMotion,
} from "../hero/core";

gsap.registerPlugin(ScrollTrigger);

const STEP_COUNT = 3;
const AI_TECH = /gemini|machine learning|\bml\b|\bai\b|llm/i;
const TAU = Math.PI * 2;

interface StepPanel {
  key: string;
  title: string;
  lines: string[];
  list: { title: string; meta: string }[];
}

const cleanTitle = (t: string) => t.replace(/\s*\(.*\)$/, "");

const buildPanels = (): StepPanel[] => [
  {
    key: "fullstack",
    title: "Full-stack systems",
    lines: STACK_LAYERS.filter((l) => l.id !== "ai").map(
      (l) => `${l.label.padEnd(9, " ")} ${l.items.join(" · ")}`,
    ),
    list: fullstackProjects(3).map((p) => ({ title: cleanTitle(p.title), meta: p.finished_date.slice(0, 4) })),
  },
  {
    key: "ai",
    title: "AI / ML",
    lines: [`AI CORE   ${STACK_LAYERS.find((l) => l.id === "ai")!.items.join(" · ")}`],
    list: aiProjects()
      .slice(0, 3)
      .map((p) => ({ title: cleanTitle(p.title), meta: p.tech.find((t) => AI_TECH.test(t)) ?? p.role })),
  },
  {
    key: "profile",
    title: "Profile",
    lines: ["ROLE      Full-stack × AI Developer", "BASE      Bangkok, Thailand"],
    list: latestExperiences(3).map((e) => ({ title: `${e.role} · ${e.company}`, meta: e.period })),
  },
];

const NODES = [
  { label: "Fullstack", pos: "md:left-[14%] md:top-[34%]" },
  { label: "AI / ML", pos: "md:right-[24%] md:top-[24%]" },
  { label: "Profile", pos: "md:left-[18%] md:bottom-[24%]" },
];

const Stat: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
  <div className="border-l border-[#222B39] pl-4">
    <p className="font-mono text-[10px] tracking-[0.2em] text-[#929EAF]">{label}</p>
    <p className="mt-1 text-2xl font-medium tracking-tight text-[#F4F6FA]">{value}</p>
  </div>
);

export const SystemMapConcept: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<ScrollTrigger | null>(null);
  const state = useMemo(() => createCoreState(), []);
  const panels = useMemo(() => buildPanels(), []);
  const [step, setStep] = useState(0);
  const isMobile = useIsMobile();
  const reduced = useReducedMotion();

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (reduced) {
        state.explode = 0.4;
        gsap.set(".sm-panel", { opacity: 1, position: "relative", y: 0 });
        return;
      }

      gsap.set(".sm-panel", { opacity: 0, y: 16 });
      gsap.set(".sm-panel-0", { opacity: 1, y: 0 });
      gsap.from(".sm-intro > *", { y: 20, opacity: 0, duration: 0.8, stagger: 0.06, ease: "power3.out" });

      const tl = gsap.timeline({
        defaults: { ease: "power2.inOut" },
        scrollTrigger: {
          trigger: isMobile ? stageRef.current : sectionRef.current,
          start: "top top",
          end: "+=300%",
          pin: true,
          scrub: 1,
          snap: { snapTo: [0, 0.5, 1], duration: 0.5, ease: "power2.inOut" },
          onUpdate: (self) => {
            state.progress = self.progress;
            const next = Math.min(STEP_COUNT - 1, Math.round(self.progress * (STEP_COUNT - 1)));
            setStep((prev) => (prev === next ? prev : next));
          },
        },
      });
      triggerRef.current = tl.scrollTrigger ?? null;

      state.explode = 0.5;
      tl.to(state, { rotateY: TAU / 3, explode: 0, duration: 0.5 }, 0)
        .to(".sm-panel-0", { opacity: 0, y: -16, duration: 0.15 }, 0.15)
        .to(".sm-panel-1", { opacity: 1, y: 0, duration: 0.15 }, 0.3)
        .to(state, { rotateY: (TAU * 2) / 3, explode: 0.25, duration: 0.5 }, 0.5)
        .to(".sm-panel-1", { opacity: 0, y: -16, duration: 0.15 }, 0.65)
        .to(".sm-panel-2", { opacity: 1, y: 0, duration: 0.15 }, 0.8);
    }, sectionRef);

    return () => {
      triggerRef.current = null;
      ctx.revert();
    };
  }, [isMobile, reduced, state]);

  const goToStep = (i: number) => {
    const st = triggerRef.current;
    if (!st) return;
    const top = st.start + ((st.end - st.start) * i) / (STEP_COUNT - 1);
    window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    // Wrapper owned by React: GSAP's pin-spacer wraps the <section>, so React
    // must remove this div (not the section) on unmount.
    <div>
      <section ref={sectionRef} className="relative overflow-hidden md:h-screen">
        {/* faint engineering grid */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              "linear-gradient(#222B39 1px, transparent 1px), linear-gradient(90deg, #222B39 1px, transparent 1px)",
            backgroundSize: "64px 64px",
            maskImage: "radial-gradient(ellipse at 60% 50%, black 20%, transparent 75%)",
            WebkitMaskImage: "radial-gradient(ellipse at 60% 50%, black 20%, transparent 75%)",
          }}
        />

        <div className="relative z-30 px-6 pt-6 md:absolute md:inset-x-0 md:top-0 md:px-12">
          <ConceptNav />
        </div>

        {/* intro: text + stats */}
        <div className="sm-intro relative z-20 px-6 pt-14 md:absolute md:left-12 md:top-[16%] md:max-w-[38rem] md:px-0 md:pt-0">
          <p className="font-mono text-[11px] tracking-[0.25em] text-[#929EAF]">
            13.75°N 100.50°E · BANGKOK
          </p>
          <p className="mt-6 font-mono text-[11px] tracking-[0.3em] text-[#8ABFFF]">{COPY.eyebrow}</p>
          <h1 className="mt-4 text-[clamp(40px,5vw,84px)] font-semibold leading-[1] tracking-[-0.035em] text-[#F4F6FA]">
            {COPY.title}
          </h1>
          <p className="mt-5 max-w-[36ch] text-base leading-relaxed text-[#929EAF]">{COPY.sub}</p>
          <CtaButtons className="mt-8" />
          <div className="mt-12 grid grid-cols-2 gap-6 md:grid-cols-4">
            <Stat label="PROJECTS" value={STATS.projects} />
            <Stat label="BUILDING SINCE" value={STATS.since} />
            <Stat label="TECH USED" value={STATS.techCount} />
            <Stat label="AI PROJECTS" value={STATS.aiProjects} />
          </div>
        </div>

        {/* stage: core + nodes + step panel */}
        <div ref={stageRef} className="relative h-screen md:pointer-events-none md:absolute md:inset-0">
          <CoreCanvas
            state={state}
            className="absolute inset-x-0 top-0 h-[58%] md:inset-y-0 md:left-auto md:right-[-8%] md:h-full md:w-[62%]"
          >
            <IntelligenceCore state={state} scale={isMobile ? 0.62 : 0.55} />
          </CoreCanvas>

          <div className="absolute right-0 top-0 h-[58%] w-full md:inset-y-0 md:right-[-8%] md:h-full md:w-[62%]">
            {NODES.map((n, i) => (
              <button
                key={n.label}
                type="button"
                onClick={() => goToStep(i)}
                className={`pointer-events-auto absolute hidden items-center gap-2 font-mono text-[11px] tracking-[0.2em] transition-colors md:flex ${n.pos} ${
                  step === i ? "text-[#8ABFFF]" : "text-[#929EAF] hover:text-[#F4F6FA]"
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${step === i ? "bg-[#8ABFFF]" : "bg-[#929EAF]/60"}`}
                />
                {n.label.toUpperCase()}
              </button>
            ))}
          </div>

          <div className="absolute inset-x-6 bottom-28 md:inset-x-auto md:bottom-12 md:right-12 md:w-[22rem]">
            <div className="mb-4 flex items-center justify-between font-mono text-[11px] tracking-[0.2em] text-[#929EAF]">
              <span>
                {String(step + 1).padStart(2, "0")} / {String(STEP_COUNT).padStart(2, "0")}
              </span>
              <span className="flex gap-1.5 md:hidden">
                {NODES.map((n, i) => (
                  <button
                    key={n.label}
                    type="button"
                    aria-label={`Go to ${n.label}`}
                    onClick={() => goToStep(i)}
                    className={`h-1.5 w-5 rounded-full ${step === i ? "bg-[#8ABFFF]" : "bg-[#222B39]"}`}
                  />
                ))}
              </span>
            </div>
            <div className="relative min-h-[13rem]">
              {panels.map((p, i) => (
                <article
                  key={p.key}
                  className={`sm-panel sm-panel-${i} absolute inset-0 rounded-2xl border border-white/10 bg-[#080B12]/60 p-5 backdrop-blur-md`}
                >
                  <h2 className="text-lg font-medium text-[#F4F6FA]">{p.title}</h2>
                  <div className="mt-3 space-y-1">
                    {p.lines.map((line) => (
                      <p key={line} className="whitespace-pre font-mono text-[11px] text-[#C9D1DB]">
                        {line}
                      </p>
                    ))}
                  </div>
                  <ul className="mt-4 space-y-2 border-t border-[#222B39] pt-3">
                    {p.list.map((item) => (
                      <li key={item.title} className="flex items-baseline justify-between gap-4 text-sm">
                        <span className="truncate text-[#F4F6FA]">{item.title}</span>
                        <span className="shrink-0 font-mono text-[10px] text-[#929EAF]">{item.meta}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
