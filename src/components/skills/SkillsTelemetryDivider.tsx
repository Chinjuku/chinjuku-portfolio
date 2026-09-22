import React from "react";

interface SkillsTelemetryDividerProps {
  totalSkillCount: number;
}

export const SkillsTelemetryDivider: React.FC<SkillsTelemetryDividerProps> = ({
  totalSkillCount,
}) => {
  return (
    <div className="skills-divider flex items-center justify-center gap-3 mb-8 sm:mb-10 text-center">
      <div className="h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-white/10 to-transparent flex-1 max-w-xs" />
      <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/70 dark:bg-white/5 border border-gray-200/80 dark:border-white/10 shadow-sm backdrop-blur-sm">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span className="text-[10px] sm:text-xs font-mono uppercase tracking-widest text-gray-600 dark:text-gray-400">
          Core Architecture Domains &bull; {totalSkillCount} Active Nodes
        </span>
      </div>
      <div className="h-px bg-gradient-to-l from-transparent via-gray-300 dark:via-white/10 to-transparent flex-1 max-w-xs" />
    </div>
  );
};
