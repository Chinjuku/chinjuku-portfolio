import React from "react";
import { CONCEPTS, COPY, type ConceptId } from "./tokens";

interface ConceptSwitcherProps {
  active: ConceptId;
  onChange: (id: ConceptId) => void;
}

export const ConceptSwitcher: React.FC<ConceptSwitcherProps> = ({
  active,
  onChange,
}) => (
  <div className="fixed inset-x-0 bottom-4 z-50 flex flex-col items-center gap-2 px-4 md:inset-x-auto md:bottom-auto md:right-6 md:top-5 md:items-end md:px-0">
    <div
      role="group"
      aria-label="Hero concept"
      className="flex rounded-full border border-white/10 bg-[#080B12]/70 p-1 backdrop-blur-xl"
    >
      {CONCEPTS.map(({ id, label }) => {
        const isActive = id === active;
        return (
          <button
            key={id}
            type="button"
            aria-pressed={isActive}
            onClick={() => onChange(id)}
            className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs transition-colors duration-300 ${
              isActive
                ? "bg-[#F4F6FA] text-[#080B12]"
                : "text-[#929EAF] hover:text-[#F4F6FA]"
            }`}
          >
            <span className="font-mono">{String(id).padStart(2, "0")}</span>
            <span className="font-medium">{label}</span>
          </button>
        );
      })}
    </div>
    <p className="max-w-[18rem] text-center font-mono text-[10px] leading-snug tracking-wide text-[#929EAF]/80 md:max-w-none md:text-right">
      {COPY.placeholderNotice}
    </p>
  </div>
);
