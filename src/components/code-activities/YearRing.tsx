import React, { useEffect, useMemo, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FULL_MONTH_NAMES, MONTH_NAMES, type ContributionDay } from "../../constants/codeActivities";
import { usePrefersReducedMotion } from "../motion";

gsap.registerPlugin(ScrollTrigger);

const SIZE = 440;
const C = SIZE / 2;
const INNER = 112; // Sunday track
const STEP = 11; // radius step per weekday
const OUTER = INNER + STEP * 6;
const LEVEL_OPACITY = [0.3, 0.45, 0.65, 0.85, 1];
const LEVEL_R = [1.7, 2.5, 3, 3.4, 3.9];

interface YearRingProps {
  year: number;
  days: ContributionDay[];
  total: number;
  monthlyTotals: number[];
  hoverMonth: number | null;
  onHoverMonth: (m: number | null) => void;
  loading: boolean;
}

const polar = (angle: number, r: number) => [C + Math.cos(angle) * r, C + Math.sin(angle) * r] as const;

/** Arc wedge path between two radii for a month's hover area. */
const wedge = (a0: number, a1: number, r0: number, r1: number) => {
  const [x0, y0] = polar(a0, r1);
  const [x1, y1] = polar(a1, r1);
  const [x2, y2] = polar(a1, r0);
  const [x3, y3] = polar(a0, r0);
  const large = a1 - a0 > Math.PI ? 1 : 0;
  return `M${x0} ${y0} A${r1} ${r1} 0 ${large} 1 ${x1} ${y1} L${x2} ${y2} A${r0} ${r0} 0 ${large} 0 ${x3} ${y3} Z`;
};

/**
 * A year of contributions as a clock: weeks run clockwise from the top,
 * each weekday is its own ring (Sunday innermost). Dots light up in a
 * clockwise sweep when the ring scrolls into view; hovering a month
 * focuses it and shows its numbers in the center.
 */
export const YearRing: React.FC<YearRingProps> = ({
  year,
  days,
  total,
  monthlyTotals,
  hoverMonth,
  onHoverMonth,
  loading,
}) => {
  const rootRef = useRef<SVGSVGElement>(null);
  const reduced = usePrefersReducedMotion();

  const { dots, yearDays, startAngleOfMonth } = useMemo(() => {
    const jan1 = Date.UTC(year, 0, 1);
    const yearDays = (Date.UTC(year + 1, 0, 1) - jan1) / 86400000;
    const firstDow = new Date(jan1).getUTCDay();
    const angleOfDay = (doy: number) => ((doy + firstDow) / 7 / 53) * Math.PI * 2 - Math.PI / 2;
    const dots = days
      .filter((d) => d.date.startsWith(String(year)))
      .map((d) => {
        const t = Date.parse(d.date + "T00:00:00Z");
        const doy = Math.round((t - jan1) / 86400000);
        const dow = new Date(t).getUTCDay();
        const week = Math.floor((doy + firstDow) / 7);
        const angle = (week / 53) * Math.PI * 2 - Math.PI / 2;
        const [x, y] = polar(angle, INNER + dow * STEP);
        return { key: d.date, x, y, level: Math.min(4, d.level), count: d.count, month: new Date(t).getUTCMonth() };
      });
    const startAngleOfMonth = Array.from({ length: 13 }, (_, m) =>
      m === 12 ? angleOfDay(yearDays) : angleOfDay(Math.round((Date.UTC(year, m, 1) - jan1) / 86400000)),
    );
    return { dots, yearDays, startAngleOfMonth };
  }, [days, year]);

  // clockwise sweep: dots light up in date order, a hand sweeps with them
  useEffect(() => {
    const svg = rootRef.current;
    if (!svg || loading || reduced) return;
    const ctx = gsap.context(() => {
      const sweep = gsap.timeline({
        scrollTrigger: { trigger: svg, start: "top 75%", once: true },
      });
      sweep
        .fromTo(
          ".ring-dot",
          { opacity: 0, scale: 0, transformOrigin: "50% 50%" },
          {
            opacity: (_i: number, el: Element) => Number((el as SVGElement).dataset.o),
            scale: 1,
            duration: 0.35,
            ease: "back.out(2)",
            stagger: { each: 1.4 / Math.max(1, yearDays), from: "start" },
            // hand opacity back to the SVG attribute so month focus can dim dots
            clearProps: "opacity,transform",
          },
        )
        .fromTo(".ring-hand", { rotate: 0, opacity: 1 }, { rotate: 360, duration: 1.4, ease: "none", svgOrigin: `${C} ${C}` }, 0)
        .to(".ring-hand", { opacity: 0, duration: 0.3 });
    }, svg);
    return () => ctx.revert();
  }, [dots, loading, reduced, yearDays]);

  const focus = hoverMonth;

  return (
    <svg
      ref={rootRef}
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      className="h-auto w-full max-w-[520px] select-none"
      role="img"
      aria-label={`${total} contributions in ${year}`}
      onMouseLeave={() => onHoverMonth(null)}
    >
      {/* weekday tracks */}
      {Array.from({ length: 7 }, (_, d) => (
        <circle key={d} cx={C} cy={C} r={INNER + d * STEP} fill="none" stroke="rgba(255,255,255,0.03)" />
      ))}

      {/* month separators + labels */}
      {MONTH_NAMES.map((name, m) => {
        const a = startAngleOfMonth[m];
        const mid = (startAngleOfMonth[m] + startAngleOfMonth[m + 1]) / 2;
        const [x0, y0] = polar(a, INNER - 10);
        const [x1, y1] = polar(a, OUTER + 10);
        const [lx, ly] = polar(mid, OUTER + 26);
        const on = focus === null || focus === m;
        return (
          <g key={name}>
            <line x1={x0} y1={y0} x2={x1} y2={y1} stroke="rgba(255,255,255,0.06)" />
            <text
              x={lx}
              y={ly}
              textAnchor="middle"
              dominantBaseline="middle"
              className={`font-mono text-[10px] tracking-[0.15em] transition-[fill] ${
                focus === m ? "fill-core-icy" : on ? "fill-core-mist" : "fill-core-mist/40"
              }`}
            >
              {name.toUpperCase()}
            </text>
          </g>
        );
      })}

      {/* the days */}
      <g>
        {dots.map((d) => {
          const o = LEVEL_OPACITY[d.level];
          const dim = focus !== null && focus !== d.month;
          return (
            <circle
              key={d.key}
              className="ring-dot"
              data-o={o}
              cx={d.x}
              cy={d.y}
              r={LEVEL_R[d.level]}
              fill={d.level === 0 ? "#3A4454" : "#8ABFFF"}
              opacity={dim ? o * 0.25 : o}
              style={{ transition: "opacity 0.3s" }}
            >
              <title>{`${d.key}: ${d.count} contribution${d.count === 1 ? "" : "s"}`}</title>
            </circle>
          );
        })}
      </g>

      {/* sweeping clock hand for the intro */}
      <line className="ring-hand" x1={C} y1={C} x2={C} y2={C - OUTER - 6} stroke="#B5D5FF" strokeWidth={1} opacity={0} />

      {/* month hover areas */}
      {MONTH_NAMES.map((name, m) => (
        <path
          key={`hit-${name}`}
          d={wedge(startAngleOfMonth[m], startAngleOfMonth[m + 1], INNER - 14, OUTER + 36)}
          fill="transparent"
          onMouseEnter={() => onHoverMonth(m)}
          onFocus={() => onHoverMonth(m)}
          tabIndex={0}
          aria-label={`${FULL_MONTH_NAMES[m]}: ${monthlyTotals[m]} contributions`}
          className="cursor-pointer outline-none"
        />
      ))}

      {/* center readout */}
      <g className="pointer-events-none">
        <text x={C} y={C - 8} textAnchor="middle" className="fill-core-ink text-[44px] font-semibold tracking-[-0.04em]">
          {loading ? "—" : (focus === null ? total : monthlyTotals[focus]).toLocaleString()}
        </text>
        <text x={C} y={C + 22} textAnchor="middle" className="fill-core-mist font-mono text-[10px] tracking-[0.2em]">
          {focus === null ? `CONTRIBUTIONS · ${year}` : `${FULL_MONTH_NAMES[focus].toUpperCase()} ${year}`}
        </text>
      </g>
    </svg>
  );
};
