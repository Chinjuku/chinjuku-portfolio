import React, { useEffect, useState } from "react";
import { PERSONALITY_TRAITS } from "../../constants/personality";
import { RADAR_HOVER, RADAR_REST, RADAR_RINGS, radarAxis, radarPoints } from "./radarGeometry";

const COUNT = PERSONALITY_TRAITS.length;
const SIZE = 400;
const C = SIZE / 2;
const R = 108; // เว้นที่ให้ป้ายชื่อด้านข้างไม่ชนขอบจอมือถือ
const LABEL_AT = 1.32;

const toAttr = (pts: [number, number][]) => pts.map(([x, y]) => `${C + x},${C - y}`).join(" ");

interface PersonalityStatRadar2DProps {
  onSelect: (traitId: string) => void;
  className?: string;
}

/**
 * Radar stat แบบ 2D (SVG) สำหรับมือถือ / เครื่องที่ไม่มี WebGL / ระหว่างรอ 3D โหลด
 * ป้ายชื่อเป็นปุ่มจริง กดด้วยนิ้วหรือคีย์บอร์ดได้
 */
export const PersonalityStatRadar2D: React.FC<PersonalityStatRadar2DProps> = ({ onSelect, className = "" }) => {
  const [active, setActive] = useState<number | null>(null);
  // reveal: เริ่มจากจุดกลางแล้วขยายออกหลัง mount
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const id = window.requestAnimationFrame(() => setShown(true));
    return () => window.cancelAnimationFrame(id);
  }, []);

  const scales = PERSONALITY_TRAITS.map((_, i) => (active === i ? RADAR_HOVER : RADAR_REST));
  const shape = radarPoints(scales, R);

  return (
    <div className={`relative mx-auto aspect-square w-full max-w-[420px] ${className}`}>
      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="absolute inset-0 h-full w-full" aria-hidden="true">
        <defs>
          <radialGradient id="pr-core" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#B5D5FF" stopOpacity="0.95" />
            <stop offset="40%" stopColor="#8ABFFF" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#8ABFFF" stopOpacity="0" />
          </radialGradient>
        </defs>
        {RADAR_RINGS.map((r, i) => (
          <polygon
            key={r}
            points={toAttr(radarPoints(Array(COUNT).fill(r), R))}
            fill="none"
            stroke={i === RADAR_RINGS.length - 1 ? "rgba(138,191,255,0.35)" : "#2A3444"}
            strokeWidth="1"
          />
        ))}
        {PERSONALITY_TRAITS.map((t, i) => {
          const [x, y] = radarAxis(i, COUNT);
          return (
            <line
              key={t.id}
              x1={C}
              y1={C}
              x2={C + x * R}
              y2={C - y * R}
              stroke={active === i ? "rgba(138,191,255,0.8)" : "#2A3444"}
              strokeWidth="1"
              className="transition-[stroke] duration-300"
            />
          );
        })}
        <g
          style={{ transformOrigin: `${C}px ${C}px` }}
          className={`transition-transform duration-1000 ease-out motion-reduce:transition-none ${shown ? "scale-100" : "scale-0"}`}
        >
          <polygon points={toAttr(shape)} fill="rgba(138,191,255,0.14)" stroke="#8ABFFF" strokeWidth="1.5" />
          {shape.map(([x, y], i) => (
            <circle
              key={PERSONALITY_TRAITS[i].id}
              cx={C + x}
              cy={C - y}
              r={active === i ? 6 : 4}
              fill="#8ABFFF"
              className="transition-[r] duration-300"
            />
          ))}
        </g>
        {/* แทน Neural Core ด้วยแสงกลม */}
        <circle cx={C} cy={C} r="34" fill="url(#pr-core)" />
        <circle cx={C} cy={C} r="9" fill="#DCEBFF" />
      </svg>

      {PERSONALITY_TRAITS.map((trait, i) => {
        const [x, y] = radarAxis(i, COUNT);
        return (
          <button
            key={trait.id}
            type="button"
            onClick={() => onSelect(trait.id)}
            onPointerEnter={() => setActive(i)}
            onPointerLeave={() => setActive(null)}
            onFocus={() => setActive(i)}
            onBlur={() => setActive(null)}
            aria-label={`${trait.name}: jump to trait`}
            style={{
              left: `${((C + x * R * LABEL_AT) / SIZE) * 100}%`,
              top: `${((C - y * R * LABEL_AT) / SIZE) * 100}%`,
            }}
            className={`absolute flex min-h-[44px] -translate-x-1/2 -translate-y-1/2 items-center whitespace-nowrap rounded-full px-2 font-mono text-[10px] tracking-[0.2em] transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-core-icy ${
              active === i ? "text-core-ink" : "text-core-mist"
            }`}
          >
            <span
              className={`rounded-full border px-2.5 py-1 backdrop-blur-md ${
                active === i ? "border-core-icy/60 bg-core-icy/10" : "border-white/10 bg-core-obsidian/60"
              }`}
            >
              {trait.name.toUpperCase()}
            </span>
          </button>
        );
      })}
    </div>
  );
};
