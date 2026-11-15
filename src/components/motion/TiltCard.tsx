import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { usePointerFx } from "./useMotionPrefs";

interface TiltCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** max tilt in degrees */
  max?: number;
  /** show the cursor-following light */
  glow?: boolean;
}

/** Wraps a card: tilts toward the cursor in 3D with a soft light under the pointer. */
export const TiltCard: React.FC<TiltCardProps> = ({
  max = 7,
  glow = true,
  className = "",
  children,
  ...rest
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const enabled = usePointerFx();

  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled) return;
    gsap.set(el, { transformPerspective: 900, transformStyle: "preserve-3d" });
    const rx = gsap.quickTo(el, "rotationX", { duration: 0.5, ease: "power3.out" });
    const ry = gsap.quickTo(el, "rotationY", { duration: 0.5, ease: "power3.out" });
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      rx((0.5 - py) * max * 2);
      ry((px - 0.5) * max * 2);
      el.style.setProperty("--mx", `${px * 100}%`);
      el.style.setProperty("--my", `${py * 100}%`);
    };
    const onLeave = () => {
      rx(0);
      ry(0);
    };
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      gsap.set(el, { clearProps: "transform" });
    };
  }, [enabled, max]);

  return (
    <div ref={ref} className={`group/tilt relative will-change-transform ${className}`} {...rest}>
      {children}
      {glow && enabled && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover/tilt:opacity-100"
          style={{
            background:
              "radial-gradient(360px circle at var(--mx, 50%) var(--my, 50%), rgba(138,191,255,0.12), transparent 50%)",
          }}
        />
      )}
    </div>
  );
};
