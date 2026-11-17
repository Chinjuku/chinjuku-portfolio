import React, { useEffect, useRef, useState } from "react";
import { PERSONALITY_RHYTHM, type PersonalityShift } from "../../constants/personality";

const SIZE = 240;
const C = SIZE / 2;
const R = 92; // วงช่วงเวลา
const CIRC = 2 * Math.PI * R;
const SNAP = 0.25; // ลากแล้วปัดทีละ 15 นาที

/** ชั่วโมง (ทศนิยม) -> องศา: 00:00 อยู่บนสุด วนตามเข็มนาฬิกา */
const hourToDeg = (h: number) => (h / 24) * 360 - 90;
const wrap = (h: number) => ((h % 24) + 24) % 24;
const fmt = (h: number) => {
  const total = Math.round(wrap(h) * 60) % (24 * 60);
  return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
};

/** เวลาไทยตอนนี้ เป็นชั่วโมงทศนิยม */
const nowHours = () => {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: PERSONALITY_RHYTHM.timeZone,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date());
  const h = Number(parts.find((p) => p.type === "hour")?.value ?? 0);
  const m = Number(parts.find((p) => p.type === "minute")?.value ?? 0);
  return h + m / 60;
};

const shiftAt = (hours: number): PersonalityShift | undefined =>
  PERSONALITY_RHYTHM.shifts.find((s) => hours >= s.start && hours < s.end);

// สีของแต่ละช่วง: งานกลางวัน = โครม, side project = ไอซี่
const SHIFT_STROKE: Record<PersonalityShift["id"], string> = {
  day: "rgba(201,209,219,0.6)",
  evening: "#8ABFFF",
};

/**
 * นาฬิกา 24 ชม. ที่เล่นได้: ชี้/ลากรอบวง (หรือกดลูกศรซ้ายขวา) เพื่อดูว่าชั่วโมงนั้นทำอะไร
 * ปกติเข็มบอกเวลาไทยจริง กด "Back to now" เพื่อกลับมาเวลาจริง
 */
export const PersonalityRhythmClock: React.FC = () => {
  const [now, setNow] = useState(nowHours);
  // preview = ชั่วโมงที่ผู้ใช้กำลังดู (null = เวลาจริง), sticky = ค้างไว้จนกด Back to now
  const [preview, setPreview] = useState<number | null>(null);
  const [sticky, setSticky] = useState(false);
  const dragging = useRef(false);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const id = window.setInterval(() => setNow(nowHours()), 30_000);
    return () => window.clearInterval(id);
  }, []);

  const shown = preview ?? now;
  const live = preview === null;
  const active = shiftAt(shown);

  // ตำแหน่งเมาส์/นิ้ว -> ชั่วโมง (ปัดทีละ 15 นาที)
  const hoursFromPointer = (e: React.PointerEvent) => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return null;
    const x = e.clientX - (rect.left + rect.width / 2);
    const y = e.clientY - (rect.top + rect.height / 2);
    const deg = (Math.atan2(y, x) * 180) / Math.PI + 90; // 0 = บนสุด
    return wrap(Math.round((((deg + 360) % 360) / 360) * 24 / SNAP) * SNAP);
  };

  const onPointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    const h = hoursFromPointer(e);
    if (h === null) return;
    dragging.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    setPreview(h);
    setSticky(true);
  };
  const onPointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    // เมาส์: แค่ชี้ก็ดูได้ / นิ้ว: ต้องลาก
    if (!dragging.current && e.pointerType !== "mouse") return;
    const h = hoursFromPointer(e);
    if (h !== null) setPreview(h);
  };
  const onPointerUp = () => {
    dragging.current = false;
  };
  const onPointerLeave = () => {
    if (!dragging.current && !sticky) setPreview(null);
  };

  const backToNow = () => {
    setPreview(null);
    setSticky(false);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    const step = { ArrowRight: 1, ArrowUp: 1, ArrowLeft: -1, ArrowDown: -1 }[e.key];
    if (step !== undefined) {
      e.preventDefault();
      // ใช้ค่าล่าสุดเสมอ (กดรัวๆ ก็ขยับครบทุกครั้ง)
      setPreview((p) => wrap(Math.floor(p ?? now) + step));
      setSticky(true);
    } else if (e.key === "Escape" || e.key === "Home") {
      e.preventDefault();
      backToNow();
    }
  };

  const needle = hourToDeg(shown);
  const statusLabel = active ? active.status : PERSONALITY_RHYTHM.offStatus;

  return (
    // จอกว้างพอ (sm / xl) นาฬิกาอยู่ข้างข้อความ ช่วง lg แผงแคบเลยวางซ้อนกัน
    <div className="flex flex-1 flex-col items-center gap-6 sm:flex-row sm:gap-8 lg:flex-col xl:flex-row">
      <div
        role="slider"
        tabIndex={0}
        aria-label="Hour of the day, Bangkok time"
        aria-valuemin={0}
        aria-valuemax={23}
        aria-valuenow={Math.floor(shown)}
        aria-valuetext={`${fmt(shown)}, ${active ? active.label : "offline"}`}
        onKeyDown={onKeyDown}
        className="relative w-[220px] shrink-0 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-core-icy"
      >
        <svg
          ref={svgRef}
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          aria-hidden="true"
          className="h-auto w-full cursor-grab touch-none select-none active:cursor-grabbing"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onPointerLeave={onPointerLeave}
        >
          <defs>
            <filter id="rhythm-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" />
            </filter>
          </defs>
          {/* วงพื้น */}
          <circle cx={C} cy={C} r={R} fill="none" stroke="#1B2230" strokeWidth="12" />
          {/* ช่วงเวลา: วาดด้วย dasharray แล้วหมุนไปจุดเริ่ม */}
          {PERSONALITY_RHYTHM.shifts.map((s) => {
            const len = ((s.end - s.start) / 24) * CIRC;
            const on = active?.id === s.id;
            return (
              <g key={s.id} transform={`rotate(${hourToDeg(s.start)} ${C} ${C})`}>
                {on && (
                  <circle
                    cx={C}
                    cy={C}
                    r={R}
                    fill="none"
                    stroke={SHIFT_STROKE[s.id]}
                    strokeWidth="12"
                    strokeDasharray={`${len} ${CIRC}`}
                    filter="url(#rhythm-glow)"
                    opacity="0.8"
                  />
                )}
                <circle
                  cx={C}
                  cy={C}
                  r={R}
                  fill="none"
                  stroke={SHIFT_STROKE[s.id]}
                  strokeWidth={on ? 12 : 8}
                  strokeLinecap="round"
                  strokeDasharray={`${len} ${CIRC}`}
                  opacity={on ? 1 : 0.55}
                  className="transition-[stroke-width,opacity] duration-300"
                />
              </g>
            );
          })}
          {/* ขีดชั่วโมงด้านนอกวง + เลข 00 / 06 / 12 / 18 */}
          {Array.from({ length: 24 }, (_, h) => {
            const a = (hourToDeg(h) * Math.PI) / 180;
            const major = h % 6 === 0;
            const r1 = R + 10;
            const r2 = r1 + (major ? 6 : 3);
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
                    x={C + Math.cos(a) * (R - 20)}
                    y={C + Math.sin(a) * (R - 20)}
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
          {/* เข็ม: เป็นแค่ขีดบนวง + ปุ่มจับ ไม่ลากเส้นผ่านกลาง จะได้ไม่ทับตัวเลขตรงกลาง */}
          <g transform={`rotate(${needle} ${C} ${C})`}>
            <line x1={C + R - 12} y1={C} x2={C + R + 12} y2={C} stroke="#F4F6FA" strokeWidth="2" strokeLinecap="round" />
            <circle
              cx={C + R}
              cy={C}
              r="7"
              fill={live ? "#F4F6FA" : "#8ABFFF"}
              stroke="#080B12"
              strokeWidth="2"
            />
          </g>
        </svg>
        {/* ตัวเลขตรงกลาง (ห่างจากเข็มเสมอ) */}
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-mono text-2xl tracking-tight text-core-ink">{fmt(shown)}</span>
          <span className={`mt-1 font-mono text-[9px] tracking-[0.25em] ${live ? "text-core-mist" : "text-core-icy"}`}>
            {live ? PERSONALITY_RHYTHM.zoneLabel : "PREVIEW"}
          </span>
        </div>
      </div>

      <div className="w-full flex-1">
        <p aria-live="polite" className="flex items-center gap-2 font-mono text-[10px] tracking-[0.2em]">
          <span aria-hidden="true" className="relative flex h-1.5 w-1.5">
            {live && active && (
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-core-icy opacity-60 motion-reduce:animate-none" />
            )}
            <span className={`relative inline-flex h-1.5 w-1.5 rounded-full ${active ? "bg-core-icy" : "bg-core-mist"}`} />
          </span>
          <span className={active ? "text-core-ink" : "text-core-mist"}>
            {live ? "NOW" : fmt(shown)} · {statusLabel}
          </span>
        </p>
        <p className="mt-3 min-h-[3rem] text-sm leading-relaxed text-core-chrome md:text-[15px]">
          {active ? active.detail : PERSONALITY_RHYTHM.offDetail}
        </p>

        {/* ปุ่มช่วงเวลา: กดแล้วเข็มกระโดดไปช่วงนั้น */}
        <div className="mt-4 flex flex-wrap gap-2">
          {PERSONALITY_RHYTHM.shifts.map((s) => {
            const on = active?.id === s.id;
            return (
              <button
                key={s.id}
                type="button"
                aria-pressed={!live && on}
                onClick={() => {
                  setPreview(s.start + (s.end - s.start) / 2);
                  setSticky(true);
                }}
                className={`inline-flex min-h-[44px] items-center gap-2 whitespace-nowrap rounded-full border px-3.5 text-xs transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-core-icy ${
                  on ? "border-core-icy/50 bg-core-icy/10 text-core-ink" : "border-white/10 text-core-mist hover:text-core-ink"
                }`}
              >
                <span aria-hidden="true" className="h-1.5 w-4 rounded-full" style={{ background: SHIFT_STROKE[s.id] }} />
                {s.label}
                <span className="font-mono text-[10px] text-core-mist">
                  {fmt(s.start)}–{fmt(s.end)}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-4 flex min-h-[44px] items-center justify-between gap-3">
          <span className="font-mono text-[9px] tracking-[0.25em] text-core-mist">{PERSONALITY_RHYTHM.scrubHint}</span>
          {!live && (
            <button
              type="button"
              onClick={backToNow}
              className="inline-flex min-h-[44px] items-center rounded-full border border-white/10 px-3.5 font-mono text-[10px] tracking-[0.2em] text-core-icy transition-colors hover:border-core-icy/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-core-icy"
            >
              ● {PERSONALITY_RHYTHM.liveLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
