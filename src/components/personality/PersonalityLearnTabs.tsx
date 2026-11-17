import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { PERSONALITY_LEARN } from "../../constants/personality";
import { usePrefersReducedMotion } from "../motion";

const CYCLE_SECONDS = 4.5;
const METHODS = PERSONALITY_LEARN.methods;
const pad = (n: number) => String(n).padStart(2, "0");

/**
 * แท็บวิธีเรียนรู้: สลับเองทุก 4.5 วิ (มีแถบความคืบหน้า) ตอนอยู่บนจอ
 * หยุดชั่วคราวตอนเอาเมาส์ชี้ และหยุดถาวรเมื่อผู้ใช้กดเลือกเอง
 */
export const PersonalityLearnTabs: React.FC = () => {
  const [index, setIndex] = useState(0);
  const [auto, setAuto] = useState(true);
  const [onScreen, setOnScreen] = useState(false);
  const [hovering, setHovering] = useState(false);
  const reduced = usePrefersReducedMotion();
  const root = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const detail = useRef<HTMLDivElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);
  const firstRender = useRef(true);
  const method = METHODS[index];
  const running = auto && onScreen && !hovering && !reduced;

  // นับเฉพาะตอนแผงอยู่บนจอ
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting), { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // แถบความคืบหน้า: เต็มแล้วไปแท็บถัดไป (GSAP เป็นตัวจับเวลา จะได้หยุด/เล่นต่อได้เนียน)
  useEffect(() => {
    const el = bar.current;
    if (!el || !auto || reduced) return;
    const tween = gsap.fromTo(
      el,
      { scaleX: 0 },
      {
        scaleX: 1,
        duration: CYCLE_SECONDS,
        ease: "none",
        paused: true,
        onComplete: () => setIndex((i) => (i + 1) % METHODS.length),
      },
    );
    tweenRef.current = tween;
    return () => {
      tween.kill();
      tweenRef.current = null;
    };
  }, [index, auto, reduced]);

  useEffect(() => {
    const t = tweenRef.current;
    if (!t) return;
    if (running) t.play();
    else t.pause();
  }, [running, index]);

  // เปลี่ยนแท็บแล้วรายละเอียดค่อยๆ โผล่
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    if (reduced || !detail.current) return;
    const t = gsap.fromTo(detail.current, { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, ease: "power3.out" });
    return () => {
      t.kill();
    };
  }, [index, reduced]);

  const pick = (i: number) => {
    setAuto(false);
    setIndex(i);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const next = (index + (e.key === "ArrowRight" ? 1 : METHODS.length - 1)) % METHODS.length;
    pick(next);
    document.getElementById(`learn-tab-${METHODS[next].id}`)?.focus();
  };

  return (
    <div
      ref={root}
      className="flex flex-1 flex-col"
      onPointerEnter={() => setHovering(true)}
      onPointerLeave={() => setHovering(false)}
    >
      <div role="tablist" aria-label="Ways I learn" onKeyDown={onKeyDown} className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
        {METHODS.map((m, i) => {
          const active = i === index;
          return (
            <button
              key={m.id}
              id={`learn-tab-${m.id}`}
              type="button"
              role="tab"
              aria-selected={active}
              aria-controls="learn-panel"
              tabIndex={active ? 0 : -1}
              onClick={() => pick(i)}
              className={`relative min-h-[44px] overflow-hidden whitespace-nowrap rounded-xl border px-3 font-mono text-[10px] tracking-[0.2em] transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-core-icy ${
                active
                  ? "border-core-icy/50 bg-core-icy/10 text-core-ink"
                  : "border-white/10 text-core-mist hover:border-white/25 hover:text-core-chrome"
              }`}
            >
              {m.tab}
              {/* แถบเวลาของแท็บที่กำลังเล่นอยู่ */}
              {active && auto && !reduced && (
                <span
                  ref={bar}
                  aria-hidden="true"
                  className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-core-icy"
                />
              )}
            </button>
          );
        })}
      </div>

      <div
        id="learn-panel"
        role="tabpanel"
        aria-labelledby={`learn-tab-${method.id}`}
        className="mt-6 flex flex-1 flex-col justify-between rounded-xl border border-white/[0.06] bg-core-obsidian/40 p-5 md:p-6"
      >
        <div ref={detail}>
          <span className="font-mono text-[11px] tracking-[0.2em] text-core-icy">
            {pad(index + 1)} / {pad(METHODS.length)}
          </span>
          <p className="mt-3 text-xl font-semibold tracking-tight text-core-ink md:text-2xl">{method.title}</p>
          <p className="mt-3 max-w-[48ch] text-sm leading-relaxed text-core-mist md:text-[15px]">{method.text}</p>
        </div>
        {/* จุดบอกตำแหน่ง + สถานะ auto */}
        <div className="mt-6 flex items-center justify-between font-mono text-[10px] tracking-[0.2em] text-core-mist">
          <span aria-hidden="true" className="flex gap-1.5">
            {METHODS.map((m, i) => (
              <span
                key={m.id}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === index ? "w-4 bg-core-icy" : "w-1.5 bg-core-graphite"
                }`}
              />
            ))}
          </span>
          <span>{auto && !reduced ? (running ? "AUTO" : "PAUSED") : "MANUAL"}</span>
        </div>
      </div>
    </div>
  );
};
