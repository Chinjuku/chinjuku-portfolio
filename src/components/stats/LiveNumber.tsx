import React, { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { odometerDigits } from "../motion/odometerDigits";
import { usePrefersReducedMotion } from "../motion/useMotionPrefs";

const ROWS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

/**
 * A number whose digits roll from their previous value to the new one,
 * so a live counter ticks instead of jumping. Rolls from 0 on first show.
 */
export const LiveNumber: React.FC<{ value: number; className?: string }> = ({ value, className = "" }) => {
  const rootRef = useRef<HTMLSpanElement>(null);
  const reduced = usePrefersReducedMotion();
  const digits = odometerDigits(value);

  useLayoutEffect(() => {
    const cols = rootRef.current?.querySelectorAll<HTMLElement>("[data-live-col]");
    cols?.forEach((col, i) => {
      const to = { yPercent: -digits[i] * 10 };
      if (reduced) gsap.set(col, to);
      else gsap.to(col, { ...to, duration: 0.7 + i * 0.08, ease: "power3.out", overwrite: true });
    });
  }, [value, reduced]); // eslint-disable-line react-hooks/exhaustive-deps -- digits derives from value

  return (
    <span ref={rootRef} className={`inline-flex tabular-nums ${className}`}>
      <span className="sr-only">{value.toLocaleString()}</span>
      {/* keyed by length: 99 -> 100 remounts so the new column rolls in too */}
      <span key={digits.length} aria-hidden="true" className="inline-flex">
        {digits.map((_, i) => (
          <span key={i} className="inline-block h-[1em] overflow-hidden leading-none">
            <span data-live-col className="flex flex-col will-change-transform">
              {ROWS.map((n) => (
                <span key={n} className="block h-[1em] leading-none">
                  {n}
                </span>
              ))}
            </span>
          </span>
        ))}
      </span>
    </span>
  );
};
