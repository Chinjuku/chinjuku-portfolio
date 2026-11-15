import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { usePointerFx } from "./useMotionPrefs";

interface MagneticProps {
  children: React.ReactNode;
  /** 0..1, how far the element follows the cursor */
  strength?: number;
  className?: string;
}

/** Pulls its child toward the cursor while hovered, springs back on leave. */
export const Magnetic: React.FC<MagneticProps> = ({ children, strength = 0.3, className = "" }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const enabled = usePointerFx();

  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled) return;
    const x = gsap.quickTo(el, "x", { duration: 0.4, ease: "power3.out" });
    const y = gsap.quickTo(el, "y", { duration: 0.4, ease: "power3.out" });
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      x((e.clientX - (r.left + r.width / 2)) * strength);
      y((e.clientY - (r.top + r.height / 2)) * strength);
    };
    const onLeave = () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.8, ease: "elastic.out(1, 0.4)" });
    };
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      gsap.set(el, { clearProps: "transform" });
    };
  }, [enabled, strength]);

  return (
    <span ref={ref} className={`inline-block ${className}`}>
      {children}
    </span>
  );
};
