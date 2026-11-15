import React, { useCallback, useEffect, useLayoutEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import {
  ConceptSwitcher,
  EditorialConcept,
  ImmersiveConcept,
  SystemMapConcept,
  type ConceptId,
} from "../components/hero-concepts";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

const parseConcept = (value: string | null): ConceptId =>
  value === "2" ? 2 : value === "3" ? 3 : 1;

const HeroConcepts: React.FC = () => {
  const [params, setParams] = useSearchParams();
  const active = parseConcept(params.get("c"));
  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const smootherRef = useRef<ScrollSmoother | null>(null);

  // Layout effect: runs before the concepts' passive effects create their
  // ScrollTriggers, so pins are measured against the smoothed scroller.
  useLayoutEffect(() => {
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (coarse || reduced) return;

    const smoother = ScrollSmoother.create({
      wrapper: wrapperRef.current!,
      content: contentRef.current!,
      smooth: 1.1,
      effects: false,
    });
    smootherRef.current = smoother;
    return () => {
      smoother.kill();
      smootherRef.current = null;
      // kill() leaves an inline scroll-behavior on <body>; restore the page as it was
      document.body.style.removeProperty("scroll-behavior");
    };
  }, []);

  // Parent passive effects run after the concept's, so its pins exist now:
  // re-measure so the smoother's body height includes the pin spacers.
  useEffect(() => {
    // setTimeout (not rAF): rAF is paused in background tabs, which left the
    // pin with no duration until the tab became visible.
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 0);
    return () => window.clearTimeout(id);
  }, [active]);

  const handleChange = useCallback(
    (id: ConceptId) => {
      smootherRef.current?.scrollTop(0);
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      setParams({ c: String(id) });
    },
    [setParams],
  );

  return (
    <div className="relative min-h-screen bg-[#080B12] text-[#F4F6FA] antialiased">
      {/* fixed UI must stay outside the transformed smooth-content */}
      <ConceptSwitcher active={active} onChange={handleChange} />
      <div ref={wrapperRef}>
        <div ref={contentRef}>
          {/* key forces a full remount so each concept's GSAP context and canvas clean up */}
          {active === 1 && <EditorialConcept key="c1" />}
          {active === 2 && <ImmersiveConcept key="c2" />}
          {active === 3 && <SystemMapConcept key="c3" />}
        </div>
      </div>
    </div>
  );
};

export default HeroConcepts;
