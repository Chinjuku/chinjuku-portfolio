import React, { type RefObject } from "react";
import { Sparkles, RotateCw, Clock } from "lucide-react";
import {
  type ContributionDay,
  DAY_LABELS,
} from "../../constants/codeActivities";

interface CalendarGridData {
  weeks: (ContributionDay | null)[][];
  monthLabels: { month: string; weekIndex: number }[];
}

interface ActivityHeatmapProps {
  selectedYear: number;
  loading: boolean;
  calendarGrid: CalendarGridData;
  scrollContainerRef: RefObject<HTMLDivElement | null>;
  onCellHover: (
    cell: { date: string; count: number; x: number; y: number } | null,
  ) => void;
}

const getCellColor = (level: number, count: number) => {
  if (count === 0 || level === 0) {
    return "bg-slate-200 dark:bg-[#151c2c] border border-slate-300/60 dark:border-white/5";
  }
  if (level === 1) {
    return "bg-emerald-300 dark:bg-[#064e3b] border border-emerald-400/50 dark:border-emerald-600/40 shadow-[0_0_6px_rgba(5,150,105,0.25)]";
  }
  if (level === 2) {
    return "bg-emerald-400 dark:bg-[#059669] border border-emerald-500/60 dark:border-emerald-500/50 shadow-[0_0_8px_rgba(16,185,129,0.35)]";
  }
  if (level === 3) {
    return "bg-emerald-500 dark:bg-[#10b981] border border-emerald-600/60 dark:border-emerald-400/60 shadow-[0_0_10px_rgba(16,185,129,0.5)]";
  }
  return "bg-emerald-600 dark:bg-[#34d399] border border-emerald-700/70 dark:border-cyan-300/80 shadow-[0_0_12px_rgba(52,211,153,0.85)]";
};

export const ActivityHeatmap: React.FC<ActivityHeatmapProps> = ({
  selectedYear,
  loading,
  calendarGrid,
  scrollContainerRef,
  onCellHover,
}) => {
  return (
    <div className="activity-heatmap flex-1 p-6 sm:p-7 rounded-3xl sci-fi-glass border border-slate-200/80 dark:border-cyan-500/20 shadow-xl overflow-hidden relative">
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan-500 dark:text-cyan-400" />
          <span className="font-mono text-xs uppercase tracking-widest text-slate-700 dark:text-slate-200 font-bold">
            Annual Contribution Heatmap
          </span>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-2 text-[11px] font-mono text-slate-500 dark:text-[#94a3b8]">
          <span>Less</span>
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-[3px] bg-slate-200 dark:bg-[#151c2c] border border-slate-300/60 dark:border-white/5" />
            <span className="w-3 h-3 rounded-[3px] bg-emerald-300 dark:bg-[#064e3b]" />
            <span className="w-3 h-3 rounded-[3px] bg-emerald-400 dark:bg-[#059669]" />
            <span className="w-3 h-3 rounded-[3px] bg-emerald-500 dark:bg-[#10b981]" />
            <span className="w-3 h-3 rounded-[3px] bg-emerald-600 dark:bg-[#34d399] shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
          </div>
          <span>More</span>
        </div>
      </div>

      {/* Heatmap Matrix with Month Labels */}
      {loading ? (
        <div className="h-44 w-full flex flex-col items-center justify-center gap-3">
          <RotateCw className="w-6 h-6 text-cyan-400 animate-spin" />
          <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
            Decrypting {selectedYear} Commit Telemetry...
          </span>
        </div>
      ) : (
        <div
          ref={scrollContainerRef}
          className="overflow-x-auto pb-4 pt-1 select-none scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700"
        >
          <div className="inline-block min-w-full">
            {/* Month Headers */}
            <div className="flex text-[10px] font-mono text-slate-500 dark:text-[#94a3b8] mb-2 pl-8">
              {calendarGrid.monthLabels.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    width: `${Math.max(
                      28,
                      idx < calendarGrid.monthLabels.length - 1
                        ? (calendarGrid.monthLabels[idx + 1].weekIndex -
                            item.weekIndex) *
                            15.5
                        : 45,
                    )}px`,
                  }}
                  className="shrink-0 font-medium"
                >
                  {item.month}
                </div>
              ))}
            </div>

            {/* Grid with Day-of-Week Labels */}
            <div className="flex gap-2">
              {/* Day labels column (Sun - Sat) */}
              <div className="flex flex-col justify-between text-[9px] font-mono text-slate-400 dark:text-slate-500 pr-1 py-0.5 h-[105px]">
                {DAY_LABELS.map((d, idx) => (
                  <span key={idx} className="h-3 leading-3">
                    {d.label}
                  </span>
                ))}
              </div>

              {/* 53 Columns of Weeks */}
              <div className="flex gap-[3.5px]">
                {calendarGrid.weeks.map((week, weekIdx) => (
                  <div key={weekIdx} className="flex flex-col gap-[3.5px]">
                    {week.map((cell, dayIdx) => {
                      if (!cell) {
                        return (
                          <div
                            key={dayIdx}
                            className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-[3px] bg-transparent opacity-0 pointer-events-none"
                          />
                        );
                      }

                      const cellColor = getCellColor(cell.level, cell.count);

                      return (
                        <div
                          key={dayIdx}
                          onMouseEnter={(e) => {
                            const rect =
                              e.currentTarget.getBoundingClientRect();
                            onCellHover({
                              date: cell.date,
                              count: cell.count,
                              x: rect.left + rect.width / 2,
                              y: rect.top,
                            });
                          }}
                          onMouseLeave={() => onCellHover(null)}
                          className={`w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-[3px] ${cellColor} transition-transform hover:scale-150 hover:z-20 cursor-pointer`}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Status readout line */}
      <div className="mt-2 pt-3 border-t border-slate-200/60 dark:border-white/5 flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-[#94a3b8] flex-wrap gap-2">
        <span className="flex items-center gap-1.5">
          <Clock className="w-3 h-3 text-cyan-500" />
          <span>Cache-Control: 1-Hour Client-Side Storage</span>
        </span>
        <span>
          Active Year:{" "}
          <span className="font-bold text-slate-800 dark:text-slate-200">
            {selectedYear}
          </span>
        </span>
      </div>
    </div>
  );
};
