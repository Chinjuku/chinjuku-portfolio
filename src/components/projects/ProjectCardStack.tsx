import React, { type MutableRefObject } from "react";
import { ChevronsUp, Radio, ExternalLink, Github } from "lucide-react";
import type { Project } from "../../constants/projects";

interface ProjectCardStackProps {
  activeIndex: number;
  projects: Project[];
  cardsRef: MutableRefObject<(HTMLDivElement | null)[]>;
  onCardClick: (index: number) => void;
  onSwap: (direction?: "up" | "down") => void;
  onRepoClick: (repos: string | string[]) => void;
  onTouchStart: (e: React.TouchEvent) => void;
  onTouchMove: (e: React.TouchEvent) => void;
  onTouchEnd: () => void;
}

export const ProjectCardStack: React.FC<ProjectCardStackProps> = ({
  activeIndex,
  projects,
  cardsRef,
  onCardClick,
  onSwap,
  onRepoClick,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
}) => {
  return (
    <div
      className="relative w-full h-[350px] sm:h-[420px] lg:h-[490px] select-none"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {projects.map((project, idx) => {
        const isCurrentActive = idx === activeIndex;
        const isBehind = idx > activeIndex;

        return (
          <div
            key={project.id}
            ref={(el) => {
              cardsRef.current[idx] = el;
            }}
            onClick={() => {
              if (isBehind) {
                onCardClick(idx);
              }
            }}
            className={`absolute inset-x-0 top-0 rounded-2xl md:rounded-3xl border border-gray-200/90 dark:border-cyan-500/30 bg-white/95 dark:bg-[#0b0d16]/95 backdrop-blur-xl p-4 sm:p-6 lg:p-7 shadow-[0_18px_45px_rgba(0,0,0,0.12)] dark:shadow-[0_20px_55px_rgba(0,0,0,0.85)] ring-1 ring-black/5 dark:ring-white/5 overflow-hidden transition-colors ${
              isCurrentActive
                ? "pointer-events-auto"
                : isBehind
                ? "cursor-pointer hover:border-nebula-purple/50 dark:hover:border-starlight-cyan/50"
                : "pointer-events-none"
            }`}
          >
            {/* Corner HUD Reticle Accents */}
            <div className="absolute top-2.5 left-2.5 w-3 h-3 border-t-2 border-l-2 border-nebula-purple/50 dark:border-starlight-cyan/60 pointer-events-none" />
            <div className="absolute bottom-2.5 right-2.5 w-3 h-3 border-b-2 border-r-2 border-nebula-purple/50 dark:border-starlight-cyan/60 pointer-events-none" />

            {/* Card Header */}
            <div className="flex items-center justify-between gap-2 mb-2 sm:mb-3">
              <div className="flex items-center gap-1.5 min-w-0">
                <span
                  className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                    isCurrentActive ? "bg-emerald-400 animate-pulse" : "bg-gray-400"
                  }`}
                />
                <span className="sci-fi-subheading text-[10px] sm:text-xs truncate">
                  {isCurrentActive
                    ? `PROJECT 0${project.id} // ACTIVE`
                    : `PROJECT 0${project.id} // DECK`}
                </span>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <span className="text-[10px] sm:text-[11px] font-mono px-2 py-0.5 rounded-full bg-black/5 dark:bg-white/10 text-gray-600 dark:text-gray-300">
                  {project.role}
                </span>
                {/* Swap Action Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSwap("up");
                  }}
                  className="group flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full border border-gray-200 dark:border-white/15 bg-black/5 dark:bg-white/5 hover:bg-nebula-purple/15 dark:hover:bg-cyan-500/15 text-gray-700 dark:text-gray-200 text-xs font-mono transition-all cursor-pointer"
                  title="Swap to next project card"
                >
                  <ChevronsUp className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform text-nebula-purple dark:text-starlight-cyan" />
                  <span className="hidden sm:inline text-[11px] font-semibold">
                    SWAP
                  </span>
                </button>
              </div>
            </div>

            {/* Mobile-Only Tactical Screenshot Banner (Visible on mobile < sm) */}
            <div className="sm:hidden relative w-full h-20 rounded-lg overflow-hidden mb-2 border border-cyan-500/25 bg-black/80">
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover opacity-85"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.35)_50%)] bg-[length:100%_4px] opacity-40 pointer-events-none" />
              <div className="absolute top-1.5 left-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/70 border border-cyan-400/40 text-[9px] font-mono text-cyan-300">
                <Radio className="w-2.5 h-2.5 animate-pulse text-cyan-400" />
                <span>SYS.0{project.id} // CAM FEED</span>
              </div>
            </div>

            {/* Project Title */}
            <h3 className="text-lg sm:text-2xl lg:text-3xl font-bold sci-fi-heading mb-1 sm:mb-2 transition-colors">
              {project.title}
            </h3>

            {/* Project Description */}
            <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm lg:text-base leading-relaxed mb-2.5 sm:mb-4 line-clamp-2 sm:line-clamp-3 md:line-clamp-4">
              {project.description}
            </p>

            {/* Tech Stack Badges */}
            <div className="flex flex-wrap gap-1 sm:gap-1.5 mb-3 sm:mb-5">
              {project.tech.map((t, i) => (
                <span
                  key={i}
                  className="sci-fi-badge text-[10px] sm:text-xs py-0.5 px-2 sm:px-2.5"
                >
                  {t}
                </span>
              ))}
            </div>

            {/* Distinct Primary Action Button & Secondary Button */}
            <div className="flex items-center gap-2 pt-2 border-t border-gray-100 dark:border-white/10">
              {project.web_url ? (
                <>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(project.web_url, "_blank");
                    }}
                    className="sci-fi-btn-primary flex-1 py-1.5 sm:py-2 px-3 text-xs sm:text-sm shadow-md shadow-cyan-500/25 dark:shadow-cyan-500/40"
                  >
                    <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span>Live Demo</span>
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRepoClick(project.repos);
                    }}
                    className="sci-fi-btn-secondary py-1.5 sm:py-2 px-3 sm:px-4 text-xs sm:text-sm"
                    title="Inspect Source Code"
                  >
                    <Github className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">Source Code</span>
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRepoClick(project.repos);
                  }}
                  className="sci-fi-btn-primary w-full py-1.5 sm:py-2 text-xs sm:text-sm shadow-md shadow-nebula-purple/30 dark:shadow-starlight-cyan/30"
                >
                  <Github className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span>Inspect Source Code</span>
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
