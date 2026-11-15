import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useFrame } from "@react-three/fiber";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";
import { RepoModal } from "../common/RepoModal";
import { COPY } from "./tokens";
import { openProject, recentProjects } from "./data";
import { CtaButtons } from "./CtaButtons";
import { ConceptNav } from "./ConceptNav";
import { ProjectOrbit } from "./ProjectOrbit";
import {
  CoreCanvas,
  IntelligenceCore,
  createCoreState,
  useIsMobile,
  useReducedMotion,
  type CoreState,
} from "../hero/core";

gsap.registerPlugin(ScrollTrigger);

const CAMERA_FROM = 7;
const CAMERA_TO = 4.6;

/** Dollies the camera toward the core as focus increases, with pointer parallax. */
const CameraRig: React.FC<{ state: CoreState }> = ({ state }) => {
  const lookAt = useMemo(() => new THREE.Vector3(), []);
  useFrame(({ camera }, dt) => {
    const z = THREE.MathUtils.lerp(CAMERA_FROM, CAMERA_TO, state.focus);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, z, 4, dt);
    camera.position.x = THREE.MathUtils.damp(camera.position.x, state.pointerX * 0.35, 2, dt);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, -state.pointerY * 0.25, 2, dt);
    camera.lookAt(lookAt);
  });
  return null;
};

export const ImmersiveConcept: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const state = useMemo(() => createCoreState(), []);
  const isMobile = useIsMobile();
  const reduced = useReducedMotion();
  const [modalRepos, setModalRepos] = useState<string[] | null>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const labelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const projects = useMemo(() => recentProjects(isMobile ? 4 : 6), [isMobile]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (reduced) {
        // static outside view; projects are listed as plain content below
        gsap.set(".im-hint", { opacity: 0 });
        return;
      }

      gsap.set(".im-hint", { opacity: 0 });
      gsap.from(".im-line", { yPercent: 40, opacity: 0, duration: 1.1, stagger: 0.12, ease: "power3.out" });

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=300%",
          pin: true,
          scrub: 1,
          onUpdate: (self) => {
            state.progress = self.progress;
          },
        },
      });

      tl.to(state, { focus: 1, explode: 0.6, duration: 0.55, ease: "power2.inOut" }, 0)
        .to(".im-line-back", { scale: 1.15, opacity: 0, duration: 0.4 }, 0.1)
        .to(".im-line-front", { yPercent: -60, opacity: 0, duration: 0.35 }, 0.2)
        .to(".im-sub", { opacity: 0, y: 20, duration: 0.2 }, 0.35)
        .to(".im-hint", { opacity: 1, duration: 0.1 }, 0.65)
        .to({}, { duration: 0.25 });
    }, sectionRef);

    return () => ctx.revert();
  }, [reduced, state]);

  return (
    // Wrapper owned by React: GSAP's pin-spacer wraps the <section>, so React
    // must remove this div (not the section) on unmount.
    <div>
      <section ref={sectionRef} className="relative h-screen overflow-hidden">
        {/* soft atmospheric falloff, deliberately restrained */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(138,191,255,0.08),transparent_60%)]" />

        {/* headline line behind the core */}
        <div className="im-headline im-line-back pointer-events-none absolute inset-x-0 top-[18%] z-0 text-center md:top-[14%]">
          <p className="im-line font-mono text-[11px] tracking-[0.3em] text-[#8ABFFF]">{COPY.eyebrow}</p>
          <p className="im-line mt-4 text-[clamp(40px,8.5vw,148px)] font-semibold leading-none tracking-[-0.04em] text-[#C9D1DB]/30">
            Building ideas into
          </p>
        </div>

        <CoreCanvas
          state={state}
          camera={{ position: [0, 0, CAMERA_FROM], fov: 35 }}
          className="absolute inset-0 z-10"
        >
          <CameraRig state={state} />
          <IntelligenceCore state={state} scale={isMobile ? 0.52 : 1} />
          <ProjectOrbit
            projects={projects}
            state={state}
            radius={isMobile ? 1.25 : 2.2}
            cardScale={isMobile ? 0.55 : 0.8}
            labelRefs={labelRefs}
            onHover={setHovered}
            onSelect={(p) => openProject(p, setModalRepos)}
          />
        </CoreCanvas>

        {/* project labels: plain DOM, positioned each frame by ProjectOrbit */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
          {projects.map((p, i) => (
            <div
              key={p.id}
              ref={(el) => {
                labelRefs.current[i] = el;
              }}
              className="absolute left-0 top-0 w-44 text-center opacity-0 will-change-transform"
            >
              <p className="font-mono text-[10px] tracking-[0.2em] text-[#8ABFFF]">
                {String(i + 1).padStart(2, "0")} · {p.finished_date.slice(0, 4)}
              </p>
              <p className="mt-1 text-sm font-medium leading-tight text-[#F4F6FA]">
                {p.title.replace(/\s*\(.*\)$/, "")}
              </p>
              {hovered === i && (
                <p className="mt-1.5 text-[11px] leading-snug text-[#929EAF]">
                  {p.role} · {p.tech.slice(0, 3).join(" · ")}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* headline line in front of the core */}
        <div className="im-headline im-line-front pointer-events-none absolute inset-x-0 bottom-[40%] z-20 text-center md:bottom-[22%]">
          <h1 className="sr-only">{COPY.title}</h1>
          <p
            aria-hidden="true"
            className="im-line text-[clamp(40px,8.5vw,148px)] font-semibold leading-none tracking-[-0.04em] text-[#F4F6FA]"
          >
            intelligent systems.
          </p>
        </div>

        <div className="absolute inset-x-0 top-0 z-30 px-6 pt-6 md:px-12">
          <ConceptNav />
        </div>

        <div className="im-sub absolute bottom-28 left-6 right-6 z-30 flex flex-col gap-6 md:bottom-10 md:left-12 md:right-auto md:max-w-sm">
          <p className="text-sm leading-relaxed text-[#929EAF] md:text-base">{COPY.sub}</p>
          <CtaButtons />
        </div>

        <p className="im-hint pointer-events-none absolute inset-x-0 bottom-28 z-30 text-center font-mono text-[11px] tracking-[0.2em] text-[#929EAF] md:bottom-10">
          {isMobile ? "TAP A PROJECT TO OPEN" : "HOVER A PROJECT · CLICK TO OPEN"}
        </p>

        {/* portal: the pinned section may sit inside a transformed smooth-scroll container */}
        {createPortal(
          <RepoModal isOpen={modalRepos !== null} repos={modalRepos} onClose={() => setModalRepos(null)} />,
          document.body,
        )}
      </section>
      {reduced && (
        <div className="relative z-30 px-6 pb-32 pt-8 md:px-12">
          <p className="font-mono text-[11px] tracking-[0.25em] text-[#929EAF]">RECENT WORK</p>
          <ul className="mt-4 grid gap-3 md:grid-cols-3">
            {projects.map((p) => (
              <li key={p.id}>
                <button
                  type="button"
                  onClick={() => openProject(p, setModalRepos)}
                  className="w-full rounded-xl border border-white/10 p-4 text-left transition-colors hover:border-[#8ABFFF]/50"
                >
                  <span className="block text-sm font-medium text-[#F4F6FA]">{p.title}</span>
                  <span className="mt-1 block text-xs text-[#929EAF]">
                    {p.role} · {p.tech.slice(0, 3).join(" · ")}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
