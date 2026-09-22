import React from "react";
import type { SkillCategory } from "../../constants/skills";

interface SkillsPillarsProps {
  categories: SkillCategory[];
}

export const SkillsPillars: React.FC<SkillsPillarsProps> = ({ categories }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 max-w-6xl mx-auto">
      {categories.map((category) => {
        const accentBorder = {
          cyan: "hover:border-starlight-cyan/60 group-hover:shadow-starlight-cyan/10",
          purple:
            "hover:border-nebula-purple/60 group-hover:shadow-nebula-purple/10",
          pink: "hover:border-pink-500/60 group-hover:shadow-pink-500/10",
          blue: "hover:border-starlight-blue/60 group-hover:shadow-starlight-blue/10",
        }[category.accent];

        const accentBadge = {
          cyan: "border-starlight-cyan/30 text-starlight-cyan bg-starlight-cyan/10",
          purple:
            "border-nebula-purple/30 text-nebula-purple bg-nebula-purple/10",
          pink: "border-pink-500/30 text-pink-500 bg-pink-500/10",
          blue: "border-starlight-blue/30 text-starlight-blue bg-starlight-blue/10",
        }[category.accent];

        const accentGlow = {
          cyan: "from-starlight-cyan/20 to-transparent",
          purple: "from-nebula-purple/20 to-transparent",
          pink: "from-pink-500/20 to-transparent",
          blue: "from-starlight-blue/20 to-transparent",
        }[category.accent];

        return (
          <div
            key={category.id}
            className={`skills-pillar-card group relative rounded-2xl bg-white/70 dark:bg-space-dark/80 backdrop-blur-md border border-gray-200/80 dark:border-white/10 p-5 sm:p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${accentBorder} flex flex-col justify-between`}
          >
            {/* Top Accent Gradient Line */}
            <div
              className={`absolute top-0 left-6 right-6 h-[2px] bg-gradient-to-r ${accentGlow} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
            />

            <div>
              {/* Card Header */}
              <div className="flex items-center justify-between mb-3.5">
                <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-white/5 border border-gray-200/80 dark:border-white/10 flex items-center justify-center shrink-0 shadow-inner">
                  {category.icon}
                </div>
                <span
                  className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${accentBadge}`}
                >
                  {String(category.skills.length).padStart(2, "0")} NODES
                </span>
              </div>

              {/* Title & Tagline */}
              <h4 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white font-mono tracking-tight mb-1 group-hover:text-nebula-purple dark:group-hover:text-starlight-cyan transition-colors">
                {category.title}
              </h4>
              <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 mb-4 leading-relaxed">
                {category.tagline}
              </p>
            </div>

            {/* Skills Chips */}
            <div className="flex flex-wrap gap-1.5 pt-3 border-t border-gray-200/60 dark:border-white/5">
              {category.skills.map((skill) => (
                <span
                  key={skill.name}
                  className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] font-mono font-medium bg-gray-100/90 dark:bg-white/5 border border-gray-200/80 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:border-nebula-purple/40 dark:hover:border-starlight-cyan/40 hover:text-nebula-purple dark:hover:text-starlight-cyan transition-colors"
                >
                  <img
                    src={skill.icon}
                    alt={skill.name}
                    className={`w-3 h-3 object-contain shrink-0 ${skill.darkInvert ? "dark:invert" : ""}`}
                    loading="lazy"
                  />
                  <span>{skill.name}</span>
                </span>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};
