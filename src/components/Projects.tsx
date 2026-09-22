import React, { useRef, useLayoutEffect, useEffect, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { projects } from "../constants/projects";
import { RepoModal } from "./common/RepoModal";
import {
  ProjectCardStack,
  ProjectFooterControls,
  ProjectObservatory,
} from "./projects/index";

gsap.registerPlugin(ScrollTrigger);

const Projects: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const orbitRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [showRepoModal, setShowRepoModal] = useState(false);
  const [selectedRepos, setSelectedRepos] = useState<string | string[] | null>(
    null,
  );

  // Responsive window width tracking
  const [windowWidth, setWindowWidth] = useState<number>(() =>
    typeof window !== "undefined" ? window.innerWidth : 1200,
  );

  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const scrollTriggerInstanceRef = useRef<ScrollTrigger | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const touchStartYRef = useRef(0);
  const touchCurrentYRef = useRef(0);

  // Resize listener for fluid responsive orbit geometry
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleRepoClick = (repos: string | string[]) => {
    setSelectedRepos(repos);
    if (Array.isArray(repos)) {
      setShowRepoModal(true);
    } else {
      window.open(repos, "_blank");
    }
  };

  // Smooth programmatic scroll to a project step
  const scrollToProject = useCallback((targetIndex: number) => {
    const totalProjects = projects.length;
    const clampedIndex = Math.min(Math.max(targetIndex, 0), totalProjects - 1);
    const st = scrollTriggerInstanceRef.current;
    if (st) {
      const progressTarget = clampedIndex / (totalProjects - 1);
      const targetScroll = st.start + progressTarget * (st.end - st.start);
      window.scrollTo({
        top: targetScroll,
        behavior: "smooth",
      });
    } else {
      setActiveIndex(clampedIndex);
    }
  }, []);

  // Swap trigger button & swipe handler
  const triggerSwap = useCallback(
    (direction: "up" | "down" = "up") => {
      const totalProjects = projects.length;
      const nextIndex =
        direction === "up"
          ? (activeIndex + 1) % totalProjects
          : (activeIndex - 1 + totalProjects) % totalProjects;
      scrollToProject(nextIndex);
    },
    [activeIndex, scrollToProject],
  );

  // Touch gesture handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartYRef.current = e.touches[0].clientY;
    touchCurrentYRef.current = e.touches[0].clientY;
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    touchCurrentYRef.current = e.touches[0].clientY;
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    const diff = touchCurrentYRef.current - touchStartYRef.current;
    if (diff < -35) {
      triggerSwap("up");
    } else if (diff > 35) {
      triggerSwap("down");
    }
  };

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const totalProjects = projects.length;
      const totalOrbitRotation = (totalProjects - 1) * (360 / totalProjects);

      // Set initial card states with depth and subtle drop shadow
      cardsRef.current.forEach((card, idx) => {
        if (!card) return;
        if (idx === 0) {
          gsap.set(card, { y: 0, scale: 1, opacity: 1, zIndex: 30 });
        } else if (idx === 1) {
          gsap.set(card, { y: 22, scale: 0.96, opacity: 0.88, zIndex: 20 });
        } else if (idx === 2) {
          gsap.set(card, { y: 44, scale: 0.92, opacity: 0.65, zIndex: 10 });
        } else {
          gsap.set(card, { y: 66, scale: 0.88, opacity: 0, zIndex: 5 });
        }
      });

      // Unified Master Timeline pinned to scroll
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=3600",
          pin: true,
          scrub: 1,
          onUpdate: (self) => {
            const progress = self.progress;
            const index = Math.round(progress * (totalProjects - 1));
            setActiveIndex(Math.min(Math.max(index, 0), totalProjects - 1));
          },
        },
      });

      scrollTriggerInstanceRef.current = tl.scrollTrigger ?? null;

      // 1. Synchronized Orbit Rotation matching scroll
      tl.to(
        orbitRef.current,
        {
          rotation: totalOrbitRotation,
          ease: "none",
          duration: totalProjects - 1,
        },
        0,
      );

      // 2. Synchronized Card Swapping per project step
      for (let i = 0; i < totalProjects - 1; i++) {
        const stepStartTime = i;

        // Active card i lifts smoothly upwards and out of view
        const currentCard = cardsRef.current[i];
        if (currentCard) {
          tl.to(
            currentCard,
            {
              y: "-130%",
              rotation: -2.5,
              opacity: 0,
              ease: "power1.inOut",
              duration: 0.85,
            },
            stepStartTime + 0.08,
          );
        }

        // Next card i+1 steps up into front active position (y: 0, scale 1, opacity 1)
        const nextCard = cardsRef.current[i + 1];
        if (nextCard) {
          tl.to(
            nextCard,
            {
              y: 0,
              scale: 1,
              opacity: 1,
              zIndex: 30,
              ease: "power1.inOut",
              duration: 0.85,
            },
            stepStartTime + 0.08,
          );
        }

        // Card i+2 steps up into middle peek position (22px, scale 0.96, opacity 0.88)
        if (i + 2 < totalProjects) {
          const card2 = cardsRef.current[i + 2];
          if (card2) {
            tl.to(
              card2,
              {
                y: 22,
                scale: 0.96,
                opacity: 0.88,
                zIndex: 20,
                ease: "power1.inOut",
                duration: 0.85,
              },
              stepStartTime + 0.08,
            );
          }
        }

        // Card i+3 steps up into back deck position (44px, scale 0.92, opacity 0.65)
        if (i + 3 < totalProjects) {
          const card3 = cardsRef.current[i + 3];
          if (card3) {
            tl.to(
              card3,
              {
                y: 44,
                scale: 0.92,
                opacity: 0.65,
                zIndex: 10,
                ease: "power1.inOut",
                duration: 0.85,
              },
              stepStartTime + 0.08,
            );
          }
        }
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Calculate dynamic responsive radius matching the orbit element width
  const getPlanetRadius = useCallback(() => {
    if (windowWidth >= 1280) return 440; // xl (orbit ~880px)
    if (windowWidth >= 1024) return 360; // lg (orbit ~720px)
    if (windowWidth >= 768) return 210; // md (orbit ~420px)
    if (windowWidth >= 640) return 160; // sm (orbit ~320px)
    return 130; // mobile (< 640px, orbit ~260px)
  }, [windowWidth]);

  // Calculate position for each planet along the circular track
  const getPlanetStyle = (index: number) => {
    const total = projects.length;
    // Planet 0 starts at 180deg (9 o'clock), each next is 90deg counter-clockwise
    const offsetAngle = 180 - index * (360 / total);
    const radius = getPlanetRadius();

    return {
      transform: `rotate(${offsetAngle}deg) translate(${radius}px) rotate(-${offsetAngle}deg)`,
    };
  };

  const activeProject = projects[activeIndex];

  return (
    <section
      ref={containerRef}
      className="relative h-screen w-full bg-space-white dark:bg-space-black overflow-hidden flex items-center transition-colors duration-300"
    >
      {/* Background Ambient Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-nebula-purple/5 via-transparent to-transparent pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-12 items-center relative z-10 h-full pt-20 sm:pt-28 md:pt-36 lg:pt-0">
        {/* Left Side: Modern Vertical Card-Stack Swap UI Component */}
        <div className="flex flex-col justify-center h-full order-2 lg:order-1 relative z-20 w-full max-w-xl mx-auto lg:mx-0">
          {/* Header telemetry info */}
          <div className="flex items-center justify-between gap-3 mb-2 sm:mb-3 px-1">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-starlight-cyan animate-pulse shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
              <span className="sci-fi-subheading tracking-wider text-[11px] sm:text-xs">
                MISSION LOG // CARD STACK
              </span>
            </div>
            <div className="flex items-center gap-1.5 font-mono text-xs text-gray-500 dark:text-gray-400">
              <span className="text-nebula-purple dark:text-starlight-cyan font-bold">
                0{activeIndex + 1}
              </span>
              <span>/</span>
              <span>0{projects.length}</span>
            </div>
          </div>

          {/* Vertical Card Stack Container */}
          <ProjectCardStack
            activeIndex={activeIndex}
            projects={projects}
            cardsRef={cardsRef}
            onCardClick={scrollToProject}
            onSwap={triggerSwap}
            onRepoClick={handleRepoClick}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          />

          {/* Bottom Deck Controls & Footer */}
          <ProjectFooterControls
            totalProjects={projects.length}
            activeIndex={activeIndex}
            onScrollToProject={scrollToProject}
          />
        </div>

        {/* Right Side: Tactical Radar Observatory */}
        <ProjectObservatory
          activeProject={activeProject}
          activeIndex={activeIndex}
          projects={projects}
          orbitRef={orbitRef}
          getPlanetStyle={getPlanetStyle}
          onScrollToProject={scrollToProject}
          onRepoClick={handleRepoClick}
        />
      </div>

      {/* Scroll Progress Indicator */}
      <div className="absolute bottom-10 right-6 sm:right-10 flex flex-col gap-2 z-20">
        {projects.map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => scrollToProject(idx)}
            className={`w-2 h-2 rounded-full transition-all duration-300 cursor-pointer ${
              idx === activeIndex
                ? "bg-starlight-cyan scale-150 shadow-[0_0_8px_rgba(6,182,212,0.8)]"
                : "bg-gray-300 dark:bg-white/20 hover:bg-gray-400 dark:hover:bg-white/40"
            }`}
            aria-label={`Scroll indicator project ${idx + 1}`}
          />
        ))}
      </div>

      {/* Repository Modal */}
      <RepoModal
        isOpen={showRepoModal}
        repos={selectedRepos}
        onClose={() => setShowRepoModal(false)}
      />
    </section>
  );
};

export default Projects;
