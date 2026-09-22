import React from "react";
import { RotateCw, Github, ExternalLink } from "lucide-react";

interface ActivityHeaderProps {
  isRefreshing: boolean;
  onRefresh: () => void;
}

export const ActivityHeader: React.FC<ActivityHeaderProps> = ({
  isRefreshing,
  onRefresh,
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
      <div>
        <div className="activity-pill inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-xs font-mono text-cyan-600 dark:text-cyan-400 tracking-widest uppercase mb-3">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
          <span>LIVE TELEMETRY // COMMITS</span>
        </div>
        <h2 className="activity-title text-3xl sm:text-4xl md:text-5xl font-black sci-fi-heading tracking-tight mb-3">
          Code Activities
        </h2>
        <p className="activity-desc text-slate-600 dark:text-[#94a3b8] text-sm sm:text-base max-w-2xl leading-relaxed">
          Continuous mission logs, version control frequency, and GitHub
          contribution telemetry tracking repository operations across
          chronological milestones.
        </p>
      </div>

      {/* GitHub Link & Cache Refresh Pill */}
      <div className="activity-actions flex items-center gap-3 self-start md:self-auto flex-wrap">
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono bg-white dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10 shadow-sm transition-all cursor-pointer disabled:opacity-50"
          title="Force refresh GitHub data"
        >
          <RotateCw
            className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-cyan-400" : ""}`}
          />
          <span>{isRefreshing ? "Syncing..." : "Sync"}</span>
        </button>

        <a
          href="https://github.com/Chinjuku"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-semibold bg-slate-900 dark:bg-space-dark hover:bg-slate-800 text-white border border-cyan-500/30 hover:border-cyan-400 shadow-md shadow-cyan-500/10 hover:shadow-cyan-500/25 transition-all group"
        >
          <Github className="w-4 h-4 text-cyan-400 group-hover:rotate-12 transition-transform" />
          <span>@Chinjuku</span>
          <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </a>
      </div>
    </div>
  );
};
