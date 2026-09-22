import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpDown } from "lucide-react";

interface ProjectFooterControlsProps {
  totalProjects: number;
  activeIndex: number;
  onScrollToProject: (index: number) => void;
}

export const ProjectFooterControls: React.FC<ProjectFooterControlsProps> = ({
  totalProjects,
  activeIndex,
  onScrollToProject,
}) => {
  return (
    <div className="flex items-center justify-between gap-3 mt-14 sm:mt-16 lg:mt-6 px-1 relative z-30">
      {/* View Project Archives Link */}
      <Link
        to="/projects"
        className="group inline-flex items-center gap-1.5 py-2 px-1 text-xs sm:text-sm font-mono text-gray-600 dark:text-gray-400 hover:text-nebula-purple dark:hover:text-starlight-cyan transition-colors"
      >
        <span className="font-semibold underline-offset-4 group-hover:underline">
          View Project Archives
        </span>
        <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-1.5 transition-transform text-starlight-cyan" />
      </Link>

      {/* Swipe Gesture Hint & Interactive Stack Dots */}
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="hidden xs:flex items-center gap-1 font-mono text-[10px] sm:text-[11px] text-gray-500 dark:text-gray-400">
          <ArrowUpDown className="w-3 h-3 text-nebula-purple dark:text-starlight-cyan animate-pulse" />
          <span className="hidden sm:inline">Swap</span>
        </div>

        <div className="flex items-center gap-1 p-1 rounded-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10">
          {Array.from({ length: totalProjects }).map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onScrollToProject(idx)}
              className="p-1 cursor-pointer flex items-center justify-center transition-all"
              aria-label={`Go to project ${idx + 1}`}
            >
              <span
                className={`block h-2 rounded-full transition-all duration-300 ${
                  idx === activeIndex
                    ? "w-6 bg-gradient-to-r from-nebula-purple to-starlight-cyan shadow-[0_0_8px_rgba(6,182,212,0.7)]"
                    : "w-2 bg-gray-300 dark:bg-white/20 hover:bg-gray-400 dark:hover:bg-white/40"
                }`}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
