import React, { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePrefersReducedMotion } from "./useMotionPrefs";
import { odometerDigits } from "./odometerDigits";

gsap.registerPlugin(ScrollTrigger);

const ROWS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

interface OdometerProps {
  value: number;
  className?: string;
}

/** Number whose digits roll up from 0 the first time it scrolls into view. */
export const Odometer: React.FC<OdometerProps> = ({ value, className = "" }) => {
  const rootRef = useRef<HTMLSpanElement>(null);
  const reduced = usePrefersReducedMotion();
  const digits = odometerDigits(value);

  // layout effect: the final digits are set before paint under reduced motion
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const ctx = gsap.context(() => {
      const columns = gsap.utils.toArray<HTMLElement>("[data-odometer-col]");
      if (reduced) {
        columns.forEach((col, i) => gsap.set(col, { yPercent: -digits[i] * 10 }));
        return;
      }
      columns.forEach((col, i) => {
        gsap.fromTo(
          col,
          { yPercent: 0 },
          {
            yPercent: -digits[i] * 10,
            duration: 0.9 + i * 0.2,
            ease: "power3.out",
            scrollTrigger: { trigger: root, start: "top 90%", once: true },
          },
        );
      });
    }, rootRef);
    return () => ctx.revert();
  }, [value, reduced]); // eslint-disable-line react-hooks/exhaustive-deps -- digits derives from value

  return (
    <span ref={rootRef} className={`inline-flex tabular-nums ${className}`}>
      <span className="sr-only">{value}</span>
      {digits.map((_, i) => (
        <span
          key={i}
          aria-hidden="true"
          className="inline-block h-[1em] overflow-hidden leading-none"
        >
          <span data-odometer-col className="flex flex-col will-change-transform">
            {ROWS.map((n) => (
              <span key={n} className="block h-[1em] leading-none">
                {n}
              </span>
            ))}
          </span>
        </span>
      ))}
    </span>
  );
};
