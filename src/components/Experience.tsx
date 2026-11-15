import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { experiences } from "../constants/experiences";
import {
  ExperienceHeader,
  ExperienceTimelineNode,
  ExperienceCard,
  ExperienceTelemetrySide,
} from "./experience/index";
import { TiltCard } from "./motion";

gsap.registerPlugin(ScrollTrigger);

const Experience: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const timelineContainerRef = useRef<HTMLDivElement>(null);
  const laserLineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Header Entrance
      gsap.fromTo(
        ".experience-header",
        { y: -25, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            toggleActions: "restart none restart none",
          },
        },
      );

      // 2. Central Laser Energy Conduit Scrub
      if (laserLineRef.current && timelineContainerRef.current) {
        gsap.fromTo(
          laserLineRef.current,
          { height: "0%" },
          {
            height: "100%",
            ease: "none",
            scrollTrigger: {
              trigger: timelineContainerRef.current,
              start: "top 75%",
              end: "bottom 75%",
              scrub: 0.5,
            },
          },
        );
      }

      // 3. Staggered Alternating Slide-In for Experience Cards, Nodes & Opposite Telemetry Plates
      const items = gsap.utils.toArray<HTMLElement>(".experience-timeline-row");
      items.forEach((item, index) => {
        const isEven = index % 2 === 0;
        const card = item.querySelector(".experience-card");
        const node = item.querySelector(".experience-node");
        const telemetry = item.querySelector(".experience-telemetry");

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: item,
            start: "top 85%",
            toggleActions: "restart none restart none",
          },
        });

        // Node pop & ripple
        if (node) {
          tl.fromTo(
            node,
            { scale: 0.4, opacity: 0 },
            {
              scale: 1,
              opacity: 1,
              duration: 0.5,
              ease: "back.out(1.5)",
            },
          );
        }

        // Card wipes in from its side, de-blurring as it lands
        if (card) {
          const fromSide = window.innerWidth < 768 || !isEven ? "right" : "left";
          tl.fromTo(
            card,
            {
              opacity: 0,
              x: fromSide === "left" ? -40 : 40,
              clipPath:
                fromSide === "left"
                  ? "inset(0% 100% 0% 0% round 16px)"
                  : "inset(0% 0% 0% 100% round 16px)",
              filter: "blur(10px)",
            },
            {
              opacity: 1,
              x: 0,
              clipPath: "inset(0% 0% 0% 0% round 16px)",
              filter: "blur(0px)",
              duration: 0.95,
              ease: "power3.out",
              clearProps: "clipPath,filter",
            },
            "-=0.35",
          );
        }

        // node lights up when the scrubbed line reaches it
        if (node) {
          ScrollTrigger.create({
            trigger: node,
            start: "top 75%",
            end: "max", // stay lit once passed; dims again only when scrolled back above
            toggleClass: { targets: node, className: "is-lit" },
          });
        }

        // the big year drifts against the scroll
        const year = item.querySelector(".exp-year");
        if (year) {
          gsap.fromTo(
            year,
            { yPercent: 35 },
            {
              yPercent: -35,
              ease: "none",
              scrollTrigger: { trigger: item, start: "top bottom", end: "bottom top", scrub: true },
            },
          );
        }

        // Opposite side Telemetry Plate clamps in simultaneously
        if (telemetry) {
          tl.fromTo(
            telemetry,
            {
              opacity: 0,
              x: isEven ? 50 : -50,
              y: 15,
            },
            {
              opacity: 1,
              x: 0,
              y: 0,
              duration: 0.65,
              ease: "back.out(1.15)",
            },
            "-=0.55",
          );
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const timelineSpan = `${new Date(experiences[experiences.length - 1].finished_date).getFullYear()} - ${new Date(experiences[0].finished_date).getFullYear()}`;

  return (
    <section
      id="experience"
      ref={sectionRef}
      className="min-h-screen flex items-center justify-center bg-space-white dark:bg-space-black relative py-24 sm:py-28 overflow-hidden transition-colors duration-300"
    >
      {/* Background Ambient Elements */}
      <div className="absolute top-1/3 -left-36 w-80 h-80 bg-nebula-purple/10 dark:bg-starlight-cyan/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/3 -right-36 w-80 h-80 bg-starlight-cyan/10 dark:bg-nebula-purple/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#94a3b8_1px,transparent_1px)] dark:bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:32px_32px] pointer-events-none opacity-30 dark:opacity-40" />

      <div className="container mx-auto px-4 sm:px-6 max-w-6xl relative z-10">
        {/* Header Component */}
        <ExperienceHeader
          totalCount={experiences.length}
          timelineSpan={timelineSpan}
        />

        {/* Central Timeline Container */}
        <div ref={timelineContainerRef} className="relative max-w-5xl mx-auto">
          {/* Central Cyber Energy Conduit Line */}
          {/* Desktop Line (Centered) */}
          <div className="hidden md:block absolute left-1/2 top-4 bottom-4 w-px -translate-x-1/2 bg-white/10 pointer-events-none">
            <div
              ref={laserLineRef}
              className="relative w-full bg-gradient-to-b from-transparent via-core-chrome to-core-icy"
            >
              {/* comet at the tip of the line */}
              <span className="absolute -bottom-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-core-ink shadow-[0_0_18px_5px_rgba(138,191,255,0.75)]" />
            </div>
          </div>

          {/* Mobile Left-Aligned Rail Line */}
          <div className="md:hidden absolute left-4 sm:left-6 top-4 bottom-4 w-1 -translate-x-1/2 rounded-full bg-gray-200 dark:bg-white/10 overflow-hidden pointer-events-none">
            <div className="w-full h-full bg-gradient-to-b from-starlight-cyan via-nebula-purple to-starlight-blue shadow-[0_0_12px_rgba(138,191,255,0.8)]" />
          </div>

          {/* Timeline Rows */}
          <div className="space-y-10 sm:space-y-14 md:space-y-16">
            {experiences.map((exp, index) => {
              const isEven = index % 2 === 0;

              return (
                <div
                  key={exp.id}
                  className={`experience-timeline-row relative flex flex-col md:flex-row items-start md:items-center gap-4 sm:gap-6 md:gap-10 pl-10 sm:pl-14 md:pl-0 ${
                    isEven ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  {/* Left (or Right) Content Card */}
                  <div className="w-full md:w-1/2">
                    <TiltCard max={4} glow={false} className="rounded-2xl">
                      <ExperienceCard experience={exp} isEven={isEven} />
                    </TiltCard>
                  </div>

                  {/* Center Node (Absolute position on mobile, flex centered on desktop) */}
                  <div className="absolute left-0 md:relative md:left-auto md:w-0 flex items-center justify-center -translate-x-1/2 md:translate-x-0 top-3 md:top-auto">
                    <ExperienceTimelineNode index={index} />
                  </div>

                  {/* Opposite Telemetry / HUD Milestone Plate on desktop */}
                  <div className="hidden md:flex w-1/2">
                    <ExperienceTelemetrySide
                      experience={exp}
                      index={index}
                      isEven={isEven}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
