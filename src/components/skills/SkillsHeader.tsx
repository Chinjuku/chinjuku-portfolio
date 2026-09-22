import React from "react";
import { Sparkles } from "lucide-react";

export const SkillsHeader: React.FC = () => {
  return (
    <div className="skills-header text-center mb-8 sm:mb-10 md:mb-12">
      <h2 className="sci-fi-subheading mb-2 flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-starlight-cyan animate-pulse" />
        The Arsenal
      </h2>
      <h3 className="text-2xl sm:text-3xl md:text-4xl sci-fi-heading">
        Technical Proficiency
      </h3>
    </div>
  );
};
