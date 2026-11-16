import React, { useEffect, useState } from "react";
import { PERSONALITY_RHYTHM, type PersonalityShift } from "../../constants/personality";

const SIZE = 220;
const C = SIZE / 2;
const R = 84; // วงช่วงเวลา
const CIRC = 2 * Math.PI * R;

/** ชั่วโมง (ทศนิยม) -> องศา: 00:00 อยู่บนสุด วนตามเข็มนาฬิกา */
const hourToDeg = (h: number) => (h / 24) * 360 - 90;

/** เวลาไทยตอนนี้ เป็นชั่วโมงทศนิยม + ข้อความ HH:MM */
const nowInZone = () => {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: PERSONALITY_RHYTHM.timeZone,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date());
  const h = Number(parts.find((p) => p.type === "hour")?.value ?? 0);
  const m = Number(parts.find((p) => p.type === "minute")?.value ?? 0);
  return { hours: h + m / 60, label: `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}` };
};

const shiftAt = (hours: number): PersonalityShift | undefined =>
  PERSONALITY_RHYTHM.shifts.find((s) => hours >= s.start && hours < s.end);

// สีของแต่ละช่วง: งานกลางวัน = โครม, side project = ไอซี่เรืองแสง
const SHIFT_STROKE: Record<PersonalityShift["id"], string> = {
  day: "rgba(201,209,219,0.55)",
  evening: "#8ABFFF",
};

/** นาฬิกา 24 ชม. แสดงช่วงงานกลางวัน / side project ตอนค่ำ และเข็มบอกเวลาไทยจริงตอนนี้ */
export const PersonalityRhythmClock: React.FC = () => {
  const [now, setNow] = useState(nowInZone);

  // อัปเดตทุก 30 วินาที พอให้เข็มขยับตามนาที
  useEffect(() => {
    const id = window.setInterval(() => setNow(nowInZone()), 30_000);
    return () => window.clearInterval(id);
  }, []);

  const active = shiftAt(now.hours);
  const needle = hourToDeg(now.hours);

  return (
    // คอลัมน์แคบ (tablet 2 คอลัมน์) ให้นาฬิกาอยู่บน คำอธิบายอยู่ล่าง
    <figure className="flex flex-col items-center gap-5 sm:flex-row sm:gap-8 md:flex-col md:items-start xl:flex-row xl:items-center">
      <div className="relative w-[200px] shrink-0">
        <svg
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          className="h-auto w-full"
          role="img"
          aria-label={`24-hour day. Day job ${PERSONALITY_RHYTHM.shifts[0].start}:00 to ${PERSONALITY_RHYTHM.shifts[0].end}:00, side projects ${PERSONALITY_RHYTHM.shifts[1].start}:00 to midnight. Now ${now.label} in Bangkok.`}
        >
          <defs>
            <filter id="rhythm-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" />
            </filter>
          </defs>
          {/* วงพื้น */}
          <circle cx={C} cy={C} r={R} fill="none" stroke="#1B2230" strokeWidth="10" />
          {/* ช่วงเวลา: วาดด้วย dasharray แล้วหมุนไปจุดเริ่ม */}
          {PERSONALITY_RHYTHM.shifts.map((s) => {
            const len = ((s.end - s.start) / 24) * CIRC;
            const isNow = active?.id === s.id;
            return (
              <g key={s.id} transform={`rotate(${hourToDeg(s.start)} ${C} ${C})`}>
                {s.id === "evening" && (
                  <circle
                    cx={C}
                    cy={C}
                    r={R}
                    fill="none"
                    stroke={SHIFT_STROKE[s.id]}
                    strokeWidth="10"
                    strokeDasharray={`${len} ${CIRC}`}
                    filter="url(#rhythm-glow)"
                    opacity={isNow ? 0.9 : 0.45}
                  />
                )}
                <circle
                  cx={C}
                  cy={C}
                  r={R}
                  fill="none"
                  stroke={SHIFT_STROKE[s.id]}
                  strokeWidth={isNow ? 10 : 8}
                  strokeLinecap="round"
                  strokeDasharray={`${len} ${CIRC}`}
                />
              </g>
            );
          })}
          {/* ขีดชั่วโมง + เลข 0 / 6 / 12 / 18 */}
          {Array.from({ length: 24 }, (_, h) => {
            const a = (hourToDeg(h) * Math.PI) / 180;
            const major = h % 6 === 0;
            const r1 = R - 14;
            const r2 = r1 - (major ? 6 : 3);
            return (
              <g key={h}>
                <line
                  x1={C + Math.cos(a) * r1}
                  y1={C + Math.sin(a) * r1}
                  x2={C + Math.cos(a) * r2}
                  y2={C + Math.sin(a) * r2}
                  stroke={major ? "#929EAF" : "#2A3444"}
                  strokeWidth="1"
                />
                {major && (
                  <text
                    x={C + Math.cos(a) * (R + 18)}
                    y={C + Math.sin(a) * (R + 18)}
                    textAnchor="middle"
                    dominantBaseline="central"
                    className="fill-core-mist font-mono"
                    fontSize="9"
                  >
                    {String(h).padStart(2, "0")}
                  </text>
                )}
              </g>
            );
          })}
          {/* เข็มเวลาตอนนี้ */}
          <g transform={`rotate(${needle} ${C} ${C})`} className="transition-transform duration-1000">
            <line x1={C} y1={C} x2={C + R + 6} y2={C} stroke="#F4F6FA" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx={C + R} cy={C} r="4.5" fill="#F4F6FA" />
          </g>
          <circle cx={C} cy={C} r="3" fill="#F4F6FA" />
        </svg>
        {/* เวลาตรงกลาง */}
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center pt-12">
          <span className="font-mono text-lg tracking-tight text-core-ink">{now.label}</span>
          <span className="font-mono text-[9px] tracking-[0.25em] text-core-mist">{PERSONALITY_RHYTHM.zoneLabel}</span>
        </div>
      </div>

      <figcaption className="w-full space-y-3 sm:w-auto">
        <p className="flex items-center gap-2 font-mono text-[10px] tracking-[0.2em]">
          <span aria-hidden="true" className="relative flex h-1.5 w-1.5">
            {active && (
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-core-icy opacity-60 motion-reduce:animate-none" />
            )}
            <span className={`relative inline-flex h-1.5 w-1.5 rounded-full ${active ? "bg-core-icy" : "bg-core-mist"}`} />
          </span>
          <span className={active ? "text-core-ink" : "text-core-mist"}>
            NOW · {active ? active.status : PERSONALITY_RHYTHM.offStatus}
          </span>
        </p>
        <ul className="space-y-2">
          {PERSONALITY_RHYTHM.shifts.map((s) => (
            <li key={s.id} className="flex items-center gap-3 text-sm text-core-chrome">
              <span
                aria-hidden="true"
                className="h-1.5 w-5 rounded-full"
                style={{ background: SHIFT_STROKE[s.id] }}
              />
              {s.label}
              <span className="font-mono text-[11px] text-core-mist">
                {String(s.start).padStart(2, "0")}:00–{s.end === 24 ? "00" : String(s.end).padStart(2, "0")}:00
              </span>
            </li>
          ))}
        </ul>
      </figcaption>
    </figure>
  );
};
