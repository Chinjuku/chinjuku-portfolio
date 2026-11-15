import React from "react";
import { FULL_MONTH_NAMES, YEARS } from "../../constants/codeActivities";
import { CountUp } from "../motion";

export interface ActivityInsightStats {
  totalCommits: number;
  activeDays: number;
  maxDayStreak: number;
  peakDay: { date: string; count: number };
  monthlyTotals: number[];
  monthActiveDays: number[];
  peakMonth: { index: number; name: string; count: number };
  favoriteWeekday: string;
}

interface ActivityInsightsProps {
  year: number;
  onSelectYear: (y: number) => void;
  stats: ActivityInsightStats;
  hoverMonth: number | null;
  loading: boolean;
}

const fmtDay = (iso: string) =>
  iso && iso !== "-"
    ? new Date(iso + "T00:00:00Z").toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" })
    : "—";

/** Year switcher + a short list of facts computed from the real contribution data. */
export const ActivityInsights: React.FC<ActivityInsightsProps> = ({ year, onSelectYear, stats, hoverMonth, loading }) => {
  const rows: [string, React.ReactNode][] =
    hoverMonth === null
      ? [
          ["ACTIVE DAYS", <CountUp key={`d${year}`} to={stats.activeDays} />],
          ["LONGEST STREAK", <><CountUp key={`s${year}`} to={stats.maxDayStreak} /> days</>],
          ["BUSIEST MONTH", `${stats.peakMonth.name} · ${stats.peakMonth.count}`],
          ["FAVORITE DAY", stats.favoriteWeekday],
          ["PEAK DAY", `${fmtDay(stats.peakDay.date)} · ${stats.peakDay.count}`],
        ]
      : [
          ["MONTH", `${FULL_MONTH_NAMES[hoverMonth]} ${year}`],
          ["CONTRIBUTIONS", stats.monthlyTotals[hoverMonth].toLocaleString()],
          ["ACTIVE DAYS", String(stats.monthActiveDays[hoverMonth])],
          ["SHARE OF YEAR", `${stats.totalCommits ? Math.round((stats.monthlyTotals[hoverMonth] / stats.totalCommits) * 100) : 0}%`],
        ];

  return (
    <div className="activity-insights">
      <div className="flex flex-wrap gap-1.5" role="group" aria-label="Choose year">
        {YEARS.map((y) => (
          <button
            key={y}
            type="button"
            aria-pressed={y === year}
            onClick={() => onSelectYear(y)}
            className={`rounded-full px-3.5 py-1.5 font-mono text-xs transition-colors ${
              y === year ? "bg-core-ink text-core-obsidian" : "border border-white/10 text-core-mist hover:text-core-ink"
            }`}
          >
            {y}
          </button>
        ))}
      </div>

      <dl className={`mt-8 border-t border-core-graphite transition-opacity ${loading ? "opacity-40" : ""}`}>
        {rows.map(([label, value]) => (
          <div key={label} className="grid grid-cols-[9rem_1fr] items-baseline gap-4 border-b border-core-graphite py-3.5">
            <dt className="font-mono text-[10px] tracking-[0.2em] text-core-mist">{label}</dt>
            <dd className="text-base text-core-ink">{value}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-4 font-mono text-[10px] tracking-[0.15em] text-core-mist/70">
        {hoverMonth === null ? "HOVER A MONTH ON THE RING" : "MOVE AWAY TO SEE THE YEAR"}
      </p>
    </div>
  );
};
