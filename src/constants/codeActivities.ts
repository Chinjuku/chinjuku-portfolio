export interface ContributionDay {
  date: string;
  count: number;
  level: number;
}

export interface YearActivityData {
  total?: Record<string, number>;
  contributions: ContributionDay[];
}

export const YEARS = [2026, 2025, 2024, 2023, 2022];
export const CACHE_PREFIX = "gh_activity_chinjuku_v2_";
export const CACHE_DURATION = 3600000; // 1 hour (3600000 ms)

export const MONTH_NAMES = [
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

export const FULL_MONTH_NAMES = [
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

export const DAY_LABELS = [
  { label: "", index: 0 },
  { label: "Mon", index: 1 },
  { label: "", index: 2 },
  { label: "Wed", index: 3 },
  { label: "", index: 4 },
  { label: "Fri", index: 5 },
  { label: "", index: 6 },
];

export function generateFallbackYearData(year: number): YearActivityData {
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
