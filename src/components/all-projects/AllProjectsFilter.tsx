import React, { useEffect, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Project } from "../../constants/projects";

gsap.registerPlugin(ScrollTrigger);

interface AllProjectsFilterProps {
  selectedYear: string;
  years: number[];
  allProjects: Project[];
  filteredCount: number;
  onSelectYear: (year: string) => void;
  projectsGridRef: RefObject<HTMLDivElement | null>;
}

export const AllProjectsFilter: React.FC<AllProjectsFilterProps> = ({
  selectedYear,
  years,
  allProjects,
  filteredCount,
  onSelectYear,
  projectsGridRef,
}) => {
  useEffect(() => {
    if (!projectsGridRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        projectsGridRef.current,
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.45,
          ease: "power2.out",
          scrollTrigger: {
            trigger: projectsGridRef.current,
            start: "top 90%",
            toggleActions: "restart none restart none",
          },
        },
      );
    }, projectsGridRef);

    return () => ctx.revert();
  }, [projectsGridRef]);

  return (
    <div
      ref={projectsGridRef}
      className="flex items-center justify-between mb-8 flex-wrap gap-4 pt-4 border-t border-gray-200/80 dark:border-white/10"
    >
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs font-mono text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          Filter by Year:
        </span>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onSelectYear("All")}
            className={`px-4 py-1.5 rounded-full text-xs font-mono font-semibold transition-all duration-300 cursor-pointer ${
              selectedYear === "All"
                ? "bg-gradient-to-r from-nebula-purple to-starlight-blue text-white shadow-md shadow-nebula-purple/30"
                : "sci-fi-card text-gray-700 dark:text-gray-300 hover:text-nebula-purple dark:hover:text-starlight-cyan hover:border-nebula-purple/40 dark:hover:border-starlight-cyan/40"
            }`}
          >
            All ({allProjects.length})
          </button>
          {years.map((year) => {
            const count = allProjects.filter(
              (p) => new Date(p.finished_date).getFullYear() === year,
            ).length;
            return (
              <button
                key={year}
                onClick={() => onSelectYear(year.toString())}
                className={`px-4 py-1.5 rounded-full text-xs font-mono font-semibold transition-all duration-300 cursor-pointer ${
                  selectedYear === year.toString()
                    ? "bg-gradient-to-r from-nebula-purple to-starlight-blue text-white shadow-md shadow-nebula-purple/30"
                    : "sci-fi-card text-gray-700 dark:text-gray-300 hover:text-nebula-purple dark:hover:text-starlight-cyan hover:border-nebula-purple/40 dark:hover:border-starlight-cyan/40"
                }`}
              >
                {year} ({count})
              </button>
            );
          })}
        </div>
      </div>

      <span className="text-xs font-mono text-gray-500 dark:text-gray-400">
        Showing{" "}
        <span className="text-gray-900 dark:text-white font-bold">
          {filteredCount}
        </span>{" "}
        of {allProjects.length} operations
      </span>
    </div>
  );
};
