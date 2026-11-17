import React from "react";
import type { PersonalityPanelHead } from "../../constants/personality";
import { PersonalityIcon } from "./PersonalityIcon";

interface PersonalityPanelProps {
  head: PersonalityPanelHead;
  children: React.ReactNode;
  className?: string;
}

/** แผงกระจกแบบหน้าจอคอนโซล ใช้ร่วมกันทั้ง How I learn และ Daily rhythm (สูงเท่ากันใน grid) */
export const PersonalityPanel: React.FC<PersonalityPanelProps> = ({ head, children, className = "" }) => (
  <article
    className={`personality-habit relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 md:p-8 ${className}`}
  >
    {/* เส้นสแกนบางๆ ด้านบน แบบเดียวกับแผง HUD ใน hero */}
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-core-icy/40 to-transparent"
    />
    <div className="flex items-center gap-3">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-core-icy">
        <PersonalityIcon name={head.icon} />
      </span>
      <span className="font-mono text-[10px] tracking-[0.25em] text-core-mist">{head.label}</span>
    </div>
    <h3 className="mt-5 text-2xl font-semibold tracking-tight text-core-ink">{head.title}</h3>
    <div className="mt-6 flex flex-1 flex-col">{children}</div>
  </article>
);
