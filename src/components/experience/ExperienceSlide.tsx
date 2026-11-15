import React from "react";
import type { Experience } from "../../constants/experiences";

const kindOf = (e: Experience): string => {
  if (e.tags.some((t) => /intern/i.test(t))) return "INTERNSHIP";
  if (e.tags.some((t) => /part-time/i.test(t))) return "PART-TIME";
  if (/registration|staff/i.test(e.role) && !/dev/i.test(e.role)) return "EVENT STAFF";
  return "UNIVERSITY EVENT";
};

interface ExperienceSlideProps {
  experience: Experience;
  index: number;
}

/** One stop on the horizontal timeline: dot on the rail, year, and the role card. */
export const ExperienceSlide: React.FC<ExperienceSlideProps> = ({ experience, index }) => {
  const year = new Date(experience.finished_date).getFullYear();
  return (
    <article className="exp-slide group w-[min(380px,82vw)] shrink-0 transition-opacity duration-500">
      {/* dot sits on the shared rail */}
      <div className="relative h-6">
        <span className="exp-dot absolute left-0 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full border border-core-mist/60 bg-core-obsidian transition-all duration-500" />
      </div>
      <div className="mt-4 flex items-baseline gap-3">
        <span className="font-mono text-[11px] tracking-[0.2em] text-core-mist">{String(index + 1).padStart(2, "0")}</span>
        <span className="exp-year text-5xl font-semibold tracking-[-0.04em] text-core-ink/15 transition-colors duration-500">
          {year}
        </span>
      </div>
      <div className="exp-card mt-4 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 transition-colors duration-500">
        <p className="font-mono text-[10px] tracking-[0.2em] text-core-icy">{kindOf(experience)}</p>
        <h3 className="mt-3 text-xl font-semibold tracking-tight text-core-ink">{experience.role}</h3>
        <p className="mt-1 text-sm text-core-chrome">
          {experience.company} <span className="text-core-mist">· {experience.period}</span>
        </p>
        <p className="mt-4 text-sm leading-relaxed text-core-mist">{experience.description}</p>
        <ul className="mt-5 flex flex-wrap gap-1.5">
          {experience.tags.map((t) => (
            <li key={t} className="rounded-full border border-white/10 px-2.5 py-0.5 font-mono text-[10px] text-core-chrome">
              {t}
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
};
