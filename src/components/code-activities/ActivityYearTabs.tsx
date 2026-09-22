import React from "react";
import { YEARS } from "../../constants/codeActivities";

interface ActivityYearTabsProps {
  selectedYear: number;
  onSelectYear: (year: number) => void;
}

export const ActivityYearTabs: React.FC<ActivityYearTabsProps> = ({
  selectedYear,
  onSelectYear,
}) => {
  return (
    <div className="activity-year-tabs lg:w-48 shrink-0 flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0">
      <span className="text-xs font-mono uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-1 hidden lg:block font-bold">
        // Select Year
      </span>
      {YEARS.map((year) => {
        const isSelected = selectedYear === year;
        return (
          <button
            key={year}
            onClick={() => onSelectYear(year)}
            className={`px-4 py-3 rounded-2xl font-mono text-xs font-bold transition-all duration-300 flex items-center justify-between gap-3 cursor-pointer shrink-0 lg:shrink ${
              isSelected
                ? "bg-gradient-to-r from-purple-600 to-cyan-600 text-white shadow-lg shadow-cyan-500/25 border border-cyan-400/40 scale-[1.02]"
                : "sci-fi-card text-slate-700 dark:text-slate-300 hover:text-cyan-500 dark:hover:text-cyan-400 hover:border-cyan-500/40"
            }`}
          >
            <span>{year}</span>
            {isSelected ? (
              <span className="w-2 h-2 rounded-full bg-cyan-300 animate-ping" />
            ) : (
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-normal">
                Log
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
