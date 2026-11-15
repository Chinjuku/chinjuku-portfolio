import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePrefersReducedMotion } from "./useMotionPrefs";

gsap.registerPlugin(ScrollTrigger);

interface CountUpProps {
  to: number;
  duration?: number;
  className?: string;
}

/** Number that counts up from 0 the first time it scrolls into view. */
export const CountUp: React.FC<CountUpProps> = ({ to, duration = 1.6, className = "" }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.textContent = reduced ? to.toLocaleString() : "0";
    if (reduced) return;
    const counter = { v: 0 };
    const tween = gsap.to(counter, {
      v: to,
      duration,
      ease: "power3.out",
      onUpdate: () => {
        el.textContent = Math.round(counter.v).toLocaleString();
      },
      scrollTrigger: { trigger: el, start: "top 90%", once: true },
    });
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [to, duration, reduced]);

  return (
    <span ref={ref} className={`tabular-nums ${className}`}>
      {to.toLocaleString()}
    </span>
  );
};
