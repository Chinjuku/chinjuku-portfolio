import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ExternalLink, Github, Layers } from "lucide-react";
import type { Project } from "../../constants/projects";

gsap.registerPlugin(ScrollTrigger);

interface AllProjectsGridProps {
  filteredProjects: Project[];
  selectedYear: string;
  onRepoClick: (repos: string | string[]) => void;
}

export const AllProjectsGrid: React.FC<AllProjectsGridProps> = ({
  filteredProjects,
  selectedYear,
  onRepoClick,
}) => {
  const gridContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!gridContainerRef.current) return;
    const cards =
      gridContainerRef.current.querySelectorAll(".project-archive-card");
    if (!cards.length) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        cards,
        {
          opacity: 0,
          x: (i) => (i % 2 === 0 ? -70 : 70),
          y: 25,
        },
        {
          opacity: 1,
          x: 0,
          y: 0,
          duration: 0.65,
          stagger: {
            each: 0.08,
            from: "start",
          },
          ease: "power3.out",
          scrollTrigger: {
            trigger: gridContainerRef.current,
            start: "top 85%",
            toggleActions: "restart none restart none",
          },
        },
      );
    }, gridContainerRef);

    return () => ctx.revert();
  }, [filteredProjects]);

  return (
    <>
      <div
        ref={gridContainerRef}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            className="project-archive-card group relative sci-fi-card rounded-2xl overflow-hidden hover:-translate-y-1.5 transition-all duration-300 flex flex-col hover:shadow-xl hover:shadow-gray-200/60 dark:hover:shadow-[0_10px_30px_rgba(124,58,237,0.15)] will-change-transform"
          >
            {/* Thumbnail Image */}
            <div className="h-52 overflow-hidden relative">
              <img
                src={project.image}
                alt={project.title}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-space-black/85 via-space-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />

              {/* Role Tag on Image */}
              <div className="absolute top-3 left-3">
                <span className="sci-fi-badge !bg-black/60 !backdrop-blur-md !text-white !border-white/20">
                  {project.role}
                </span>
              </div>
            </div>

            {/* Content Details */}
            <div className="p-6 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-bold sci-fi-heading group-hover:text-nebula-purple dark:group-hover:text-starlight-cyan transition-colors">
                  {project.title}
                </h3>
                <span className="text-xs font-mono text-gray-500 dark:text-gray-400 bg-station-light dark:bg-white/5 border border-station-gray dark:border-white/10 px-2.5 py-1 rounded-full whitespace-nowrap ml-2">
                  {new Date(project.finished_date).toLocaleDateString("en-US", {
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>

              <p className="text-gray-600 dark:text-gray-300 text-sm mb-6 line-clamp-3 leading-relaxed">
                {project.description}
              </p>

              {/* Tech Pills */}
              <div className="flex flex-wrap gap-2 mb-6">
                {project.tech.map((t, i) => (
                  <span key={i} className="sci-fi-badge">
                    {t}
                  </span>
                ))}
              </div>

              {/* Action Links */}
              <div className="flex gap-4 mt-auto pt-4 border-t border-gray-100 dark:border-white/5">
                {project.web_url && (
                  <button
                    onClick={() => window.open(project.web_url, "_blank")}
                    className="flex items-center gap-1.5 text-xs font-mono font-semibold text-gray-800 dark:text-white hover:text-nebula-purple dark:hover:text-starlight-cyan transition-colors cursor-pointer"
                  >
                    <ExternalLink className="w-4 h-4 text-nebula-purple dark:text-starlight-cyan" />
                    Live Demo
                  </button>
                )}
                <button
                  onClick={() => onRepoClick(project.repos)}
                  className="flex items-center gap-1.5 text-xs font-mono font-semibold text-gray-800 dark:text-white hover:text-nebula-purple dark:hover:text-starlight-cyan transition-colors cursor-pointer"
                >
                  <Github className="w-4 h-4" />
                  Source Code
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredProjects.length === 0 && (
        <div className="text-center py-20 sci-fi-card rounded-2xl">
          <Layers className="w-10 h-10 text-nebula-purple dark:text-starlight-cyan mx-auto mb-3 animate-pulse" />
          <h3 className="text-lg font-bold sci-fi-heading mb-1">
            {selectedYear === "2026"
              ? "2026 Operations In Progress"
              : "No Projects Found"}
          </h3>
          <p className="text-sm text-gray-500 max-w-md mx-auto">
            {selectedYear === "2026"
              ? "Classified engineering systems and deployments scheduled for 2026 are currently in active development."
              : "No operations recorded for the selected filter."}
          </p>
        </div>
      )}
    </>
  );
};
