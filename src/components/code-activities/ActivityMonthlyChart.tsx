import React from "react";
import { TrendingUp } from "lucide-react";
import { MONTH_NAMES } from "../../constants/codeActivities";

interface ActivityMonthlyChartProps {
  selectedYear: number;
  monthlyTotals: number[];
  peakMonth: {
    index: number;
    name: string;
    count: number;
  };
}

export const ActivityMonthlyChart: React.FC<ActivityMonthlyChartProps> = ({
  selectedYear,
  monthlyTotals,
  peakMonth,
}) => {
  return (
    <div className="activity-chart p-6 sm:p-7 rounded-3xl sci-fi-card border border-slate-200/80 dark:border-white/10 relative overflow-hidden">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-purple-500 dark:text-nebula-purple" />
          <h3 className="font-mono text-xs uppercase tracking-widest text-slate-800 dark:text-slate-200 font-bold">
            Monthly Contribution Breakdown ({selectedYear})
          </h3>
        </div>
        <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
          Peak:{" "}
          <span className="font-bold text-cyan-600 dark:text-cyan-400">
            {peakMonth.name}
          </span>{" "}
          ({peakMonth.count} commits)
        </span>
      </div>

      {/* 12-Month Mini Distribution Bars */}
      <div className="grid grid-cols-6 sm:grid-cols-12 gap-2 sm:gap-3 items-end h-32 pb-4">
        {monthlyTotals.map((count, idx) => {
          const isPeak = idx === peakMonth.index && count > 0;
          const maxVal = Math.max(1, peakMonth.count);
          const heightPercent =
            count > 0 ? Math.max(12, Math.round((count / maxVal) * 100)) : 6;

          return (
            <div
              key={idx}
              className="flex flex-col items-center gap-2 h-full justify-end group"
            >
              {/* Tooltip on hover */}
              <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-mono font-bold text-cyan-600 dark:text-cyan-400 whitespace-nowrap">
                {count}
              </div>

              {/* The Bar */}
              <div className="w-full bg-slate-100 dark:bg-white/5 rounded-t-lg h-24 flex items-end p-0.5 overflow-hidden">
                <div
                  style={{ height: `${heightPercent}%` }}
                  className={`w-full rounded-t-md transition-all duration-500 ${
                    isPeak
                      ? "bg-gradient-to-t from-purple-600 to-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.8)]"
                      : count > 0
                        ? "bg-gradient-to-t from-emerald-600 to-teal-400 dark:from-emerald-700 dark:to-teal-400"
                        : "bg-slate-300 dark:bg-slate-800"
                  }`}
                />
              </div>

              {/* Month Label */}
              <span
                className={`text-[10px] font-mono uppercase ${
                  isPeak
                    ? "font-bold text-cyan-600 dark:text-cyan-400"
                    : "text-slate-500 dark:text-[#94a3b8]"
                }`}
              >
                {MONTH_NAMES[idx]}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
