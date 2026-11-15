import React, { Suspense, lazy, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { HERO_COPY, HERO_STACK_LAYERS, type HeroLayerId } from "../constants/hero";
import { HeroCtas, HeroLayerLabel, HeroLayerPanel } from "./hero/index";
// import from the files directly: the core barrel re-exports the three.js
// components, which must stay in the lazy HeroCoreScene chunk
import { createCoreState } from "./hero/core/scrollState";
import { useIsMobile, useReducedMotion } from "./hero/core/hooks";

gsap.registerPlugin(ScrollTrigger);

const HeroCoreScene = lazy(() => import("./hero/HeroCoreScene"));

// Pinned scroll bands (as timeline progress 0..1) for the layer walkthrough.
const SCROLL_STEPS: HeroLayerId[] = ["frontend", "backend", "data", "ai"];
const STEP_START = 0.14;
const STEP_END = 0.86;
const STEP_SIZE = (STEP_END - STEP_START) / SCROLL_STEPS.length;
const SNAP_POINTS = [0, ...SCROLL_STEPS.map((_, i) => STEP_START + STEP_SIZE * (i + 0.5)), 1];

/**
 * "The Intelligence Core" hero (Editorial layout).
 * - Scroll pins the hero and explodes the Core into its layers:
 *   chrome rings = full-stack (frontend / backend / data), glass core = AI.
 * - Click a layer (in 3D or its label) to fly in: the layer opens to reveal
 *   its own inner object and a panel with the stack and related projects.
 */
const Hero: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const state = useMemo(() => createCoreState(), []);
  const isMobile = useIsMobile();
  const reduced = useReducedMotion();
  const [activeLayer, setActiveLayer] = useState<HeroLayerId | null>(null);

  const close = useCallback(() => setActiveLayer(null), []);
  const select = useCallback((id: HeroLayerId) => setActiveLayer(id), []);
  const toggle = useCallback(
    (id: HeroLayerId) => setActiveLayer((cur) => (cur === id ? null : id)),
    [],
  );

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (reduced) {
        state.explode = 1;
        gsap.set([".hero-layer-label", ".hero-explore"], { autoAlpha: 1, y: 0 });
        return;
      }

      // autoAlpha (not opacity) so hidden labels are not clickable
      gsap.set([".hero-layer-label", ".hero-explore"], { autoAlpha: 0, y: 12 });
      gsap.from(".hero-intro > *", {
        y: 24,
        opacity: 0,
        duration: 0.9,
        stagger: 0.08,
        ease: "power3.out",
        delay: 0.15,
      });

      // Scroll story: explode → open each layer in turn → reassemble.
      // Each layer owns a band of the pinned scroll; entering a band opens
      // that layer (clicks still work and win until the next band starts).
      const stepAt = (p: number): HeroLayerId | null | undefined => {
        if (p < STEP_START) return undefined; // overview: leave clicks alone
        if (p >= STEP_END) return null;
        const i = Math.min(SCROLL_STEPS.length - 1, Math.floor((p - STEP_START) / STEP_SIZE));
        return SCROLL_STEPS[i];
      };
      let lastStep: HeroLayerId | null | undefined = undefined;

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          // mobile pins only the Core stage so the pinned area fits one screen
          trigger: isMobile ? stageRef.current : sectionRef.current,
          start: "top top",
          end: "+=480%",
          pin: true,
          scrub: 1,
          snap: {
            snapTo: SNAP_POINTS,
            inertia: false, // snap from where the user stopped, not a velocity guess
            duration: { min: 0.25, max: 0.6 },
            delay: 0.08,
            ease: "power2.inOut",
          },
          // this pin sits above every other section's triggers; measure it first
          refreshPriority: 1,
          onUpdate: (self) => {
            state.progress = self.progress;
            const step = stepAt(self.progress);
            if (step !== lastStep) {
              if (step !== undefined || lastStep !== undefined) setActiveLayer(step ?? null);
              lastStep = step;
            }
          },
          // leaving the hero (either direction) closes any opened layer
          onLeave: () => setActiveLayer(null),
          onLeaveBack: () => {
            lastStep = undefined;
            setActiveLayer(null);
          },
        },
      });

      tl.to(state, { explode: 1, rotateY: 0.5, duration: 0.12, ease: "power2.inOut" }, 0)
        .to(".hero-intro", { opacity: 0.55, duration: 0.1 }, 0.04)
        .to(".hero-layer-label", { autoAlpha: 1, y: 0, stagger: 0.015, duration: 0.05 }, 0.06)
        .to(".hero-layer-label", { autoAlpha: 0, y: -8, duration: 0.04 }, STEP_END)
        .to(state, { explode: 0, rotateY: 0, duration: 0.08, ease: "power2.inOut" }, STEP_END + 0.01)
        .to(".hero-intro", { opacity: 1, duration: 0.06 }, STEP_END + 0.03)
        .to(".hero-explore", { autoAlpha: 1, y: 0, duration: 0.05 }, 0.94);
    }, sectionRef);

    // When this effect re-runs (mobile/desktop breakpoint), the new pin is
    // created after the lower sections' triggers; re-sort and re-measure them.
    ScrollTrigger.sort();
    ScrollTrigger.refresh();

    return () => ctx.revert();
  }, [isMobile, reduced, state]);

  const isOpen = activeLayer !== null;

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
          <div
            className={`hero-intro transition-[filter] duration-500 md:col-span-5 ${
              isOpen ? "md:blur-[2px]" : ""
            }`}
          >
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
                  // desktop canvas bleeds 12% past its box so the fly-in isn't
                  // clipped; 0.5 at 1.24× height keeps the Core's on-screen size
                  scale={isMobile ? 0.8 : 0.5}
                  offsetX={isMobile ? 0 : 0.55}
                  activeLayer={activeLayer}
                  onSelectLayer={toggle}
                  onClose={close}
                  className={
                    isMobile
                      ? "absolute inset-0"
                      : "absolute -inset-[12%] [mask-image:radial-gradient(closest-side,black_75%,transparent)]"
                  }
                />
              </Suspense>

              {!isMobile && (
                <div
                  className={`transition-opacity duration-300 ${
                    isOpen ? "pointer-events-none opacity-0" : "opacity-100"
                  }`}
                >
                  {HERO_STACK_LAYERS.map((l) => (
                    <HeroLayerLabel key={l.id} id={l.id} floating onSelect={select} />
                  ))}
                </div>
              )}

              {!isMobile && isOpen && (
                <HeroLayerPanel
                  id={activeLayer}
                  onClose={close}
                  onSelect={select}
                  className="absolute right-0 top-1/2 w-80 -translate-y-1/2"
                />
              )}

              <p
                className={`pointer-events-none absolute bottom-0 left-0 font-mono text-[10px] tracking-[0.2em] text-core-mist transition-opacity duration-300 md:bottom-2 ${
                  isOpen ? "opacity-0" : "opacity-100"
                }`}
              >
                {isMobile ? "SCROLL OR TAP THE CORE TO LOOK INSIDE" : "SCROLL OR CLICK A LAYER TO LOOK INSIDE"}
              </p>

              <Link
                to={HERO_COPY.ctaProjects.href}
                className="hero-explore absolute bottom-0 left-1/2 -translate-x-1/2 whitespace-nowrap text-sm text-core-chrome underline-offset-8 hover:underline"
              >
                {HERO_COPY.explore}
              </Link>
            </div>

            {isMobile &&
              (isOpen ? (
                <HeroLayerPanel
                  id={activeLayer}
                  onClose={close}
                  onSelect={select}
                  className="max-h-[38svh] overflow-y-auto"
                />
              ) : (
                <div className="grid grid-cols-2 gap-x-6 gap-y-5">
                  {HERO_STACK_LAYERS.map((l) => (
                    <HeroLayerLabel key={l.id} id={l.id} floating={false} onSelect={select} />
                  ))}
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* soft hand-off from the obsidian hero into the next section */}
      <div
        aria-hidden="true"
        className="h-32 bg-gradient-to-b from-core-obsidian to-space-white dark:to-space-dark"
      />
    </div>
  );
};

export default Hero;
