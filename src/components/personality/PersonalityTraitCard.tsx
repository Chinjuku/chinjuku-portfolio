import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, RotateCcw } from "lucide-react";
import { PERSONALITY_COPY, type PersonalityTrait } from "../../constants/personality";
import { TiltCard } from "../motion";
import { PersonalityIcon } from "./PersonalityIcon";

interface PersonalityTraitCardProps {
  trait: PersonalityTrait;
  index: number;
  total: number;
  highlighted: boolean;
}

const pad = (n: number) => String(n).padStart(2, "0");

const faceBase =
  "flex h-full flex-col rounded-2xl border p-6 transition-[border-color,box-shadow] duration-700 [backface-visibility:hidden] [grid-area:1/1] md:p-7";

/**
 * การ์ดนิสัยที่พลิกได้: ด้านหน้า = คำอธิบาย, ด้านหลัง = ตัวอย่างจากงานจริง + ลิงก์ case study
 * ทั้งสองด้านซ้อนอยู่ช่อง grid เดียวกัน การ์ดจึงสูงเท่ากับด้านที่ยาวกว่าเสมอ
 */
export const PersonalityTraitCard: React.FC<PersonalityTraitCardProps> = ({ trait, index, total, highlighted }) => {
  const [flipped, setFlipped] = useState(false);
  const border = highlighted
    ? "border-core-icy/60 shadow-[0_0_40px_rgba(138,191,255,0.18)]"
    : "border-white/[0.08] group-hover:border-core-icy/30";

  return (
    <TiltCard max={5} className="group h-full rounded-2xl">
      <div
        className={`grid h-full transition-transform duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)] [transform-style:preserve-3d] motion-reduce:transition-none ${
          flipped ? "[transform:rotateY(180deg)]" : ""
        }`}
      >
        {/* ด้านหน้า */}
        <article inert={flipped} aria-hidden={flipped} className={`${faceBase} ${border} bg-white/[0.02]`}>
          <div className="flex items-center justify-between">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-core-icy transition-shadow duration-500 group-hover:shadow-[0_0_18px_rgba(138,191,255,0.35)]">
              <PersonalityIcon name={trait.icon} />
            </span>
            <span className="font-mono text-[11px] tracking-[0.2em] text-core-mist">
              {pad(index + 1)} / {pad(total)}
            </span>
          </div>
          <h3 className="mt-6 text-2xl font-semibold tracking-tight text-core-ink">{trait.name}</h3>
          <p className="mt-1 text-sm text-core-chrome">{trait.tagline}</p>
          <p className="mt-4 text-sm leading-relaxed text-core-mist md:text-[15px]">{trait.description}</p>
          <button
            type="button"
            onClick={() => setFlipped(true)}
            className="mt-auto inline-flex min-h-[44px] items-center gap-2 self-start pt-5 font-mono text-[11px] tracking-[0.2em] text-core-icy transition-colors hover:text-core-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-core-icy"
          >
            <RotateCcw aria-hidden="true" className="h-3.5 w-3.5" />
            {PERSONALITY_COPY.flipLabel.toUpperCase()}
            <span className="sr-only">: {trait.name}</span>
          </button>
        </article>

        {/* ด้านหลัง */}
        <article
          inert={!flipped}
          aria-hidden={!flipped}
          className={`${faceBase} ${border} bg-gradient-to-b from-core-icy/[0.07] to-white/[0.01] [transform:rotateY(180deg)]`}
        >
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] tracking-[0.25em] text-core-icy">
              {PERSONALITY_COPY.flipLabel.toUpperCase()} · {trait.name.toUpperCase()}
            </span>
            <span className="font-mono text-[11px] tracking-[0.2em] text-core-mist">
              {pad(index + 1)} / {pad(total)}
            </span>
          </div>
          <h3 className="mt-6 text-2xl font-semibold tracking-tight text-core-ink">{trait.example.project}</h3>
          <p className="mt-4 text-sm leading-relaxed text-core-mist md:text-[15px]">{trait.example.note}</p>
          <div className="mt-auto flex flex-wrap items-center gap-2 pt-5">
            <Link
              to={`/projects/${trait.example.slug}`}
              className="inline-flex min-h-[44px] items-center gap-1.5 rounded-full bg-core-chrome px-4 text-xs font-medium text-core-obsidian transition-colors hover:bg-core-ink"
            >
              {PERSONALITY_COPY.caseStudyLabel} <ArrowRight aria-hidden="true" className="h-3.5 w-3.5" />
            </Link>
            <button
              type="button"
              onClick={() => setFlipped(false)}
              className="inline-flex min-h-[44px] items-center gap-1.5 rounded-full border border-core-graphite px-4 text-xs font-medium text-core-ink transition-colors hover:border-core-mist focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-core-icy"
            >
              <RotateCcw aria-hidden="true" className="h-3.5 w-3.5" /> {PERSONALITY_COPY.flipBackLabel}
            </button>
          </div>
        </article>
      </div>
    </TiltCard>
  );
};
