import React from "react";
import { Activity, Calendar } from "lucide-react";

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
      <p className="font-mono text-[11px] tracking-[0.3em] text-core-icy uppercase mb-4">Experience</p>

      <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold sci-fi-heading tracking-[-0.03em] tracking-tight mb-3">
        Where I've worked
      </h2>
      <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed mb-6 font-sans">
        Internships, part-time roles and the university events I built for.
      </p>

      {/* Telemetry Status Readout Badge */}
      <div className="inline-flex items-center gap-4 bg-white/80 dark:bg-white/5 border border-gray-200/80 dark:border-white/10 px-5 py-2.5 rounded-2xl backdrop-blur-md shadow-sm">
        <div className="flex items-center gap-2">
          <Activity className="w-3.5 h-3.5 text-nebula-purple dark:text-starlight-cyan animate-pulse" />
          <span className="text-[11px] font-mono text-gray-500 dark:text-gray-400 uppercase">
            Roles:{" "}
            <span className="font-bold text-gray-900 dark:text-white">
              {totalCount}
            </span>
          </span>
        </div>
        <div className="w-px h-4 bg-gray-200 dark:bg-white/10" />
        <div className="flex items-center gap-2">
          <Calendar className="w-3.5 h-3.5 text-purple-500 dark:text-nebula-glow" />
          <span className="text-[11px] font-mono text-gray-500 dark:text-gray-400 uppercase">
            Years:{" "}
            <span className="font-bold text-nebula-purple dark:text-starlight-cyan">
              {timelineSpan}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
};
