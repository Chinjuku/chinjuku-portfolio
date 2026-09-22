import React, { useState, useEffect, useMemo, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  CACHE_PREFIX,
  CACHE_DURATION,
  MONTH_NAMES,
  FULL_MONTH_NAMES,
  generateFallbackYearData,
  type ContributionDay,
  type YearActivityData,
} from "../constants/codeActivities";
import {
  ActivityHeader,
  ActivityStats,
  ActivityHeatmap,
  ActivityYearTabs,
  ActivityMonthlyChart,
  ActivityTooltip,
} from "./code-activities";

gsap.registerPlugin(ScrollTrigger);

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
  const sectionRef = useRef<HTMLDivElement>(null);

  // GSAP ScrollTrigger Component Animations (restarts cleanly every time you scroll into view)
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          toggleActions: "restart none restart none",
        },
      });

      // 1. Header elements
      tl.fromTo(
        ".activity-pill",
        { y: -15, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.45, ease: "power3.out" },
      )
        .fromTo(
          ".activity-title",
          { y: 25, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.55, ease: "power3.out" },
          "-=0.25",
        )
        .fromTo(
          ".activity-desc",
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, ease: "power2.out" },
          "-=0.3",
        )
        .fromTo(
          ".activity-actions",
          { y: 15, opacity: 0, scale: 0.95 },
          { y: 0, opacity: 1, scale: 1, duration: 0.45, ease: "power2.out" },
          "-=0.3",
        )
        // 2. 4 Stats overview cards (Staggered spring)
        .fromTo(
          ".activity-stat-card",
          { y: 30, opacity: 0, scale: 0.95 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.45,
            stagger: 0.08,
            ease: "back.out(1.2)",
          },
          "-=0.2",
        )
        // 3. Heatmap matrix & Year selector tabs
        .fromTo(
          ".activity-heatmap",
          { y: 30, opacity: 0, scale: 0.98 },
          { y: 0, opacity: 1, scale: 1, duration: 0.55, ease: "power3.out" },
          "-=0.2",
        )
        .fromTo(
          ".activity-year-tabs",
          { x: 25, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.5, ease: "power3.out" },
          "-=0.35",
        )
        // 4. Monthly breakdown chart
        .fromTo(
          ".activity-chart",
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, ease: "power2.out" },
          "-=0.25",
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

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
      if (selectedYear === 2026) {
        scrollContainerRef.current.scrollLeft = 0;
      }
    }
  }, [selectedYear]);

  return (
    <section
      id="activity"
      ref={sectionRef}
      className="py-24 px-6 relative z-10 overflow-hidden"
    >
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 -left-40 w-96 h-96 bg-nebula-purple/10 dark:bg-starlight-cyan/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-40 w-96 h-96 bg-starlight-cyan/10 dark:bg-nebula-purple/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto max-w-7xl">
        {/* 1. Header with HUD badge & Github profile actions */}
        <ActivityHeader
          isRefreshing={isRefreshing}
          onRefresh={handleManualRefresh}
        />

        {/* 2. Stats overview cards */}
        <ActivityStats
          selectedYear={selectedYear}
          loading={loading}
          stats={stats}
        />

        {/* 3. Heatmap & Year selector tabs */}
        <div className="flex flex-col lg:flex-row gap-6 mb-8">
          <ActivityHeatmap
            selectedYear={selectedYear}
            loading={loading}
            calendarGrid={calendarGrid}
            scrollContainerRef={scrollContainerRef}
            onCellHover={setHoveredCell}
          />

          <ActivityYearTabs
            selectedYear={selectedYear}
            onSelectYear={setSelectedYear}
          />
        </div>

        {/* 4. Monthly breakdown chart */}
        <ActivityMonthlyChart
          selectedYear={selectedYear}
          monthlyTotals={stats.monthlyTotals}
          peakMonth={stats.peakMonth}
        />
      </div>

      {/* 5. Floating HUD tooltip */}
      <ActivityTooltip cell={hoveredCell} />
    </section>
  );
};

export default CodeActivities;
