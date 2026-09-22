import React from "react";
import type { SkillItem } from "../../constants/skills";

interface SkillsMarqueeProps {
  row1Skills: SkillItem[];
  row2Skills: SkillItem[];
}

export const SkillsMarquee: React.FC<SkillsMarqueeProps> = ({
  row1Skills,
  row2Skills,
}) => {
  return (
    <div className="skills-marquee space-y-3 sm:space-y-4 mb-10 sm:mb-12 md:mb-16">
      {/* Row 1 - Left Scroll */}
      <div className="relative w-full overflow-hidden group">
        <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-16 md:w-28 lg:w-36 bg-gradient-to-r from-space-white dark:from-space-dark to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-16 md:w-28 lg:w-36 bg-gradient-to-l from-space-white dark:from-space-dark to-transparent z-10 pointer-events-none" />

        <div className="flex w-max animate-scroll group-hover:[animation-play-state:paused] gap-2.5 sm:gap-3.5 md:gap-4 py-1.5">
          {[...row1Skills, ...row1Skills].map((skill, idx) => (
            <div
              key={`row1-${idx}`}
              className="flex items-center gap-2.5 sm:gap-3 px-3.5 py-2 sm:px-4 sm:py-2.5 sci-fi-card rounded-full group/item hover:scale-105 transition-all duration-300 shrink-0 cursor-default select-none shadow-sm hover:shadow-md hover:shadow-cyan-500/10 dark:hover:shadow-cyan-400/10"
            >
              <div className="w-5 h-5 sm:w-6 sm:h-6 relative flex items-center justify-center shrink-0">
                <div className="absolute inset-0 bg-nebula-purple/20 dark:bg-starlight-cyan/20 rounded-full blur-md opacity-0 group-hover/item:opacity-100 transition-opacity duration-300" />
                <img
                  src={skill.icon}
                  alt={skill.name}
                  className={`w-full h-full object-contain ${skill.darkInvert ? "dark:invert" : ""}`}
                  loading="lazy"
                />
              </div>
              <span className="text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-200 group-hover/item:text-nebula-purple dark:group-hover/item:text-starlight-cyan transition-colors whitespace-nowrap">
                {skill.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Row 2 - Right Scroll */}
      <div className="relative w-full overflow-hidden group">
        <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-16 md:w-28 lg:w-36 bg-gradient-to-r from-space-white dark:from-space-dark to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-16 md:w-28 lg:w-36 bg-gradient-to-l from-space-white dark:from-space-dark to-transparent z-10 pointer-events-none" />

        <div className="flex w-max animate-scroll-reverse group-hover:[animation-play-state:paused] gap-2.5 sm:gap-3.5 md:gap-4 py-1.5">
          {[...row2Skills, ...row2Skills].map((skill, idx) => (
            <div
              key={`row2-${idx}`}
              className="flex items-center gap-2.5 sm:gap-3 px-3.5 py-2 sm:px-4 sm:py-2.5 sci-fi-card rounded-full group/item hover:scale-105 transition-all duration-300 shrink-0 cursor-default select-none shadow-sm hover:shadow-md hover:shadow-purple-500/10 dark:hover:shadow-purple-400/10"
            >
              <div className="w-5 h-5 sm:w-6 sm:h-6 relative flex items-center justify-center shrink-0">
                <div className="absolute inset-0 bg-starlight-blue/20 dark:bg-nebula-glow/20 rounded-full blur-md opacity-0 group-hover/item:opacity-100 transition-opacity duration-300" />
                <img
                  src={skill.icon}
                  alt={skill.name}
                  className={`w-full h-full object-contain ${skill.darkInvert ? "dark:invert" : ""}`}
                  loading="lazy"
                />
              </div>
              <span className="text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-200 group-hover/item:text-nebula-purple dark:group-hover/item:text-starlight-cyan transition-colors whitespace-nowrap">
                {skill.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
