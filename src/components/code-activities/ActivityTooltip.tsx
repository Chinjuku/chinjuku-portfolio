import React from "react";

interface HoveredCellData {
  date: string;
  count: number;
  x: number;
  y: number;
}

interface ActivityTooltipProps {
  cell: HoveredCellData | null;
}

export const ActivityTooltip: React.FC<ActivityTooltipProps> = ({ cell }) => {
  if (!cell) return null;

  return (
    <div
      style={{
        position: "fixed",
        left: `${cell.x}px`,
        top: `${cell.y - 10}px`,
        transform: "translate(-50%, -100%)",
      }}
      className="pointer-events-none z-50 animate-in fade-in zoom-in-95 duration-150"
    >
      <div className="bg-slate-900/95 dark:bg-[#070b14]/95 border border-cyan-500/50 rounded-xl px-3.5 py-2 shadow-[0_0_20px_rgba(6,182,212,0.4)] backdrop-blur-md text-center min-w-[160px]">
        <div className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider mb-0.5">
          {cell.count === 0
            ? "No Contributions"
            : `${cell.count} ${cell.count === 1 ? "Contribution" : "Contributions"}`}
        </div>
        <div className="text-[11px] font-mono text-slate-300 font-medium">
          {new Date(cell.date).toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </div>
        {/* Triangular Indicator */}
        <div className="w-2 h-2 bg-slate-900 dark:bg-[#070b14] border-r border-b border-cyan-500/50 rotate-45 mx-auto -mb-3 mt-1" />
      </div>
    </div>
  );
};
