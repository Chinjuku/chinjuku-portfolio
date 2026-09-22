import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowLeft, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

gsap.registerPlugin(ScrollTrigger);

interface AllProjectsHeaderProps {
  totalProjects: number;
  years: number[];
}

export const AllProjectsHeader: React.FC<AllProjectsHeaderProps> = ({
  totalProjects,
  years,
}) => {
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: headerRef.current,
          start: "top 85%",
          toggleActions: "restart none restart none",
        },
      });

      tl.fromTo(
        ".archive-nav",
        { x: -20, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.4, ease: "power2.out" },
      )
        .fromTo(
          ".archive-badge",
          { y: -10, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.4, ease: "power3.out" },
          "-=0.2",
        )
        .fromTo(
          ".archive-title",
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, ease: "power3.out" },
          "-=0.25",
        )
        .fromTo(
          ".archive-desc",
          { y: 15, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.45, ease: "power2.out" },
          "-=0.25",
        )
        .fromTo(
          ".archive-stats",
          { scale: 0.9, opacity: 0, x: 20 },
          { scale: 1, opacity: 1, x: 0, duration: 0.5, ease: "back.out(1.2)" },
          "-=0.35",
        );
    }, headerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={headerRef} className="mb-10 sm:mb-12">
      <Link
        to="/"
        className="archive-nav inline-flex items-center gap-2 text-nebula-purple dark:text-starlight-cyan hover:underline mb-4 sm:mb-6 font-mono text-xs sm:text-sm uppercase tracking-wider group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span>Return to Mission Control</span>
      </Link>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="archive-badge inline-flex items-center gap-2 px-3 py-1 rounded-full bg-nebula-purple/10 dark:bg-starlight-cyan/10 border border-nebula-purple/30 dark:border-starlight-cyan/30 text-xs font-mono text-nebula-purple dark:text-starlight-cyan uppercase tracking-widest mb-2.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>CENTRAL LOGS // CLASSIFIED OPERATIONS</span>
          </div>
          <h1 className="archive-title text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black sci-fi-heading mb-3 tracking-tight">
            Project Archives
          </h1>
          <p className="archive-desc text-gray-600 dark:text-gray-400 text-sm sm:text-base max-w-2xl leading-relaxed">
            Comprehensive catalog of production deployments, architectural
            prototypes, and engineering systems.
          </p>
        </div>

        {/* Aggregate Quick Stats Badge */}
        <div className="archive-stats flex items-center gap-4 bg-white/70 dark:bg-white/5 border border-gray-200/80 dark:border-white/10 px-5 py-3 rounded-2xl backdrop-blur-md shadow-sm self-start md:self-auto">
          <div>
            <span className="text-[11px] font-mono text-gray-500 dark:text-gray-400 uppercase block">
              Total Operations
            </span>
            <span className="text-lg sm:text-xl font-black text-slate-900 dark:text-white font-mono">
              {totalProjects}
            </span>
          </div>
          <div className="w-px h-8 bg-gray-200 dark:bg-white/10" />
          <div>
            <span className="text-[11px] font-mono text-gray-500 dark:text-gray-400 uppercase block">
              Timeline Span
            </span>
            <span className="text-lg sm:text-xl font-black text-nebula-purple dark:text-starlight-cyan font-mono">
              {years[years.length - 1]} - {years[0]}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
