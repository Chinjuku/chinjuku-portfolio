import React, { useRef } from "react";
import gsap from "gsap";
import { Heart } from "lucide-react";
import { useSiteStats } from "./context";
import { LiveNumber } from "./LiveNumber";
import { usePrefersReducedMotion } from "../motion/useMotionPrefs";
import { useAutoHide } from "./useAutoHide";

const PARTICLES = 12;

/**
 * "Orbit" like button: floats bottom-right. A satellite circles the heart;
 * liking it fires a shockwave and a burst of particles flung out along an orbit,
 * and the shared count rolls to its new value.
 */
export const LikeOrbit: React.FC = () => {
  const { stats, toggleLike, pending } = useSiteStats();
  const reduced = usePrefersReducedMotion();
  const fxRef = useRef<HTMLSpanElement>(null);
  const heartRef = useRef<SVGSVGElement>(null);
  // touch screens: slide away while reading so it never sits on top of buttons
  const hidden = useAutoHide();

  if (!stats) return null;
  const { liked, likes } = stats;

  const burst = () => {
    const fx = fxRef.current;
    if (!fx || reduced) return;
    const ring = fx.querySelector(".like-wave");
    const dots = fx.querySelectorAll<HTMLElement>(".like-particle");
    gsap.fromTo(ring, { scale: 0.6, opacity: 0.9 }, { scale: 2.4, opacity: 0, duration: 0.8, ease: "power2.out" });
    dots.forEach((dot, i) => {
      const a = (i / PARTICLES) * Math.PI * 2;
      const r = 34 + (i % 3) * 10;
      // a little swirl: particles curve as they fly, like they're leaving orbit
      const swirl = a + 0.6;
      gsap.fromTo(
        dot,
        { x: 0, y: 0, scale: 1, opacity: 1 },
        {
          keyframes: [
            { x: Math.cos(a) * r * 0.6, y: Math.sin(a) * r * 0.6, duration: 0.25, ease: "power2.out" },
            { x: Math.cos(swirl) * r, y: Math.sin(swirl) * r, scale: 0, opacity: 0, duration: 0.55, ease: "power1.in" },
          ],
        },
      );
    });
  };

  const onClick = () => {
    if (pending) return;
    const heart = heartRef.current;
    if (!liked) {
      burst();
      if (heart && !reduced)
        gsap.fromTo(heart, { scale: 0.6 }, { scale: 1, duration: 0.6, ease: "elastic.out(1.2, 0.4)" });
    } else if (heart && !reduced) {
      gsap.fromTo(heart, { scale: 0.85 }, { scale: 1, duration: 0.35, ease: "power2.out" });
    }
    toggleLike();
  };

  return (
    <div
      className={`like-orbit pointer-events-none fixed bottom-4 right-4 z-40 transition-[transform,opacity] duration-500 ease-out md:bottom-6 md:right-6 ${
        hidden ? "translate-y-[140%] opacity-0" : "translate-y-0 opacity-100"
      }`}
    >
      <div className="pointer-events-auto flex items-center gap-1 rounded-full border border-white/10 bg-core-obsidian/75 py-1 pl-4 pr-4 shadow-[0_10px_40px_rgba(0,0,0,0.45)] backdrop-blur-xl">
        {/* visitors: live dot + rolling count */}
        <span className="flex items-center gap-2.5 pr-3" aria-label={`${stats.views} visitors`}>
          <span aria-hidden="true" className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60 motion-reduce:animate-none" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
          </span>
          <span aria-hidden="true" className="flex flex-col leading-none">
            <LiveNumber value={stats.views} className="text-sm font-medium text-core-ink" />
            <span className="mt-1 font-mono text-[9px] tracking-[0.2em] text-core-mist">VISITORS</span>
          </span>
        </span>
        <span aria-hidden="true" className="h-7 w-px bg-white/10" />
        <button
          type="button"
          onClick={onClick}
          aria-pressed={liked}
          aria-label={liked ? `Unlike this site (${likes} likes)` : `Like this site (${likes} likes)`}
          className="group relative flex h-12 w-12 items-center justify-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-core-icy"
        >
          {/* the orbit: a tilted ring with a satellite riding it */}
          <span
            aria-hidden="true"
            className={`absolute inset-0 rounded-full border transition-colors duration-500 ${
              liked ? "border-core-icy/40" : "border-white/10 group-hover:border-white/25"
            }`}
          />
          <span
            aria-hidden="true"
            className={`absolute inset-[-3px] ${reduced ? "" : "animate-[spin_6s_linear_infinite]"} ${
              liked ? "" : "group-hover:[animation-duration:2.5s]"
            }`}
          >
            <span
              className={`absolute left-1/2 top-0 h-1.5 w-1.5 -translate-x-1/2 rounded-full transition-all duration-500 ${
                liked ? "bg-core-icy shadow-[0_0_10px_3px_rgba(138,191,255,0.7)]" : "bg-core-mist"
              }`}
            />
          </span>

          {/* burst layer */}
          <span ref={fxRef} aria-hidden="true" className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <span className="like-wave absolute h-12 w-12 rounded-full border border-core-icy opacity-0" />
            {Array.from({ length: PARTICLES }, (_, i) => (
              <span
                key={i}
                className={`like-particle absolute h-1 w-1 rounded-full opacity-0 ${
                  i % 3 === 0 ? "bg-core-ink" : "bg-core-icy"
                } shadow-[0_0_6px_rgba(138,191,255,0.8)]`}
              />
            ))}
          </span>

          <Heart
            ref={heartRef}
            className={`relative h-5 w-5 transition-colors duration-300 ${
              liked ? "fill-core-icy text-core-icy drop-shadow-[0_0_8px_rgba(138,191,255,0.7)]" : "text-core-chrome group-hover:text-core-ink"
            }`}
          />
        </button>
        <span className="flex flex-col leading-none">
          <LiveNumber value={likes} className="text-sm font-medium text-core-ink" />
          <span className="mt-1 font-mono text-[9px] tracking-[0.2em] text-core-mist">{liked ? "THANKS" : "LIKES"}</span>
        </span>
      </div>
    </div>
  );
};
