import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Calendar, Layers, CheckCircle2, FolderGit2 } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export interface YearStat {
  year: number;
  count: number;
  techs: string[];
  liveCount: number;
  repoCount: number;
}

interface AllProjectsTelemetryProps {
  selectedYear: string;
  years: number[];
  yearStats: YearStat[];
  totalProjects: number;
  onSelectYear: (year: string) => void;
}

export const AllProjectsTelemetry: React.FC<AllProjectsTelemetryProps> = ({
  selectedYear,
  years,
  yearStats,
  totalProjects,
  onSelectYear,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 85%",
          toggleActions: "restart none restart none",
        },
      });

      tl.fromTo(
        ".telemetry-heading",
        { y: -15, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.45, ease: "power3.out" },
      ).fromTo(
        ".telemetry-card",
        { y: 35, opacity: 0, scale: 0.95 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.5,
          stagger: 0.08,
          ease: "back.out(1.2)",
        },
        "-=0.25",
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="mb-10 sm:mb-12">
      <div className="telemetry-heading flex items-center justify-between mb-3.5">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-nebula-purple dark:text-starlight-cyan" />
          <span className="sci-fi-subheading">Yearly Telemetry Summary</span>
        </div>
        <span className="text-xs font-mono text-gray-500 dark:text-gray-400 hidden sm:inline-block">
          Click a card to filter and view projects
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {/* All Years Aggregate Card */}
        <div
          onClick={() => onSelectYear("All")}
          className={`telemetry-card p-4 sm:p-5 rounded-2xl sci-fi-card cursor-pointer transition-all duration-300 relative group overflow-hidden will-change-transform ${
            selectedYear === "All"
              ? "!border-nebula-purple dark:!border-starlight-cyan ring-1 ring-nebula-purple/50 dark:ring-starlight-cyan/50 shadow-[0_0_25px_rgba(124,58,237,0.2)] scale-[1.02]"
              : "hover:scale-[1.02]"
          }`}
        >
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <span className="px-2 py-0.5 rounded-full text-[11px] sm:text-xs font-mono font-bold bg-nebula-purple/15 text-nebula-purple dark:bg-starlight-cyan/15 dark:text-starlight-cyan">
              ALL YEARS
            </span>
            <Layers className="w-4 h-4 text-gray-400 group-hover:text-nebula-purple dark:group-hover:text-starlight-cyan transition-colors" />
          </div>

          <div className="mb-2">
            <div className="text-2xl sm:text-3xl font-black sci-fi-heading font-mono">
              {totalProjects}{" "}
              <span className="text-xs font-normal text-gray-500 dark:text-gray-400 font-sans">
                Projects
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-gray-600 dark:text-gray-400 mt-0.5 line-clamp-1">
              Complete historical backlog
            </p>
          </div>

          <div className="pt-2 border-t border-gray-100 dark:border-white/5 flex items-center justify-between text-[10px] sm:text-[11px] font-mono text-gray-500 dark:text-gray-400">
            <span>Active Years</span>
            <span className="font-semibold text-gray-800 dark:text-gray-200">
              {years.length} Milestones
            </span>
          </div>
        </div>

        {/* Specific Year Summary Cards */}
        {yearStats.map((stat) => {
          const isSelected = selectedYear === stat.year.toString();
          return (
            <div
              key={stat.year}
              onClick={() => onSelectYear(stat.year.toString())}
              className={`telemetry-card p-4 sm:p-5 rounded-2xl sci-fi-card cursor-pointer transition-all duration-300 relative group overflow-hidden will-change-transform ${
                isSelected
                  ? "!border-nebula-purple dark:!border-starlight-cyan ring-1 ring-nebula-purple/50 dark:ring-starlight-cyan/50 shadow-[0_0_25px_rgba(6,182,212,0.2)] scale-[1.02]"
                  : "hover:scale-[1.02]"
              }`}
            >
              <div className="flex items-center justify-between mb-2 sm:mb-3">
                <span className="px-2 py-0.5 rounded-full text-[11px] sm:text-xs font-mono font-bold bg-gray-100 dark:bg-white/10 text-gray-800 dark:text-gray-200 group-hover:bg-nebula-purple/15 group-hover:text-nebula-purple dark:group-hover:text-starlight-cyan transition-colors">
                  {stat.year}
                </span>
                {isSelected ? (
                  <CheckCircle2 className="w-4 h-4 text-nebula-purple dark:text-starlight-cyan" />
                ) : (
                  <FolderGit2 className="w-4 h-4 text-gray-400 group-hover:text-starlight-blue transition-colors" />
                )}
              </div>

              <div className="mb-2">
                <div className="text-2xl sm:text-3xl font-black sci-fi-heading font-mono">
                  {stat.count}{" "}
                  <span className="text-xs font-normal text-gray-500 dark:text-gray-400 font-sans">
                    {stat.count === 1 ? "Project" : "Projects"}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {stat.techs.slice(0, 3).map((tech, idx) => (
                    <span
                      key={idx}
                      className="text-[9px] sm:text-[10px] font-mono px-1.5 py-0.5 rounded bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-300"
                    >
                      {tech}
                    </span>
                  ))}
                  {stat.techs.length > 3 && (
                    <span className="text-[9px] font-mono text-gray-400 self-center">
                      +{stat.techs.length - 3}
                    </span>
                  )}
                </div>
              </div>

              <div className="pt-2 border-t border-gray-100 dark:border-white/5 flex items-center justify-between text-[10px] sm:text-[11px] font-mono text-gray-500 dark:text-gray-400">
                <span>Repositories</span>
                <span className="font-semibold text-gray-800 dark:text-gray-200">
                  {stat.repoCount} Repos
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
