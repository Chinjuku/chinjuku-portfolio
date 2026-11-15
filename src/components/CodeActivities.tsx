import React, { useState, useEffect, useMemo, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  CACHE_PREFIX,
  CACHE_DURATION,
  FULL_MONTH_NAMES,
  generateFallbackYearData,
  type YearActivityData,
} from "../constants/codeActivities";
import { ActivityHeader, ActivityInsights, YearRing } from "./code-activities";

const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

gsap.registerPlugin(ScrollTrigger);

const CodeActivities: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [loading, setLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [activityData, setActivityData] = useState<YearActivityData | null>(
    null,
  );
  const [hoverMonth, setHoverMonth] = useState<number | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  // header and insights rise in once; the ring animates itself (YearRing)
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        [".activity-pill", ".activity-title", ".activity-desc", ".activity-actions", ".activity-insights"],
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 75%", once: true },
        },
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

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
      } catch {
        // stale cache unreadable: fall through to the generated skeleton
      }

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
        monthActiveDays: Array(12).fill(0),
        peakMonth: { index: 0, name: "None", count: 0 },
        favoriteWeekday: "—",
      };
    }

    const contributions = activityData.contributions;
    let totalCommits = 0;
    let activeDays = 0;
    let currentStreak = 0;
    let maxDayStreak = 0;
    let peakDay = { date: "", count: 0 };
    const monthlyTotals = Array(12).fill(0);
    const monthActiveDays = Array(12).fill(0);
    const weekdayTotals = Array(7).fill(0);

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

      const d = new Date(day.date);
      const monthIndex = d.getUTCMonth();
      monthlyTotals[monthIndex] += day.count;
      if (day.count > 0) monthActiveDays[monthIndex] += 1;
      weekdayTotals[d.getUTCDay()] += day.count;
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
      monthActiveDays,
      favoriteWeekday: WEEKDAYS[weekdayTotals.indexOf(Math.max(...weekdayTotals))],
      peakMonth: {
        index: peakMonthIndex,
        name: FULL_MONTH_NAMES[peakMonthIndex],
        count: peakMonthCount,
      },
    };
  }, [activityData, selectedYear]);

  return (
    <section id="activity" ref={sectionRef} className="relative z-10 overflow-hidden px-6 py-28 md:px-12">
      <div className="mx-auto max-w-6xl">
        <ActivityHeader isRefreshing={isRefreshing} onRefresh={handleManualRefresh} />

        <div className="grid items-center gap-12 md:grid-cols-12">
          <div className="flex justify-center md:col-span-7">
            <YearRing
              year={selectedYear}
              days={activityData?.contributions ?? []}
              total={stats.totalCommits}
              monthlyTotals={stats.monthlyTotals}
              hoverMonth={hoverMonth}
              onHoverMonth={setHoverMonth}
              loading={loading}
            />
          </div>
          <div className="md:col-span-5">
            <ActivityInsights
              year={selectedYear}
              onSelectYear={(y) => {
                setHoverMonth(null);
                setSelectedYear(y);
              }}
              stats={stats}
              hoverMonth={hoverMonth}
              loading={loading}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CodeActivities;
