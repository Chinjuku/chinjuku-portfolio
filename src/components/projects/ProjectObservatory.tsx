import React, { type RefObject, type CSSProperties } from "react";
import { Crosshair, ExternalLink, Github, Radio } from "lucide-react";
import type { Project } from "../../constants/projects";

interface ProjectObservatoryProps {
  activeProject: Project;
  activeIndex: number;
  projects: Project[];
  orbitRef: RefObject<HTMLDivElement | null>;
  getPlanetStyle: (index: number) => CSSProperties;
  onScrollToProject: (index: number) => void;
  onRepoClick: (repos: string | string[]) => void;
}

export const ProjectObservatory: React.FC<ProjectObservatoryProps> = ({
  activeProject,
  activeIndex,
  projects,
  orbitRef,
  getPlanetStyle,
  onScrollToProject,
  onRepoClick,
}) => {
  return (
    <div className="relative h-[240px] sm:h-[270px] md:h-[300px] lg:h-full flex items-center justify-center order-1 lg:order-2 w-full my-auto lg:my-0 pointer-events-none">
      {/* Dynamic SVG Telemetry Callout (Desktop/Large Screen) */}
      <div className="absolute inset-0 pointer-events-none z-15 hidden lg:block overflow-visible">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient
              id="tacticalLinkGrad"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.9" />
              <stop offset="60%" stopColor="#8b5cf6" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.15" />
            </linearGradient>
          </defs>
          {/* Animated telemetry connection line from preview card to 9 o'clock active planet */}
          <line
            x1="38%"
            y1="50%"
            x2="66%"
            y2="50%"
            stroke="url(#tacticalLinkGrad)"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            className="animate-pulse"
          />
          {/* Contact reticle ring */}
          <circle
            cx="52%"
            cy="50%"
            r="3.5"
            fill="#06b6d4"
            className="animate-ping"
          />
          <circle cx="52%" cy="50%" r="2" fill="#06b6d4" />
          {/* In-line telemetry label */}
          <text
            x="52%"
            y="47%"
            fill="#06b6d4"
            fontSize="9"
            fontFamily="monospace"
            textAnchor="middle"
            className="opacity-80 tracking-widest uppercase font-semibold"
          >
            LOCK: SYS.0{activeProject.id} // 180° AZ
          </text>
        </svg>
      </div>

      {/* Floating Holographic Tactical Observatory Terminal (Preview Card) */}
      <div className="hidden sm:block absolute left-2 sm:left-4 md:left-6 lg:left-[-40px] xl:left-[-70px] top-1/2 -translate-y-1/2 w-full max-w-[340px] sm:max-w-[380px] md:max-w-[420px] lg:max-w-[500px] xl:max-w-[580px] aspect-video z-20 pointer-events-auto">
        <div className="relative group select-none transition-all duration-300 h-full">
          {/* Ambient Backlight Glow matching active project */}
          <div
            className={`absolute -inset-4 sm:-inset-6 rounded-3xl bg-gradient-to-r ${activeProject.color} opacity-20 dark:opacity-35 blur-2xl transition-all duration-700 pointer-events-none`}
          />

          {/* Tactical Chassis Frame */}
          <div className="relative h-full flex flex-col justify-between rounded-2xl md:rounded-3xl border border-cyan-500/40 dark:border-cyan-400/35 bg-white/95 dark:bg-[#0b0e1a]/95 backdrop-blur-2xl p-2 sm:p-2.5 md:p-3 shadow-[0_20px_50px_rgba(0,0,0,0.15)] dark:shadow-[0_25px_65px_rgba(0,0,0,0.85)] ring-1 ring-cyan-500/20 overflow-hidden">
            {/* 4 Corner Cybernetic Reticle Brackets */}
            <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-cyan-400 pointer-events-none" />
            <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-cyan-400 pointer-events-none" />
            <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-cyan-400 pointer-events-none" />
            <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-cyan-400 pointer-events-none" />

            {/* Top Tactical Header Bar */}
            <div className="flex items-center justify-between gap-2 px-1 sm:px-2 pb-1 sm:pb-1.5 border-b border-gray-200/80 dark:border-white/10">
              <div className="flex items-center gap-1.5 min-w-0">
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                </div>
                <div className="flex items-center gap-1 font-mono text-[10px] sm:text-xs font-semibold text-gray-700 dark:text-gray-200 truncate">
                  <span className="text-nebula-purple dark:text-starlight-cyan whitespace-nowrap">
                    OBSERVATORY
                  </span>
                  <span className="text-gray-400 dark:text-gray-500">//</span>
                  <span className="truncate">
                    FEED.0{activeProject.id} {activeProject.title}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:gap-2.5 font-mono text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 shrink-0">
                {/* Telemetry Signal Bars */}
                <div
                  className="flex items-end gap-0.5 h-2.5 sm:h-3"
                  title="Signal Integrity: 99.4%"
                >
                  <span className="w-0.5 sm:w-1 h-1 sm:h-1.5 rounded-sm bg-cyan-400" />
                  <span className="w-0.5 sm:w-1 h-1.5 sm:h-2 rounded-sm bg-cyan-400" />
                  <span className="w-0.5 sm:w-1 h-2 sm:h-2.5 rounded-sm bg-cyan-400" />
                  <span className="w-0.5 sm:w-1 h-2.5 sm:h-3 rounded-sm bg-cyan-400 animate-pulse" />
                </div>
                <span className="hidden sm:inline text-[10px] text-gray-400 font-mono">
                  SIG: 99.4%
                </span>
                <span className="text-[10px] font-mono px-1.5 sm:px-2 py-0.5 rounded-full bg-cyan-400/10 border border-cyan-400/30 text-cyan-300 font-semibold">
                  LOCKED
                </span>
              </div>
            </div>

            {/* Viewport Screen */}
            <div className="relative flex-1 rounded-xl sm:rounded-2xl overflow-hidden bg-black/90 my-1">
              {projects.map((project, index) => (
                <div
                  key={project.id}
                  className={`absolute inset-0 transition-all duration-700 ease-out ${
                    index === activeIndex
                      ? "opacity-100 scale-100 translate-x-0"
                      : "opacity-0 scale-95 translate-x-8 pointer-events-none"
                  }`}
                >
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover opacity-90 dark:opacity-85 group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
                </div>
              ))}

              {/* CRT Scanline Overlay */}
              <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.35)_50%)] bg-[length:100%_4px] opacity-40 dark:opacity-55" />

              {/* Center Crosshair Target Reticle */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="relative flex items-center justify-center w-12 h-12">
                  <Crosshair className="w-7 h-7 text-cyan-400/50 group-hover:text-cyan-400 group-hover:scale-110 transition-all duration-300" />
                  <div className="absolute inset-0 rounded-full border border-dashed border-cyan-400/30 animate-[spin_20s_linear_infinite]" />
                </div>
              </div>

              {/* Viewport Corner Brackets */}
              <div className="absolute top-2 left-2 w-2.5 h-2.5 border-t border-l border-cyan-300/60 pointer-events-none" />
              <div className="absolute top-2 right-2 w-2.5 h-2.5 border-t border-r border-cyan-300/60 pointer-events-none" />
              <div className="absolute bottom-2 left-2 w-2.5 h-2.5 border-b border-l border-cyan-300/60 pointer-events-none" />
              <div className="absolute bottom-2 right-2 w-2.5 h-2.5 border-b border-r border-cyan-300/60 pointer-events-none" />

              {/* Bottom In-Screen Status Bar */}
              <div className="absolute bottom-1.5 left-1.5 right-1.5 flex items-center justify-between pointer-events-none px-2 py-0.5 rounded-lg bg-black/60 backdrop-blur-sm border border-white/10">
                <div className="flex items-center gap-1 font-mono text-[9px] sm:text-[10px] text-gray-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  <span className="text-cyan-300 font-bold">
                    {activeProject.role}
                  </span>
                </div>
                <div className="font-mono text-[9px] sm:text-[10px] text-gray-400">
                  {activeProject.finished_date
                    ? `DATE: ${activeProject.finished_date}`
                    : "STATUS: DEPLOYED"}
                </div>
              </div>
            </div>

            {/* Bottom Frame Controls */}
            <div className="flex items-center justify-between pt-1 px-1 text-[9px] sm:text-[10px] font-mono text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <Radio className="w-3 h-3 text-cyan-400 animate-pulse" />
                <span className="hidden sm:inline">
                  RADAR TELEMETRY // 180° AZ
                </span>
                <span className="sm:hidden">TELEMETRY</span>
              </div>

              <div className="flex items-center gap-1.5">
                {activeProject.web_url && (
                  <button
                    type="button"
                    onClick={() => window.open(activeProject.web_url, "_blank")}
                    className="flex items-center gap-1 px-2 py-0.5 rounded bg-cyan-500/15 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-400/30 transition-all cursor-pointer"
                  >
                    <ExternalLink className="w-2.5 h-2.5" />
                    <span>Live Demo</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => onRepoClick(activeProject.repos)}
                  className="flex items-center gap-1 px-2 py-0.5 rounded bg-black/10 dark:bg-white/5 hover:bg-white/10 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-white/15 transition-all cursor-pointer"
                >
                  <Github className="w-2.5 h-2.5" />
                  <span>Repo</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* The Orbit Track (Tactical Radar Observatory) */}
      <div
        ref={orbitRef}
        className="absolute right-[-100px] sm:right-[-120px] md:right-[-140px] lg:right-[-320px] xl:right-[-420px] w-[260px] h-[260px] sm:w-[320px] sm:h-[320px] md:w-[420px] md:h-[420px] lg:w-[720px] lg:h-[720px] xl:w-[880px] xl:h-[880px] rounded-full border border-gray-200/80 dark:border-cyan-500/20 flex items-center justify-center transition-all duration-300 pointer-events-none"
      >
        {/* Rotary Radar Sweep Beam */}
        <div
          className="absolute inset-0 rounded-full pointer-events-none opacity-40 dark:opacity-60"
          style={{
            background:
              "conic-gradient(from 0deg, rgba(6, 182, 212, 0.22) 0deg, rgba(6, 182, 212, 0) 55deg)",
            animation: "spin 10s linear infinite",
          }}
        />

        {/* Concentric Dashed Compass Ring */}
        <div className="absolute w-[82%] h-[82%] rounded-full border border-dashed border-gray-300/70 dark:border-white/10 animate-[spin_120s_linear_infinite]" />

        {/* Inner Radar Range Ring */}
        <div className="absolute w-[54%] h-[54%] rounded-full border border-cyan-500/20 dark:border-cyan-400/20 animate-[spin_60s_linear_infinite_reverse]" />

        {/* Cardinal Coordinate Markings (Azimuth 0°, 90°, 180°, 270°) */}
        <div className="absolute left-2 font-mono text-[9px] sm:text-[10px] text-cyan-400/80 tracking-tighter uppercase font-bold">
          180° LOCK
        </div>
        <div className="absolute top-2 font-mono text-[9px] sm:text-[10px] text-gray-400 dark:text-gray-500">
          090°
        </div>
        <div className="absolute right-2 font-mono text-[9px] sm:text-[10px] text-gray-400 dark:text-gray-500">
          000°
        </div>
        <div className="absolute bottom-2 font-mono text-[9px] sm:text-[10px] text-gray-400 dark:text-gray-500">
          270°
        </div>

        {/* Central Pulsar Observatory Core */}
        <div className="relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-cyan-500/10 dark:bg-cyan-400/10 border border-cyan-400/40 backdrop-blur-sm flex flex-col items-center justify-center">
          <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-cyan-400 animate-ping opacity-60" />
          <div className="absolute w-2 h-2 rounded-full bg-cyan-400" />
          <span className="absolute -bottom-4 font-mono text-[8px] text-cyan-400/70 tracking-widest hidden md:inline">
            OBS // CORE
          </span>
        </div>

        {/* Planets (Tactical Nodes with Saturn 3D Rings & Atmospheric Halos) */}
        {projects.map((project, index) => {
          const isActive = index === activeIndex;
          return (
            <button
              key={project.id}
              type="button"
              onClick={() => onScrollToProject(index)}
              className={`absolute w-8 h-8 sm:w-10 sm:h-10 md:w-13 md:h-13 lg:w-16 lg:h-16 rounded-full shadow-[0_0_30px_rgba(0,0,0,0.5)] transition-all duration-500 flex items-center justify-center pointer-events-auto cursor-pointer group focus:outline-none ${
                isActive
                  ? "scale-125 z-20"
                  : "scale-80 z-10 opacity-60 hover:opacity-100 hover:scale-95"
              }`}
              style={getPlanetStyle(index)}
              aria-label={`Target project 0${project.id}: ${project.title}`}
            >
              {/* Saturn-Style 3D Orbital Ring */}
              <div
                className={`absolute -inset-2 sm:-inset-2.5 md:-inset-3 rounded-full border pointer-events-none transition-all duration-500 ${
                  isActive
                    ? "border-cyan-400/70 shadow-[0_0_12px_rgba(6,182,212,0.6)]"
                    : "border-white/25 dark:border-white/10 group-hover:border-cyan-400/40"
                }`}
                style={{
                  transform: "rotateX(74deg) rotateY(-20deg)",
                }}
              />

              {/* Active Atmospheric Corona & Pulse Beacon */}
              {isActive && (
                <>
                  <div className="absolute -inset-3 rounded-full bg-cyan-400/25 blur-md animate-pulse pointer-events-none" />
                  <div className="absolute -inset-2 rounded-full border border-cyan-400/60 animate-ping opacity-40 pointer-events-none" />
                  <div className="absolute -inset-3.5 rounded-full border border-dashed border-cyan-400/70 animate-[spin_12s_linear_infinite] pointer-events-none" />
                </>
              )}

              {/* Planet Sphere Visual (Gradient) */}
              <div
                className={`w-full h-full rounded-full bg-gradient-to-br ${
                  project.color
                } relative overflow-hidden shadow-inner ring-1 ${
                  isActive
                    ? "ring-white/90 ring-offset-2 ring-offset-black"
                    : "ring-white/20"
                }`}
              >
                <div className="absolute inset-0 bg-white/30 rounded-full blur-sm opacity-50" />
                <div className="absolute -inset-1 bg-gradient-to-tr from-transparent to-white/40 opacity-0 group-hover:opacity-100 transition-opacity" />

                {/* Centered Node Number */}
                <div className="absolute inset-0 flex items-center justify-center font-mono text-[9px] sm:text-[10px] md:text-xs font-bold text-white drop-shadow-md">
                  0{project.id}
                </div>
              </div>

              {/* Planet Label Tooltip */}
              <div
                className={`absolute -bottom-7 font-mono text-[10px] sm:text-[11px] whitespace-nowrap px-2 py-0.5 rounded-full bg-black/85 backdrop-blur-md border border-cyan-400/40 text-cyan-300 shadow-md transition-all pointer-events-none ${
                  isActive
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0"
                }`}
              >
                {project.title}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
