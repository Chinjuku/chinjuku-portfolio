import React from "react";
import { Activity, Calendar, Flame, Award, TrendingUp } from "lucide-react";

interface ActivityStatsProps {
  selectedYear: number;
  loading: boolean;
  stats: {
    totalCommits: number;
    activeDays: number;
    maxDayStreak: number;
    peakMonth: {
      name: string;
      count: number;
    };
  };
}

export const ActivityStats: React.FC<ActivityStatsProps> = ({
  selectedYear,
  loading,
  stats,
}) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {/* Card 1: Total Commits */}
      <div className="activity-stat-card p-5 rounded-2xl sci-fi-card relative overflow-hidden group">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-mono text-slate-500 dark:text-[#94a3b8] uppercase tracking-wider">
            {selectedYear} Contributions
          </span>
          <Activity className="w-4 h-4 text-cyan-500 dark:text-starlight-cyan group-hover:scale-110 transition-transform" />
        </div>
        <div className="text-2xl sm:text-3xl font-black sci-fi-heading font-mono">
          {loading ? (
            <div className="h-8 w-20 bg-slate-200 dark:bg-white/10 rounded animate-pulse" />
          ) : (
            stats.totalCommits.toLocaleString()
          )}
        </div>
        <span className="text-[11px] font-mono text-cyan-600 dark:text-cyan-400 mt-1 block">
          // Verified Commits & PRs
        </span>
      </div>

      {/* Card 2: Active Days */}
      <div className="activity-stat-card p-5 rounded-2xl sci-fi-card relative overflow-hidden group">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-mono text-slate-500 dark:text-[#94a3b8] uppercase tracking-wider">
            Active Days
          </span>
          <Calendar className="w-4 h-4 text-purple-500 dark:text-nebula-purple group-hover:scale-110 transition-transform" />
        </div>
        <div className="text-2xl sm:text-3xl font-black sci-fi-heading font-mono">
          {loading ? (
            <div className="h-8 w-20 bg-slate-200 dark:bg-white/10 rounded animate-pulse" />
          ) : (
            stats.activeDays
          )}
        </div>
        <span className="text-[11px] font-mono text-purple-600 dark:text-nebula-glow mt-1 block">
          // Days with Code Activity
        </span>
      </div>

      {/* Card 3: Max Day Streak */}
      <div className="activity-stat-card p-5 rounded-2xl sci-fi-card relative overflow-hidden group">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-mono text-slate-500 dark:text-[#94a3b8] uppercase tracking-wider">
            Longest Streak
          </span>
          <Flame className="w-4 h-4 text-orange-500 group-hover:scale-110 transition-transform" />
        </div>
        <div className="text-2xl sm:text-3xl font-black sci-fi-heading font-mono">
          {loading ? (
            <div className="h-8 w-20 bg-slate-200 dark:bg-white/10 rounded animate-pulse" />
          ) : (
            `${stats.maxDayStreak} Days`
          )}
        </div>
        <span className="text-[11px] font-mono text-orange-600 dark:text-orange-400 mt-1 block">
          // Consecutive Workload
        </span>
      </div>

      {/* Card 4: Peak Activity Month Highlight Badge */}
      <div className="activity-stat-card p-5 rounded-2xl bg-cyan-500/10 dark:bg-cyan-950/30 border border-cyan-500/30 dark:border-cyan-400/40 relative overflow-hidden shadow-[0_0_25px_rgba(6,182,212,0.15)] group">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-mono text-cyan-700 dark:text-cyan-300 uppercase tracking-wider flex items-center gap-1 font-bold">
            <Award className="w-3.5 h-3.5 text-cyan-500" />
            Peak Activity Month
          </span>
          <TrendingUp className="w-4 h-4 text-cyan-500 animate-pulse" />
        </div>
        <div className="text-xl sm:text-2xl font-black sci-fi-heading font-mono text-cyan-600 dark:text-cyan-300">
          {loading ? (
            <div className="h-8 w-24 bg-slate-200 dark:bg-white/10 rounded animate-pulse" />
          ) : stats.peakMonth.count > 0 ? (
            stats.peakMonth.name
          ) : (
            "In Progress"
          )}
        </div>
        <span className="text-[11px] font-mono text-slate-600 dark:text-slate-300 mt-1 block">
          {loading
            ? "..."
            : stats.peakMonth.count > 0
              ? `${stats.peakMonth.count} commits logged`
              : "Active cycle underway"}
        </span>
      </div>
    </div>
  );
};
