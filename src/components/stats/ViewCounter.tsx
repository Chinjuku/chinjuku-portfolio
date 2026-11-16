import React from "react";
import { useSiteStats } from "./context";
import { LiveNumber } from "./LiveNumber";

/** Footer line: pulsing live dot + total visitors. Hidden when the stats API is unavailable. */
export const ViewCounter: React.FC<{ className?: string }> = ({ className = "" }) => {
  const { stats } = useSiteStats();
  if (!stats) return null;
  return (
    <p className={`flex items-center gap-2 ${className}`}>
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60 motion-reduce:animate-none" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
      </span>
      <LiveNumber value={stats.views} className="font-semibold text-gray-900 dark:text-white" />
      <span className="tracking-wider">VISITORS</span>
    </p>
  );
};
