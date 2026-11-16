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
import Container from "./common/Container";

const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

gsap.registerPlugin(ScrollTrigger);

const INITIAL_YEAR = 2026;
const cacheKeys = (year: number) => {
  const key = `${CACHE_PREFIX}${year}`;
  return { key, timestamp: `${key}_timestamp` };
};

/** The cached year if it is still fresh, else null. Synchronous, so it can seed state. */
const readFreshCache = (year: number): YearActivityData | null => {
  const { key, timestamp } = cacheKeys(year);
  try {
    const cached = localStorage.getItem(key);
    const ts = localStorage.getItem(timestamp);
    if (cached && ts && Date.now() - parseInt(ts, 10) < CACHE_DURATION) {
      return JSON.parse(cached) as YearActivityData;
    }
  } catch (e) {
    console.warn("LocalStorage read error:", e);
  }
  return null;
};

/**
 * Loads a year's contributions: fresh cache, then the API (cached on success),
 * then a stale cache, then a generated skeleton. Never throws; holds no React state.
 */
const loadContributions = async (year: number, forceRefresh = false): Promise<YearActivityData> => {
  if (!forceRefresh) {
    const fresh = readFreshCache(year);
    if (fresh) return fresh;
  }
  const { key, timestamp } = cacheKeys(year);
  try {
    const res = await fetch(`https://github-contributions-api.jogruber.de/v4/Chinjuku?y=${year}`, {
      headers: forceRefresh ? { "Cache-Control": "no-cache" } : undefined,
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data: YearActivityData = await res.json();
    try {
      localStorage.setItem(key, JSON.stringify(data));
      localStorage.setItem(timestamp, Date.now().toString());
    } catch (e) {
      console.warn("LocalStorage write error:", e);
    }
    return data;
  } catch (err) {
    console.warn(`Failed to fetch GitHub contributions for ${year}:`, err);
    try {
      const stale = localStorage.getItem(key);
      if (stale) return JSON.parse(stale) as YearActivityData;
    } catch {
      // stale cache unreadable: fall through to the generated skeleton
    }
    return generateFallbackYearData(year);
  }
};

const CodeActivities: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState<number>(INITIAL_YEAR);
  // seeded from a fresh cache so a cached year renders without a loading flash
  const [activityData, setActivityData] = useState<YearActivityData | null>(() =>
    readFreshCache(INITIAL_YEAR),
  );
  const [loading, setLoading] = useState<boolean>(() => activityData === null);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const yearRef = useRef(INITIAL_YEAR); // latest selected year, read by async callbacks
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

  // Load the selected year. State is only set once the data arrives, and a
  // superseded request (the user switched years meanwhile) is ignored.
  useEffect(() => {
    let alive = true;
    loadContributions(selectedYear).then((data) => {
      if (!alive) return;
      setActivityData(data);
      setLoading(false);
    });
    return () => {
      alive = false;
    };
  }, [selectedYear]);

  const selectYear = (year: number) => {
    yearRef.current = year;
    setHoverMonth(null);
    const cached = readFreshCache(year);
    if (cached) setActivityData(cached);
    setLoading(cached === null);
    setSelectedYear(year);
  };

  // Manual refresh action: bypass the cache
  const handleManualRefresh = () => {
    const year = selectedYear;
    setIsRefreshing(true);
    loadContributions(year, true).then((data) => {
      setIsRefreshing(false);
      // only apply if the user is still looking at that year
      if (yearRef.current === year) setActivityData(data);
    });
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
    <section id="activity" ref={sectionRef} className="relative z-10 overflow-hidden py-28">
      <Container>
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
              onSelectYear={selectYear}
              stats={stats}
              hoverMonth={hoverMonth}
              loading={loading}
            />
          </div>
        </div>
      </Container>
    </section>
  );
};

export default CodeActivities;
