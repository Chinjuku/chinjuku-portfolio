import React, { useEffect, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { COPY } from "./tokens";
import { STACK_LAYERS, type LayerId } from "./data";
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

// Label anchor positions (percent of the canvas box) matched to the exploded
// layer positions of IntelligenceCore at scale 0.62, camera z=6 / fov 35.
const LABEL_POS: Record<LayerId, { top: string; side: "left" | "right" }> = {
  frontend: { top: "28%", side: "left" },
  backend: { top: "50%", side: "left" },
  ai: { top: "50%", side: "right" },
  data: { top: "72%", side: "right" },
};

const LayerLabel: React.FC<{ id: LayerId; floating: boolean }> = ({ id, floating }) => {
  const layer = STACK_LAYERS.find((l) => l.id === id)!;
  const pos = LABEL_POS[id];
  const isAi = id === "ai";
  const content = (
    <>
      <span className={`font-mono text-[11px] tracking-[0.2em] ${isAi ? "text-[#8ABFFF]" : "text-[#C9D1DB]"}`}>
        {layer.label}
      </span>
      <span className="mt-1 block text-xs text-[#929EAF]">{layer.items.join(" · ")}</span>
    </>
  );

  if (!floating) {
    return <div className="ed-label border-t border-[#222B39] pt-3">{content}</div>;
  }

  return (
    <div
      className={`ed-label pointer-events-none absolute flex w-52 -translate-y-1/2 items-start gap-3 ${
        pos.side === "left" ? "left-0 flex-row-reverse text-right" : "right-0"
      }`}
      style={{ top: pos.top }}
    >
      <span className="mt-[7px] h-px w-10 shrink-0 bg-[#929EAF]/50" />
      <div>{content}</div>
    </div>
  );
};

export const EditorialConcept: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const state = useMemo(() => createCoreState(), []);
  const isMobile = useIsMobile();
  const reduced = useReducedMotion();

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (reduced) {
        state.explode = 1;
        gsap.set([".ed-label", ".ed-explore"], { opacity: 1, x: 0, y: 0 });
        return;
      }

      gsap.set(".ed-label", { opacity: 0, y: 12 });
      gsap.set(".ed-explore", { opacity: 0, y: 12 });
      gsap.from(".ed-intro > *", { y: 24, opacity: 0, duration: 0.9, stagger: 0.08, ease: "power3.out" });

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: isMobile ? stageRef.current : sectionRef.current,
          start: "top top",
          end: "+=250%",
          pin: true,
          scrub: 1,
          onUpdate: (self) => {
            state.progress = self.progress;
          },
        },
      });

      tl.to(state, { explode: 1, rotateY: 0.5, duration: 0.4, ease: "power2.inOut" }, 0)
        .to(".ed-intro", { opacity: 0.55, duration: 0.3 }, 0.1)
        .to(".ed-label", { opacity: 1, y: 0, stagger: 0.06, duration: 0.15 }, 0.4)
        .to({}, { duration: 0.1 })
        .to(".ed-label", { opacity: 0, y: -8, stagger: 0.03, duration: 0.1 }, 0.75)
        .to(state, { explode: 0, rotateY: 0, duration: 0.2, ease: "power2.inOut" }, 0.78)
        .to(".ed-intro", { opacity: 1, duration: 0.15 }, 0.8)
        .to(".ed-explore", { opacity: 1, y: 0, duration: 0.12 }, 0.88);
    }, sectionRef);

    return () => ctx.revert();
  }, [isMobile, reduced, state]);

  return (
    // Wrapper owned by React: GSAP's pin-spacer wraps the <section>, so React
    // must remove this div (not the section) on unmount.
    <div>
      <section
        ref={sectionRef}
        className="relative flex flex-col overflow-hidden px-6 pt-6 md:h-screen md:px-12 md:pb-10"
      >
        <ConceptNav />

        <div className="grid flex-1 grid-cols-1 items-center gap-6 pt-10 md:grid-cols-12 md:gap-8 md:pt-0">
          <div className="ed-intro md:col-span-5">
            <p className="font-mono text-[11px] tracking-[0.3em] text-[#8ABFFF]">{COPY.eyebrow}</p>
            <h1 className="mt-6 text-[clamp(44px,6vw,104px)] font-semibold leading-[0.98] tracking-[-0.035em] text-[#F4F6FA]">
              {COPY.title}
            </h1>
            <p className="mt-6 max-w-[34ch] text-base leading-relaxed text-[#929EAF] md:text-lg">{COPY.sub}</p>
            <CtaButtons className="mt-10" />
          </div>

          {/* stage: on mobile only this part is pinned, so it must fit one screen */}
          <div
            ref={stageRef}
            className="flex h-[100svh] flex-col justify-center gap-6 pb-24 md:contents"
          >
          <div className="relative h-[52svh] md:col-span-7 md:h-[80vh]">
            <CoreCanvas state={state} className="absolute inset-0">
              <IntelligenceCore state={state} scale={isMobile ? 0.8 : 0.62} />
            </CoreCanvas>
            {!isMobile &&
              STACK_LAYERS.map((l) => <LayerLabel key={l.id} id={l.id} floating />)}
            <Link
              to="/projects"
              className="ed-explore absolute bottom-0 left-1/2 -translate-x-1/2 whitespace-nowrap text-sm text-[#C9D1DB] underline-offset-8 hover:underline"
            >
              Explore the work →
            </Link>
          </div>

          {isMobile && (
            <div className="grid grid-cols-2 gap-x-6 gap-y-5">
              {STACK_LAYERS.map((l) => (
                <LayerLabel key={l.id} id={l.id} floating={false} />
              ))}
            </div>
          )}
          </div>
        </div>
      </section>
    </div>
  );
};
