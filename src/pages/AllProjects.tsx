import React, { useState, useMemo, useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { all_projects } from "../constants/projects";
import { RepoModal } from "../components/common/RepoModal";
import {
  AllProjectsSpotlight,
  AllProjectsHeader,
  AllProjectsTelemetry,
  AllProjectsFilter,
  AllProjectsGrid,
} from "../components/all-projects";

gsap.registerPlugin(ScrollTrigger);

const AllProjects: React.FC = () => {
  const [showRepoModal, setShowRepoModal] = useState(false);
  const [selectedRepo, setSelectedRepo] = useState<string | string[] | null>(
    null,
  );
  const [selectedYear, setSelectedYear] = useState<string>("All");

  const introStageRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const lensRingRef = useRef<HTMLDivElement>(null);
  const hudCueRef = useRef<HTMLDivElement>(null);
  const allContentRef = useRef<HTMLDivElement>(null);
  const projectsGridRef = useRef<HTMLDivElement>(null);

  // Get unique years sorted descending, ensuring 2026 is included
  const years = useMemo(() => {
    const yearSet = new Set(
      all_projects.map((p) => new Date(p.finished_date).getFullYear()),
    );
    yearSet.add(2026);
    return Array.from(yearSet).sort((a, b) => b - a);
  }, []);

  // Compute Project Summary by Year telemetry statistics
  const yearStats = useMemo(() => {
    const stats: Record<
      number,
      {
        count: number;
        techs: Set<string>;
        liveCount: number;
        repoCount: number;
      }
    > = {};

    // Pre-seed all years including 2026
    years.forEach((y) => {
      stats[y] = { count: 0, techs: new Set(), liveCount: 0, repoCount: 0 };
    });

    all_projects.forEach((p) => {
      const year = new Date(p.finished_date).getFullYear();
      if (!stats[year]) {
        stats[year] = {
          count: 0,
          techs: new Set(),
          liveCount: 0,
          repoCount: 0,
        };
      }
      stats[year].count += 1;
      p.tech.forEach((t) => stats[year].techs.add(t));
      if (p.web_url) stats[year].liveCount += 1;
      if (Array.isArray(p.repos)) {
        stats[year].repoCount += p.repos.length;
      } else if (p.repos) {
        stats[year].repoCount += 1;
      }
    });

    return Object.entries(stats)
      .map(([yearStr, data]) => ({
        year: parseInt(yearStr),
        count: data.count,
        techs:
          data.count === 0 ? ["Active", "In Progress"] : Array.from(data.techs),
        liveCount: data.liveCount,
        repoCount: data.repoCount,
      }))
      .sort((a, b) => b.year - a.year);
  }, [years]);

  // Filter and sort projects
  const filteredProjects = useMemo(() => {
    return all_projects
      .filter(
        (project) =>
          selectedYear === "All" ||
          new Date(project.finished_date).getFullYear().toString() ===
            selectedYear,
      )
      .sort(
        (a, b) =>
          new Date(b.finished_date).getTime() -
          new Date(a.finished_date).getTime(),
      );
  }, [selectedYear]);

  // Handle Year Card selection: update filter and scroll to projects grid
  const handleYearCardClick = (year: string) => {
    setSelectedYear(year);
    if (projectsGridRef.current) {
      projectsGridRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const handleRepoClick = (repos: string | string[]) => {
    if (Array.isArray(repos)) {
      setSelectedRepo(repos);
      setShowRepoModal(true);
    } else {
      window.open(repos, "_blank");
    }
  };

  // Stage 1: The "Lens Flare" Spotlight Mask Scroll Sequence at the very top ("scroll แรกสุด")
  useEffect(() => {
    // Ensure starting from top on mount
    window.scrollTo(0, 0);

    const ctx = gsap.context(() => {
      const maskData = { r: 0 };

      gsap.to(maskData, {
        r: 150,
        ease: "none",
        scrollTrigger: {
          trigger: introStageRef.current,
          start: "top top",
          end: "+=600",
          pin: true,
          scrub: 0.5,
          onUpdate: (self) => {
            const r = self.progress * 150;

            if (overlayRef.current) {
              if (r >= 145) {
                overlayRef.current.style.opacity = "0";
                overlayRef.current.style.visibility = "hidden";
                overlayRef.current.style.pointerEvents = "none";
              } else {
                overlayRef.current.style.opacity = "1";
                overlayRef.current.style.visibility = "visible";
                overlayRef.current.style.maskImage = `radial-gradient(circle at 50% 50%, transparent ${r}%, black calc(${r}% + 1px))`;
                overlayRef.current.style.webkitMaskImage = `radial-gradient(circle at 50% 50%, transparent ${r}%, black calc(${r}% + 1px))`;
              }
            }

            if (lensRingRef.current) {
              if (r <= 0.5 || r >= 142) {
                lensRingRef.current.style.opacity = "0";
              } else {
                lensRingRef.current.style.width = `${r * 2.2}vmax`;
                lensRingRef.current.style.height = `${r * 2.2}vmax`;
                const ringOpacity =
                  r > 80 ? Math.max(0, 1 - (r - 80) / 35) : Math.min(1, r / 12);
                lensRingRef.current.style.opacity = `${ringOpacity}`;
              }
            }

            if (hudCueRef.current) {
              const textOpacity = Math.max(0, 1 - self.progress * 3.5);
              hudCueRef.current.style.opacity = `${textOpacity}`;
              hudCueRef.current.style.pointerEvents =
                textOpacity > 0.05 ? "auto" : "none";
            }
          },
        },
      });
    }, introStageRef);

    return () => ctx.revert();
  }, []);

  // Refresh ScrollTrigger when filtered project list length changes
  useEffect(() => {
    ScrollTrigger.refresh();
  }, [filteredProjects]);

  // Quick skip helper to jump past the initial spotlight stage directly into AllProject content
  const bypassSpotlight = () => {
    if (allContentRef.current) {
      allContentRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <div className="relative w-full min-h-screen overflow-x-hidden bg-space-white dark:bg-space-black text-slate-900 dark:text-white transition-colors duration-300">
      {/* Ambient Background Glow for Light and Dark Modes */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-40 dark:opacity-25 bg-[radial-gradient(circle_at_top,_rgba(124,58,237,0.12),_transparent_55%),radial-gradient(circle_at_bottom_right,_rgba(6,182,212,0.1),_transparent_50%)]" />

      {/* 1. INITIAL SCROLL STAGE ("scroll แรกสุด") */}
      <AllProjectsSpotlight
        introStageRef={introStageRef}
        overlayRef={overlayRef}
        lensRingRef={lensRingRef}
        hudCueRef={hudCueRef}
        totalProjects={all_projects.length}
        years={years}
        onBypass={bypassSpotlight}
      />

      {/* 2. ALL PROJECT CONTENT */}
      <div
        ref={allContentRef}
        className="container mx-auto px-6 py-20 max-w-7xl relative z-10"
      >
        <AllProjectsHeader
          totalProjects={all_projects.length}
          years={years}
        />

        <AllProjectsTelemetry
          selectedYear={selectedYear}
          years={years}
          yearStats={yearStats}
          totalProjects={all_projects.length}
          onSelectYear={handleYearCardClick}
        />

        <AllProjectsFilter
          selectedYear={selectedYear}
          years={years}
          allProjects={all_projects}
          filteredCount={filteredProjects.length}
          onSelectYear={setSelectedYear}
          projectsGridRef={projectsGridRef}
        />

        <AllProjectsGrid
          filteredProjects={filteredProjects}
          selectedYear={selectedYear}
          onRepoClick={handleRepoClick}
        />
      </div>

      {/* Shared Repository Modal */}
      <RepoModal
        isOpen={showRepoModal}
        repos={selectedRepo}
        onClose={() => setShowRepoModal(false)}
      />
    </div>
  );
};

export default AllProjects;
