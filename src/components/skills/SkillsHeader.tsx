import React from "react";
import { RevealText } from "../motion";

export const SkillsHeader: React.FC = () => {
  return (
    <div className="skills-header text-center mb-8 sm:mb-10 md:mb-12">
      <h2 className="sci-fi-subheading mb-2 flex items-center justify-center gap-2">
        Skills
      </h2>
      <RevealText as="h3" className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-[-0.03em] sci-fi-heading" text="The stack I build with" accentWords={["build"]} />
    </div>
  );
};
