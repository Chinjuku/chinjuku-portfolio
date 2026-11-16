import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { PERSONALITY_WORK_MODES, type PersonalityWorkMode } from "../../constants/personality";
import { usePrefersReducedMotion } from "../motion";

/** สวิตช์ Hybrid: Heads-down ⇄ Sync กดแล้วข้อความ แสง และภาพจุดเปลี่ยนตามโหมด */
export const PersonalityWorkStyleSwitch: React.FC = () => {
  const [mode, setMode] = useState<PersonalityWorkMode["id"]>("focus");
  const body = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const first = useRef(true);
  const current = PERSONALITY_WORK_MODES.find((m) => m.id === mode) ?? PERSONALITY_WORK_MODES[0];
  const sync = mode === "sync";

  // เปลี่ยนโหมดแล้วข้อความค่อยๆ โผล่ (ไม่ทำตอนโหลดครั้งแรก)
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (reduced || !body.current) return;
    const tween = gsap.fromTo(body.current, { y: 8, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, ease: "power3.out" });
    return () => {
      tween.kill();
    };
  }, [mode, reduced]);

  return (
    <div className="mt-6">
      <div
        role="group"
        aria-label="Working style mode"
        className="relative inline-grid grid-cols-2 rounded-full border border-white/10 bg-core-obsidian/60 p-1"
      >
        {/* ปุ่มเลื่อนพื้นหลัง */}
        <span
          aria-hidden="true"
          className={`absolute inset-y-1 left-1 w-[calc(50%-4px)] rounded-full transition-[transform,background-color,box-shadow] duration-500 motion-reduce:transition-none ${
            sync
              ? "translate-x-full bg-emerald-400/15 shadow-[0_0_18px_rgba(52,211,153,0.25)]"
              : "translate-x-0 bg-core-icy/15 shadow-[0_0_18px_rgba(138,191,255,0.25)]"
          }`}
        />
        {PERSONALITY_WORK_MODES.map((m) => (
          <button
            key={m.id}
            type="button"
            aria-pressed={mode === m.id}
            onClick={() => setMode(m.id)}
            className={`relative min-h-[44px] rounded-full px-4 font-mono text-[10px] tracking-[0.2em] transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-core-icy ${
              mode === m.id ? "text-core-ink" : "text-core-mist hover:text-core-chrome"
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      <div ref={body} aria-live="polite" className="mt-5 flex items-start gap-4">
        {/* ภาพจุด: โหมดโฟกัส = จุดเดียว, โหมด sync = จุดหลายจุดเชื่อมกัน */}
        <svg viewBox="0 0 48 32" aria-hidden="true" className="mt-1 h-8 w-12 shrink-0">
          {sync ? (
            <>
              <line x1="10" y1="16" x2="24" y2="8" stroke="rgba(52,211,153,0.5)" />
              <line x1="10" y1="16" x2="24" y2="24" stroke="rgba(52,211,153,0.5)" />
              <line x1="24" y1="8" x2="38" y2="16" stroke="rgba(52,211,153,0.5)" />
              <line x1="24" y1="24" x2="38" y2="16" stroke="rgba(52,211,153,0.5)" />
              {[
                [10, 16],
                [24, 8],
                [24, 24],
                [38, 16],
              ].map(([x, y]) => (
                <circle key={`${x}-${y}`} cx={x} cy={y} r="3" fill="#34D399" />
              ))}
            </>
          ) : (
            <>
              <circle cx="24" cy="16" r="10" fill="none" stroke="rgba(138,191,255,0.35)" />
              <circle cx="24" cy="16" r="4" fill="#8ABFFF" />
            </>
          )}
        </svg>
        <div>
          <p className={`text-sm font-medium ${sync ? "text-emerald-300" : "text-core-icy"}`}>{current.title}</p>
          <p className="mt-1 text-sm leading-relaxed text-core-mist">{current.text}</p>
        </div>
      </div>
    </div>
  );
};
