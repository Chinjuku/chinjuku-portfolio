import React from "react";
import type { Experience } from "../../constants/experiences";

interface ExperienceTelemetrySideProps {
  experience: Experience;
  index: number;
  isEven: boolean; // true = card is left, this side is right; false = the reverse
}

/** Quiet counterpart to each timeline card: a large year and the company. */
export const ExperienceTelemetrySide: React.FC<ExperienceTelemetrySideProps> = ({
  experience,
  index,
  isEven,
}) => {
  const year =
    new Date(experience.finished_date).getFullYear() || experience.period.split(" ").pop();

  return (
    <div
      className={`experience-telemetry hidden w-full select-none flex-col justify-center py-4 md:flex ${
        isEven ? "items-start pl-6 text-left lg:pl-10" : "items-end pr-6 text-right lg:pr-10"
      }`}
    >
      <p className="font-mono text-[11px] tracking-[0.2em] text-core-mist">
        {String(index + 1).padStart(2, "0")} · {experience.period.toUpperCase()}
      </p>
      <p className="exp-year mt-2 text-6xl font-semibold tracking-[-0.04em] text-core-ink/10 lg:text-7xl">
        {year}
      </p>
      <p className="mt-1 text-sm text-core-chrome">{experience.company}</p>
    </div>
  );
};
