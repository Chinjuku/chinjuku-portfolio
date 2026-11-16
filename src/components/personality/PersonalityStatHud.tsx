import React from "react";
import { PERSONALITY_COPY, PERSONALITY_HUD } from "../../constants/personality";

/** แผงข้อมูลแบบหน้าโปรไฟล์ในเกม: CLASS / MINDSET / STYLE / MOTTO */
export const PersonalityStatHud: React.FC<{ className?: string }> = ({ className = "" }) => (
  <div
    className={`personality-hud relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-xl ${className}`}
  >
    {/* เส้นสแกนบางๆ ด้านบน ให้ฟีลหน้าจอ HUD */}
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-core-icy/60 to-transparent"
    />
    <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-3">
      <span className="font-mono text-[10px] tracking-[0.25em] text-core-mist">{PERSONALITY_COPY.hudTitle}</span>
      <span className="flex items-center gap-1.5 font-mono text-[10px] tracking-[0.2em] text-emerald-400">
        <span aria-hidden="true" className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60 motion-reduce:animate-none" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
        </span>
        {PERSONALITY_COPY.hudStatus}
      </span>
    </div>
    <dl className="px-5">
      {PERSONALITY_HUD.map((row) => (
        <div
          key={row.label}
          className="personality-hud-row grid grid-cols-[6.5rem_1fr] gap-3 border-b border-white/[0.05] py-3 last:border-b-0"
        >
          <dt className="pt-0.5 font-mono text-[10px] tracking-[0.25em] text-core-icy">{row.label}</dt>
          <dd className="text-sm text-core-ink">{row.value}</dd>
        </div>
      ))}
    </dl>
  </div>
);
