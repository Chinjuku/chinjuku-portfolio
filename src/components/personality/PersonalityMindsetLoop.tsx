import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PERSONALITY_LOOP } from "../../constants/personality";
import { usePrefersReducedMotion } from "../motion";

gsap.registerPlugin(ScrollTrigger);

const STEP = 2; // วินาทีต่อหนึ่งจุด (วนครบรอบ = 3 จุด)
// มุมของแต่ละจุด (องศา, 0 = ขวา, ตามเข็ม): บน, ขวาล่าง, ซ้ายล่าง ห่างกัน 120°
const ANGLES = [-90, 30, 150];
const RADIUS = 42; // % ของกล่อง

/** วงจร Build → Break → Learn: มีแสงวิ่งวนรอบวง และจุดที่แสงผ่านจะสว่างขึ้น */
export const PersonalityMindsetLoop: React.FC = () => {
  const root = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ repeat: -1, paused: true });
      // แสงวิ่งรอบวง ครบรอบใน 3 ช่วง
      tl.to(".loop-runner", { rotation: 360, duration: STEP * PERSONALITY_LOOP.length, ease: "none" }, 0);
      // จุดที่แสงวิ่งผ่านสว่างขึ้นแล้วจางลง
      gsap.utils.toArray<HTMLElement>(".loop-node").forEach((node, i) => {
        tl.fromTo(
          node,
          { scale: 1, borderColor: "rgba(255,255,255,0.1)", color: "#929EAF" },
          {
            scale: 1.12,
            borderColor: "rgba(138,191,255,0.7)",
            color: "#F4F6FA",
            duration: 0.35,
            yoyo: true,
            repeat: 1,
            repeatDelay: 0.7,
            ease: "power2.out",
          },
          i * STEP,
        );
      });
      // วิ่งเฉพาะตอนอยู่บนจอ ประหยัดแบต
      ScrollTrigger.create({
        trigger: root.current,
        start: "top bottom",
        end: "bottom top",
        onToggle: (self) => (self.isActive ? tl.play() : tl.pause()),
      });
    }, root);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <div ref={root} aria-hidden="true" className="relative mx-auto aspect-square w-40 shrink-0 md:w-44">
      {/* วงเส้นประ */}
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full">
        <circle cx="50" cy="50" r={RADIUS} fill="none" stroke="#2A3444" strokeWidth="0.6" strokeDasharray="1.5 2.5" />
      </svg>
      {/* แสงที่วิ่งรอบวง: หมุนทั้งกล่อง จุดแสงอยู่ด้านบนสุด */}
      <div className="loop-runner absolute inset-0">
        <span
          className="absolute left-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-core-icy shadow-[0_0_12px_4px_rgba(138,191,255,0.6)]"
          style={{ top: `${50 - RADIUS}%` }}
        />
      </div>
      {PERSONALITY_LOOP.map((step, i) => {
        const a = (ANGLES[i] * Math.PI) / 180;
        return (
          <span
            key={step.id}
            className="loop-node absolute -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10 bg-core-obsidian px-2.5 py-1 font-mono text-[9px] tracking-[0.2em] text-core-mist"
            style={{ left: `${50 + Math.cos(a) * RADIUS}%`, top: `${50 + Math.sin(a) * RADIUS}%` }}
          >
            {step.label}
          </span>
        );
      })}
      <span className="absolute inset-0 flex items-center justify-center font-mono text-[9px] tracking-[0.3em] text-core-icy/70">
        LOOP
      </span>
    </div>
  );
};
