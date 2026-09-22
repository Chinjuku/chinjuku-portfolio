import React from "react";
import { Terminal, ShieldCheck, Cpu } from "lucide-react";
import type { Experience } from "../../constants/experiences";

interface ExperienceTelemetrySideProps {
  experience: Experience;
  index: number;
  isEven: boolean; // true = card is left, telemetry is right; false = card is right, telemetry is left
}

export const ExperienceTelemetrySide: React.FC<ExperienceTelemetrySideProps> = ({
  experience,
  index,
  isEven,
}) => {
  const missionYear =
    new Date(experience.finished_date).getFullYear() ||
    experience.period.split(" ").pop() ||
    "2025";
  const missionCode = `EXP-0${index + 1}`;

  return (
    <div
      className={`experience-telemetry hidden md:flex relative flex-col justify-center ${
        isEven ? "items-start pl-6 lg:pl-10" : "items-end pr-6 lg:pr-10"
      } w-full py-4 pointer-events-auto select-none`}
    >
      {/* Directional Connector Dash to Central Node */}
      <div
        className={`absolute top-1/2 -translate-y-1/2 w-8 h-[1px] bg-gradient-to-r ${
          isEven
            ? "left-0 from-starlight-cyan/60 to-transparent"
            : "right-0 from-transparent to-nebula-purple/60"
        } pointer-events-none`}
      />

      {/* Background Giant Stencil Year Watermark */}
      <div
        className={`absolute top-1/2 -translate-y-1/2 font-mono font-black text-6xl lg:text-7xl tracking-tighter opacity-10 dark:opacity-15 text-slate-400 dark:text-cyan-400 pointer-events-none transition-transform duration-500 group-hover:scale-105 ${
          isEven ? "left-6 lg:left-10" : "right-6 lg:right-10"
        }`}
      >
        {missionYear}
      </div>

      {/* Main Telemetry Box */}
      <div
        className={`relative z-10 flex flex-col ${
          isEven ? "items-start text-left" : "items-end text-right"
        } max-w-sm`}
      >
        {/* Top Telemetry Header Pill */}
        <div
          className={`flex items-center gap-2 mb-2 ${
            isEven ? "flex-row" : "flex-row-reverse"
          }`}
        >
          <span className="font-mono text-[11px] font-bold tracking-wider px-2 py-0.5 rounded-md bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300">
            {missionCode}
          </span>

          <div className="flex items-center gap-1.5 text-[10px] font-mono text-cyan-600 dark:text-starlight-cyan">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
            <span>ORBIT LOGGED</span>
          </div>
        </div>

        {/* Tactical Mission Milestone Title */}
        <div className="font-mono text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-1 flex items-center gap-1.5">
          {isEven ? (
            <>
              <Terminal className="w-3.5 h-3.5 text-nebula-purple dark:text-starlight-cyan" />
              <span>STATION DEPLOYMENT</span>
            </>
          ) : (
            <>
              <span>STATION DEPLOYMENT</span>
              <Terminal className="w-3.5 h-3.5 text-nebula-purple dark:text-starlight-cyan" />
            </>
          )}
        </div>

        <div className="text-sm font-bold font-sans text-slate-800 dark:text-slate-200 mb-2">
          {experience.company}
        </div>

        {/* Live Audio / Frequency Signal Waveform Simulator */}
        <div
          className={`flex items-center gap-1 p-2 rounded-xl bg-gray-100/70 dark:bg-white/[0.03] border border-gray-200/70 dark:border-white/5 backdrop-blur-sm mb-3 ${
            isEven ? "flex-row" : "flex-row-reverse"
          }`}
        >
          <div className="flex items-center gap-0.5 h-4 px-1">
            <span className="w-0.5 h-2.5 bg-cyan-500 animate-pulse rounded-full" />
            <span className="w-0.5 h-4 bg-nebula-purple animate-pulse delay-75 rounded-full" />
            <span className="w-0.5 h-2 bg-starlight-blue animate-pulse delay-150 rounded-full" />
            <span className="w-0.5 h-3.5 bg-cyan-400 animate-pulse delay-100 rounded-full" />
            <span className="w-0.5 h-1.5 bg-purple-400 animate-pulse delay-200 rounded-full" />
          </div>
          <span className="font-mono text-[10px] text-gray-500 dark:text-gray-400 tracking-tighter">
            TELEMETRY // SYNCED
          </span>
        </div>

        {/* Telemetry Metrics Badges */}
        <div
          className={`flex flex-wrap gap-2 ${
            isEven ? "justify-start" : "justify-end"
          }`}
        >
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/60 dark:bg-black/30 border border-gray-200/80 dark:border-white/10 text-[11px] font-mono text-gray-600 dark:text-gray-300 shadow-sm">
            <ShieldCheck className="w-3 h-3 text-emerald-500" />
            <span>VERIFIED ARCHIVE</span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/60 dark:bg-black/30 border border-gray-200/80 dark:border-white/10 text-[11px] font-mono text-gray-600 dark:text-gray-300 shadow-sm">
            <Cpu className="w-3 h-3 text-nebula-purple dark:text-starlight-cyan" />
            <span>{experience.tags.length} MODULES</span>
          </div>
        </div>
      </div>
    </div>
  );
};
