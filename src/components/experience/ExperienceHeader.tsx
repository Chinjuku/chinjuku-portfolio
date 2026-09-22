import React from "react";
import { Sparkles, Activity, Calendar } from "lucide-react";

interface ExperienceHeaderProps {
  totalCount: number;
  timelineSpan: string;
}

export const ExperienceHeader: React.FC<ExperienceHeaderProps> = ({
  totalCount,
  timelineSpan,
}) => {
  return (
    <div className="experience-header text-center mb-16 sm:mb-20">
      {/* Sci-Fi HUD Clearance Badge */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 dark:bg-starlight-cyan/10 border border-cyan-500/30 dark:border-starlight-cyan/30 text-xs font-mono text-cyan-700 dark:text-starlight-cyan uppercase tracking-widest mb-3 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
        <Sparkles className="w-3.5 h-3.5 text-starlight-cyan" />
        <span>MISSION HISTORY // CHRONOLOGICAL FLIGHT LOG</span>
      </div>

      <h2 className="text-3xl sm:text-4xl md:text-5xl font-black sci-fi-heading tracking-tight mb-3">
        Activities & Experiences
      </h2>
      <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed mb-6 font-sans">
        Chronological record of commercial development missions, enterprise
        internships, and academic engineering operations.
      </p>

      {/* Telemetry Status Readout Badge */}
      <div className="inline-flex items-center gap-4 bg-white/80 dark:bg-white/5 border border-gray-200/80 dark:border-white/10 px-5 py-2.5 rounded-2xl backdrop-blur-md shadow-sm">
        <div className="flex items-center gap-2">
          <Activity className="w-3.5 h-3.5 text-nebula-purple dark:text-starlight-cyan animate-pulse" />
          <span className="text-[11px] font-mono text-gray-500 dark:text-gray-400 uppercase">
            Operations:{" "}
            <span className="font-bold text-gray-900 dark:text-white">
              {totalCount} Logged
            </span>
          </span>
        </div>
        <div className="w-px h-4 bg-gray-200 dark:bg-white/10" />
        <div className="flex items-center gap-2">
          <Calendar className="w-3.5 h-3.5 text-purple-500 dark:text-nebula-glow" />
          <span className="text-[11px] font-mono text-gray-500 dark:text-gray-400 uppercase">
            Timeline:{" "}
            <span className="font-bold text-nebula-purple dark:text-starlight-cyan">
              {timelineSpan}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
};
