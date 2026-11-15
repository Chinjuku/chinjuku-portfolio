import React, { Suspense, lazy, useEffect, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { HERO_COPY, HERO_STACK_LAYERS } from "../constants/hero";
import { HeroCtas, HeroLayerLabel } from "./hero/index";
// import from the files directly: the core barrel re-exports the three.js
// components, which must stay in the lazy HeroCoreScene chunk
import { createCoreState } from "./hero/core/scrollState";
import { useIsMobile, useReducedMotion } from "./hero/core/hooks";

gsap.registerPlugin(ScrollTrigger);

const HeroCoreScene = lazy(() => import("./hero/HeroCoreScene"));

/**
 * "The Intelligence Core" hero (Editorial layout).
 * Scrolling pins the hero and explodes the Core into its layers:
 * chrome rings = full-stack (frontend / backend / data), glass core = AI.
 * The hero is always dark, independent of the site theme toggle.
 */
const Hero: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const state = useMemo(() => createCoreState(), []);
  const isMobile = useIsMobile();
  const reduced = useReducedMotion();

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (reduced) {
        state.explode = 1;
        gsap.set([".hero-layer-label", ".hero-explore"], { opacity: 1, y: 0 });
        return;
      }

      gsap.set([".hero-layer-label", ".hero-explore"], { opacity: 0, y: 12 });
      gsap.from(".hero-intro > *", {
        y: 24,
        opacity: 0,
        duration: 0.9,
        stagger: 0.08,
        ease: "power3.out",
        delay: 0.15,
      });

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          // mobile pins only the Core stage so the pinned area fits one screen
          trigger: isMobile ? stageRef.current : sectionRef.current,
          start: "top top",
          end: "+=250%",
          pin: true,
          scrub: 1,
          // this pin sits above every other section's triggers; measure it first
          refreshPriority: 1,
          onUpdate: (self) => {
            state.progress = self.progress;
          },
        },
      });

      tl.to(state, { explode: 1, rotateY: 0.5, duration: 0.4, ease: "power2.inOut" }, 0)
        .to(".hero-intro", { opacity: 0.55, duration: 0.3 }, 0.1)
        .to(".hero-layer-label", { opacity: 1, y: 0, stagger: 0.06, duration: 0.15 }, 0.4)
        .to(".hero-layer-label", { opacity: 0, y: -8, stagger: 0.03, duration: 0.1 }, 0.75)
        .to(state, { explode: 0, rotateY: 0, duration: 0.2, ease: "power2.inOut" }, 0.78)
        .to(".hero-intro", { opacity: 1, duration: 0.15 }, 0.8)
        .to(".hero-explore", { opacity: 1, y: 0, duration: 0.12 }, 0.88);
    }, sectionRef);

    // When this effect re-runs (mobile/desktop breakpoint), the new pin is
    // created after the lower sections' triggers; re-sort and re-measure them.
    ScrollTrigger.sort();
    ScrollTrigger.refresh();

    return () => ctx.revert();
  }, [isMobile, reduced, state]);

  return (
    // React-owned wrapper: GSAP's pin-spacer wraps the <section>, so React must
    // remove this div (not the section) on unmount.
    <div>
      <section
        ref={sectionRef}
        aria-label="Introduction"
        className="relative flex flex-col overflow-hidden bg-core-obsidian px-6 pt-24 text-core-ink md:h-screen md:px-12 md:pb-10"
      >
        <div className="grid flex-1 grid-cols-1 items-center gap-6 md:grid-cols-12 md:gap-8">
          <div className="hero-intro md:col-span-5">
            <p className="font-mono text-[11px] tracking-[0.3em] text-core-icy">
              {HERO_COPY.eyebrow}
            </p>
            <h1 className="mt-6 text-[clamp(44px,6vw,104px)] font-semibold leading-[0.98] tracking-[-0.035em] text-core-ink">
              {HERO_COPY.title}
            </h1>
            <p className="mt-6 max-w-[34ch] text-base leading-relaxed text-core-mist md:text-lg">
              {HERO_COPY.sub}
            </p>
            <HeroCtas className="mt-10" />
          </div>

          <div
            ref={stageRef}
            className="flex h-[100svh] flex-col justify-center gap-6 pb-10 md:contents"
          >
            <div className="relative h-[52svh] md:col-span-7 md:h-[80vh]">
              <Suspense
                fallback={
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(138,191,255,0.12),transparent_45%)]" />
                }
              >
                <HeroCoreScene
                  state={state}
                  scale={isMobile ? 0.8 : 0.62}
                  className="absolute inset-0"
                />
              </Suspense>
              {!isMobile &&
                HERO_STACK_LAYERS.map((l) => <HeroLayerLabel key={l.id} id={l.id} floating />)}
              <Link
                to={HERO_COPY.ctaProjects.href}
                className="hero-explore absolute bottom-0 left-1/2 -translate-x-1/2 whitespace-nowrap text-sm text-core-chrome underline-offset-8 hover:underline"
              >
                {HERO_COPY.explore}
              </Link>
            </div>

            {isMobile && (
              <div className="grid grid-cols-2 gap-x-6 gap-y-5">
                {HERO_STACK_LAYERS.map((l) => (
                  <HeroLayerLabel key={l.id} id={l.id} floating={false} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* soft hand-off from the obsidian hero into the site's current theme */}
      <div
        aria-hidden="true"
        className="h-32 bg-gradient-to-b from-core-obsidian to-space-white dark:to-space-dark"
      />
    </div>
  );
};

export default Hero;
