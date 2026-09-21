import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Activity,
  Calendar,
  Flame,
  ExternalLink,
  Github,
  Sparkles,
  TrendingUp,
  Clock,
  Award,
  RotateCw,
} from "lucide-react";

interface ContributionDay {
  date: string;
  count: number;
  level: number;
}

interface YearActivityData {
  total?: Record<string, number>;
  contributions: ContributionDay[];
}

const YEARS = [2026, 2025, 2024, 2023, 2022];
const CACHE_PREFIX = "gh_activity_chinjuku_v2_";
const CACHE_DURATION = 3600000; // 1 hour (3600000 ms)

const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const FULL_MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const DAY_LABELS = [
  { label: "", index: 0 },
  { label: "Mon", index: 1 },
  { label: "", index: 2 },
  { label: "Wed", index: 3 },
  { label: "", index: 4 },
  { label: "Fri", index: 5 },
  { label: "", index: 6 },
];

// Fallback generator for network/offline resilience
function generateFallbackYearData(year: number): YearActivityData {
  const isLeap = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  const daysCount = isLeap ? 366 : 365;
  const contributions: ContributionDay[] = [];
  const startDate = new Date(Date.UTC(year, 0, 1));

  for (let i = 0; i < daysCount; i++) {
    const d = new Date(startDate.getTime() + i * 86400000);
    const dateStr = d.toISOString().split("T")[0];
    contributions.push({ date: dateStr, count: 0, level: 0 });
  }

  return { total: { [year.toString()]: 0 }, contributions };
}

const CodeActivities: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [loading, setLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [activityData, setActivityData] = useState<YearActivityData | null>(
    null,
  );
  const [hoveredCell, setHoveredCell] = useState<{
    date: string;
    count: number;
    x: number;
    y: number;
  } | null>(null);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Fetch and cache contributions data with 1-hour localStorage TTL
  const fetchContributions = async (year: number, forceRefresh = false) => {
    const cacheKey = `${CACHE_PREFIX}${year}`;
    const timestampKey = `${cacheKey}_timestamp`;

    // Check localStorage cache if not forced
    if (!forceRefresh) {
      try {
        const cached = localStorage.getItem(cacheKey);
        const timestampStr = localStorage.getItem(timestampKey);
        if (cached && timestampStr) {
          const age = Date.now() - parseInt(timestampStr, 10);
          if (age < CACHE_DURATION) {
            const parsed = JSON.parse(cached);
            setActivityData(parsed);
            setLoading(false);
            return;
          }
        }
      } catch (e) {
        console.warn("LocalStorage read error:", e);
      }
    }

    setLoading(true);
    try {
      const res = await fetch(
        `https://github-contributions-api.jogruber.de/v4/Chinjuku?y=${year}`,
        {
          headers: forceRefresh ? { "Cache-Control": "no-cache" } : undefined,
        },
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: YearActivityData = await res.json();

      // Save to localStorage
      try {
        localStorage.setItem(cacheKey, JSON.stringify(data));
        localStorage.setItem(timestampKey, Date.now().toString());
      } catch (e) {
        console.warn("LocalStorage write error:", e);
      }

      setActivityData(data);
    } catch (err) {
      console.warn(`Failed to fetch GitHub contributions for ${year}:`, err);
      // Fallback 1: Stale cache
      try {
        const stale = localStorage.getItem(cacheKey);
        if (stale) {
          setActivityData(JSON.parse(stale));
          setLoading(false);
          return;
        }
      } catch (e) {}

      // Fallback 2: Generate skeleton structure
      setActivityData(generateFallbackYearData(year));
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchContributions(selectedYear);
  }, [selectedYear]);

  // Manual refresh action
  const handleManualRefresh = () => {
    setIsRefreshing(true);
    fetchContributions(selectedYear, true);
  };

  // Calculate aggregated metrics
  const stats = useMemo(() => {
    if (
      !activityData?.contributions ||
      activityData.contributions.length === 0
    ) {
      return {
        totalCommits: 0,
        activeDays: 0,
        maxDayStreak: 0,
        peakDay: { date: "-", count: 0 },
        monthlyTotals: Array(12).fill(0),
        peakMonth: { index: 0, name: "None", count: 0 },
      };
    }

    const contributions = activityData.contributions;
    let totalCommits = 0;
    let activeDays = 0;
    let currentStreak = 0;
    let maxDayStreak = 0;
    let peakDay = { date: "", count: 0 };
    const monthlyTotals = Array(12).fill(0);

    contributions.forEach((day) => {
      totalCommits += day.count;
      if (day.count > 0) {
        activeDays += 1;
        currentStreak += 1;
        if (currentStreak > maxDayStreak) {
          maxDayStreak = currentStreak;
        }
        if (day.count > peakDay.count) {
          peakDay = { date: day.date, count: day.count };
        }
      } else {
        currentStreak = 0;
      }

      const monthIndex = new Date(day.date).getUTCMonth();
      monthlyTotals[monthIndex] += day.count;
    });

    // Find peak activity month
    let peakMonthIndex = 0;
    let peakMonthCount = 0;
    monthlyTotals.forEach((count, idx) => {
      if (count > peakMonthCount) {
        peakMonthCount = count;
        peakMonthIndex = idx;
      }
    });

    // Use API total if available
    const apiTotal = activityData.total?.[selectedYear.toString()];
    const finalTotal = typeof apiTotal === "number" ? apiTotal : totalCommits;

    return {
      totalCommits: finalTotal,
      activeDays,
      maxDayStreak,
      peakDay,
      monthlyTotals,
      peakMonth: {
        index: peakMonthIndex,
        name: FULL_MONTH_NAMES[peakMonthIndex],
        count: peakMonthCount,
      },
    };
  }, [activityData, selectedYear]);

  // Transform contributions into 53 week columns aligned with days of week (Sunday=0 to Saturday=6)
  const calendarGrid = useMemo(() => {
    if (
      !activityData?.contributions ||
      activityData.contributions.length === 0
    ) {
      return { weeks: [], monthLabels: [] };
    }

    const contributions = activityData.contributions;
    const firstDay = new Date(contributions[0].date);
    const startDayOfWeek = firstDay.getUTCDay(); // 0 = Sunday

    // Build flat array of padded slots
    const paddedSlots: (ContributionDay | null)[] = [];
    for (let i = 0; i < startDayOfWeek; i++) {
      paddedSlots.push(null);
    }
    contributions.forEach((c) => paddedSlots.push(c));

    // Group into 7-day columns (weeks)
    const weeks: (ContributionDay | null)[][] = [];
    const monthLabels: { month: string; weekIndex: number }[] = [];
    let currentMonth = -1;

    for (let i = 0; i < paddedSlots.length; i += 7) {
      const week = paddedSlots.slice(i, i + 7);
      // Ensure 7 cells per week
      while (week.length < 7) {
        week.push(null);
      }
      const weekIndex = weeks.length;
      weeks.push(week);

      // Check if this week contains the 1st of a new month
      for (const slot of week) {
        if (slot) {
          const d = new Date(slot.date);
          const m = d.getUTCMonth();
          if (m !== currentMonth) {
            currentMonth = m;
            monthLabels.push({ month: MONTH_NAMES[m], weekIndex });
            break;
          }
        }
      }
    }

    return { weeks, monthLabels };
  }, [activityData]);

  // Auto-scroll calendar horizontally on mobile to show active progress
  useEffect(() => {
    if (scrollContainerRef.current) {
      // Scroll to end for current year or start for past years
      if (selectedYear === 2026) {
        scrollContainerRef.current.scrollLeft = 0;
      }
    }
  }, [selectedYear]);

  // Color level token styling
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

  return (
    <section id="activity" className="py-24 px-6 relative z-10 overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 -left-40 w-96 h-96 bg-nebula-purple/10 dark:bg-starlight-cyan/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-40 w-96 h-96 bg-starlight-cyan/10 dark:bg-nebula-purple/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto max-w-7xl">
        {/* ============================================================ */}
        {/* 1. SECTION HEADER WITH HUD BADGE & GITHUB PROFILE PILL       */}
        {/* ============================================================ */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-xs font-mono text-cyan-600 dark:text-cyan-400 tracking-widest uppercase mb-3">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
              <span>LIVE TELEMETRY // COMMITS</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black sci-fi-heading tracking-tight mb-3">
              Code Activities
            </h2>
            <p className="text-slate-600 dark:text-[#94a3b8] text-sm sm:text-base max-w-2xl leading-relaxed">
              Continuous mission logs, version control frequency, and GitHub
              contribution telemetry tracking repository operations across
              chronological milestones.
            </p>
          </div>

          {/* GitHub Link & Cache Refresh Pill */}
          <div className="flex items-center gap-3 self-start md:self-auto flex-wrap">
            <button
              onClick={handleManualRefresh}
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

        {/* ============================================================ */}
        {/* 2. STATS OVERVIEW CARDS (TOTAL, ACTIVE DAYS, PEAK MONTH)     */}
        {/* ============================================================ */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Card 1: Total Commits */}
          <div className="p-5 rounded-2xl sci-fi-card relative overflow-hidden group">
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
          <div className="p-5 rounded-2xl sci-fi-card relative overflow-hidden group">
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
          <div className="p-5 rounded-2xl sci-fi-card relative overflow-hidden group">
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
          <div className="p-5 rounded-2xl bg-cyan-500/10 dark:bg-cyan-950/30 border border-cyan-500/30 dark:border-cyan-400/40 relative overflow-hidden shadow-[0_0_25px_rgba(6,182,212,0.15)] group">
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

        {/* ============================================================ */}
        {/* 3. MAIN SECTION: HEATMAP + YEAR SELECTOR TABS                */}
        {/* ============================================================ */}
        <div className="flex flex-col lg:flex-row gap-6 mb-8">
          {/* Contribution Calendar Heatmap Container */}
          <div className="flex-1 p-6 sm:p-7 rounded-3xl sci-fi-glass border border-slate-200/80 dark:border-cyan-500/20 shadow-xl overflow-hidden relative">
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
                          width: `${Math.max(28, idx < calendarGrid.monthLabels.length - 1 ? (calendarGrid.monthLabels[idx + 1].weekIndex - item.weekIndex) * 15.5 : 45)}px`,
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
                        <div
                          key={weekIdx}
                          className="flex flex-col gap-[3.5px]"
                        >
                          {week.map((cell, dayIdx) => {
                            if (!cell) {
                              return (
                                <div
                                  key={dayIdx}
                                  className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-[3px] bg-transparent opacity-0 pointer-events-none"
                                />
                              );
                            }

                            const cellColor = getCellColor(
                              cell.level,
                              cell.count,
                            );

                            return (
                              <div
                                key={dayIdx}
                                onMouseEnter={(e) => {
                                  const rect =
                                    e.currentTarget.getBoundingClientRect();
                                  setHoveredCell({
                                    date: cell.date,
                                    count: cell.count,
                                    x: rect.left + rect.width / 2,
                                    y: rect.top,
                                  });
                                }}
                                onMouseLeave={() => setHoveredCell(null)}
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

          {/* Year Selector Tabs (Vertical on desktop, horizontal on mobile) */}
          <div className="lg:w-48 shrink-0 flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0">
            <span className="text-xs font-mono uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-1 hidden lg:block font-bold">
              // Select Year
            </span>
            {YEARS.map((year) => {
              const isSelected = selectedYear === year;
              return (
                <button
                  key={year}
                  onClick={() => setSelectedYear(year)}
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
        </div>

        {/* ============================================================ */}
        {/* 4. MONTHLY BREAKDOWN BAR CHART (JAN - DEC TELEMETRY)         */}
        {/* ============================================================ */}
        <div className="p-6 sm:p-7 rounded-3xl sci-fi-card border border-slate-200/80 dark:border-white/10 relative overflow-hidden">
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
                {stats.peakMonth.name}
              </span>{" "}
              ({stats.peakMonth.count} commits)
            </span>
          </div>

          {/* 12-Month Mini Distribution Bars */}
          <div className="grid grid-cols-6 sm:grid-cols-12 gap-2 sm:gap-3 items-end h-32 pb-4">
            {stats.monthlyTotals.map((count, idx) => {
              const isPeak = idx === stats.peakMonth.index && count > 0;
              const maxVal = Math.max(1, stats.peakMonth.count);
              const heightPercent =
                count > 0
                  ? Math.max(12, Math.round((count / maxVal) * 100))
                  : 6;

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
      </div>

      {/* ============================================================ */}
      {/* 5. FLOATING HUD TOOLTIP ON CELL HOVER                        */}
      {/* ============================================================ */}
      {hoveredCell && (
        <div
          style={{
            position: "fixed",
            left: `${hoveredCell.x}px`,
            top: `${hoveredCell.y - 10}px`,
            transform: "translate(-50%, -100%)",
          }}
          className="pointer-events-none z-50 animate-in fade-in zoom-in-95 duration-150"
        >
          <div className="bg-slate-900/95 dark:bg-[#070b14]/95 border border-cyan-500/50 rounded-xl px-3.5 py-2 shadow-[0_0_20px_rgba(6,182,212,0.4)] backdrop-blur-md text-center min-w-[160px]">
            <div className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider mb-0.5">
              {hoveredCell.count === 0
                ? "No Contributions"
                : `${hoveredCell.count} ${hoveredCell.count === 1 ? "Contribution" : "Contributions"}`}
            </div>
            <div className="text-[11px] font-mono text-slate-300 font-medium">
              {new Date(hoveredCell.date).toLocaleDateString("en-US", {
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
      )}
    </section>
  );
};

export default CodeActivities;
