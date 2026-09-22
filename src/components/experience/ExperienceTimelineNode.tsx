import React from "react";

interface ExperienceTimelineNodeProps {
  index: number;
}

export const ExperienceTimelineNode: React.FC<ExperienceTimelineNodeProps> = ({
  index,
}) => {
  const nodeNumber = String(index + 1).padStart(2, "0");

  return (
    <div className="experience-node relative flex items-center justify-center shrink-0 z-20">
      {/* Outer Glow Halo */}
      <div className="absolute -inset-2 rounded-full bg-cyan-500/20 dark:bg-starlight-cyan/25 blur-md pointer-events-none" />

      {/* Rotating Outer Gyro Ring */}
      <div className="absolute w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-dashed border-cyan-500/40 dark:border-starlight-cyan/50 animate-[spin_20s_linear_infinite] pointer-events-none" />

      {/* Pulsing Atmosphere Ripple */}
      <div className="absolute w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-nebula-purple/40 dark:border-starlight-cyan/40 animate-ping opacity-25 pointer-events-none" />

      {/* Central Cyber Node Core */}
      <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white dark:bg-[#0b0e1a] border-2 border-nebula-purple dark:border-starlight-cyan shadow-[0_0_15px_rgba(6,182,212,0.6)] flex items-center justify-center relative">
        <span className="font-mono text-[10px] sm:text-[11px] font-black text-nebula-purple dark:text-starlight-cyan">
          {nodeNumber}
        </span>
      </div>
    </div>
  );
};
