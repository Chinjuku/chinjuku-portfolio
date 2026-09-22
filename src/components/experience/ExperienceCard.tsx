import React from "react";
import { Calendar, Briefcase, Radio } from "lucide-react";
import type { Experience } from "../../constants/experiences";

interface ExperienceCardProps {
  experience: Experience;
  isEven: boolean;
}

const getExperienceCategory = (exp: Experience) => {
  if (exp.tags.some((t) => t.toLowerCase().includes("intern"))) {
    return {
      label: "INTERNSHIP // ENTERPRISE",
      color: "border-blue-500/30 text-blue-600 dark:text-starlight-blue bg-blue-500/10",
    };
  }
  if (exp.tags.some((t) => t.toLowerCase().includes("part-time"))) {
    return {
      label: "PART-TIME // ACTIVE OPS",
      color: "border-cyan-500/30 text-cyan-600 dark:text-starlight-cyan bg-cyan-500/10",
    };
  }
  if (exp.role.toLowerCase().includes("tech staff")) {
    return {
      label: "TECH LEAD // ACADEMIC",
      color: "border-purple-500/30 text-purple-600 dark:text-nebula-glow bg-purple-500/10",
    };
  }
  return {
    label: "EVENT OPS // MANAGEMENT",
    color: "border-amber-500/30 text-amber-600 dark:text-amber-400 bg-amber-500/10",
  };
};

export const ExperienceCard: React.FC<ExperienceCardProps> = ({
  experience,
  isEven,
}) => {
  const category = getExperienceCategory(experience);

  return (
    <div className="experience-card relative group sci-fi-card rounded-2xl p-5 sm:p-6 lg:p-7 border border-gray-200/90 dark:border-cyan-500/30 bg-white/95 dark:bg-[#0b0e1a]/95 backdrop-blur-xl shadow-lg hover:shadow-2xl hover:shadow-cyan-500/15 dark:hover:shadow-[0_10px_35px_rgba(6,182,212,0.2)] transition-all duration-300 overflow-hidden will-change-transform">
      {/* Directional Timeline Connector Accent on Desktop */}
      <div
        className={`hidden md:block absolute top-1/2 -translate-y-1/2 w-4 h-[2px] bg-gradient-to-r from-starlight-cyan to-nebula-purple pointer-events-none opacity-60 group-hover:opacity-100 transition-opacity ${
          isEven ? "-right-2" : "-left-2"
        }`}
      />

      {/* 4 Corner HUD Reticles */}
      <div className="absolute top-2.5 left-2.5 w-3 h-3 border-t-2 border-l-2 border-nebula-purple/50 dark:border-starlight-cyan/60 pointer-events-none" />
      <div className="absolute top-2.5 right-2.5 w-3 h-3 border-t-2 border-r-2 border-nebula-purple/50 dark:border-starlight-cyan/60 pointer-events-none" />
      <div className="absolute bottom-2.5 left-2.5 w-3 h-3 border-b-2 border-l-2 border-nebula-purple/50 dark:border-starlight-cyan/60 pointer-events-none" />
      <div className="absolute bottom-2.5 right-2.5 w-3 h-3 border-b-2 border-r-2 border-nebula-purple/50 dark:border-starlight-cyan/60 pointer-events-none" />

      {/* Top Header Row with Category Pill & Signal indicator */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-mono text-[10px] sm:text-[11px] font-bold border ${category.color}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          {category.label}
        </span>

        <div className="flex items-center gap-1 text-[10px] font-mono text-gray-400 dark:text-gray-500">
          <Radio className="w-3 h-3 text-cyan-400 animate-pulse" />
          <span className="hidden sm:inline">VERIFIED LOG</span>
        </div>
      </div>

      {/* Role Title & Company */}
      <div className="mb-3">
        <h3 className="text-lg sm:text-xl font-bold sci-fi-heading group-hover:text-nebula-purple dark:group-hover:text-starlight-cyan transition-colors mb-1">
          {experience.role}
        </h3>
        <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm font-mono text-gray-600 dark:text-gray-300">
          <span className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
            <Briefcase className="w-3.5 h-3.5 text-nebula-purple dark:text-starlight-cyan" />
            {experience.company}
          </span>
          <span className="text-gray-400 dark:text-gray-500">&bull;</span>
          <span className="inline-flex items-center gap-1 text-gray-500 dark:text-gray-400">
            <Calendar className="w-3 h-3" />
            {experience.period}
          </span>
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm leading-relaxed mb-5">
        {experience.description}
      </p>

      {/* Tags Chips */}
      <div className="flex flex-wrap gap-1.5 pt-3 border-t border-gray-100 dark:border-white/10">
        {experience.tags.map((tag, i) => (
          <span
            key={i}
            className="sci-fi-badge text-[10px] sm:text-xs py-0.5 px-2 sm:px-2.5"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};
