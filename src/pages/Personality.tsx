import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { traitDomId } from "../constants/personality";
import {
  PersonalityClosing,
  PersonalityHabits,
  PersonalityHero,
  PersonalityPillars,
  PersonalityTraits,
} from "../components/personality";
// import ตรงจากไฟล์ (ไม่ผ่าน barrel ของ core) เพื่อไม่ให้ three.js หลุดเข้า bundle หลัก
import { createCoreState } from "../components/hero/core/scrollState";
import { useIsMobile, useReducedMotion } from "../components/hero/core/hooks";

gsap.registerPlugin(ScrollTrigger);

const HIGHLIGHT_MS = 1800;

/** หน้า /personality: The Curious Creator */
const Personality: React.FC = () => {
  const pageRef = useRef<HTMLDivElement>(null);
  const coreState = useMemo(() => createCoreState(), []);
  const isMobile = useIsMobile();
  const reduced = useReducedMotion();
  const [highlighted, setHighlighted] = useState<string | null>(null);
  const highlightTimer = useRef<number | undefined>(undefined);

  // ชื่อแท็บแบบเดียวกับหน้า project detail
  useEffect(() => {
    const prev = document.title;
    document.title = "Personality · Chinjuku";
    return () => {
      document.title = prev;
    };
  }, []);

  useEffect(() => () => window.clearTimeout(highlightTimer.current), []);

  // คลิกแฉกของ radar -> เลื่อนไปการ์ดนิสัยนั้น แล้วเรืองแสงสั้นๆ
  const onSelectTrait = useCallback(
    (traitId: string) => {
      document
        .getElementById(traitDomId(traitId))
        ?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "center" });
      setHighlighted(traitId);
      window.clearTimeout(highlightTimer.current);
      highlightTimer.current = window.setTimeout(() => setHighlighted(null), HIGHLIGHT_MS);
    },
    [reduced],
  );

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (reduced) return;

      gsap.fromTo(
        ".personality-intro > *",
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, stagger: 0.08, ease: "power3.out", delay: 0.15 },
      );

      // แผง HUD: แถวข้อมูลไล่ขึ้นมาทีละแถวหลังหัวข้อ
      gsap.fromTo(
        ".personality-hud-row",
        { x: -12, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.5, stagger: 0.08, ease: "power3.out", delay: 0.7 },
      );

      // การ์ดค่อยๆ ขึ้นมาตอน scroll ถึง (ใช้ batch จะได้ stagger ทีละแถว)
      ScrollTrigger.batch(".personality-trait, .personality-pillar, .personality-habit, .personality-cta", {
        start: "top 88%",
        once: true,
        onEnter: (els) =>
          gsap.fromTo(
            els,
            { y: 35, opacity: 0, scale: 0.97 },
            { y: 0, opacity: 1, scale: 1, duration: 0.6, stagger: 0.09, ease: "back.out(1.2)", overwrite: true },
          ),
      });

      // แถวรายการ: เส้นคั่นค่อยๆ เลื่อนเข้ามา
      gsap.utils.toArray<HTMLElement>(".personality-habit").forEach((habit) => {
        gsap.fromTo(
          habit.querySelectorAll(".personality-habit-row"),
          { x: -16, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.5,
            stagger: 0.07,
            ease: "power3.out",
            scrollTrigger: { trigger: habit, start: "top 80%", once: true },
          },
        );
      });

      // Philosophy: ตัวอักษรสว่างขึ้นทีละตัวตามการ scroll (ย้อนกลับได้เมื่อ scroll ขึ้น)
      gsap.fromTo(
        ".personality-scrub-char",
        { opacity: 0.12 },
        {
          opacity: 1,
          ease: "none",
          stagger: 0.05,
          scrollTrigger: { trigger: ".personality-closing", start: "top 80%", end: "top 25%", scrub: 0.6 },
        },
      );
    }, pageRef);
    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, [reduced]);

  return (
    <div ref={pageRef} className="relative overflow-hidden bg-core-obsidian text-core-ink">
      <PersonalityHero coreState={coreState} isMobile={isMobile} onSelectTrait={onSelectTrait} />
      <PersonalityTraits highlighted={highlighted} />
      <PersonalityPillars />
      <PersonalityHabits />
      <PersonalityClosing />
    </div>
  );
};

export default Personality;
