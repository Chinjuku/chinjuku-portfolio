import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { useNavClick } from "../../hooks";
import { HERO_COPY } from "../../constants/hero";

export const HeroCtas: React.FC<{ className?: string }> = ({ className = "" }) => {
  const handleNavClick = useNavClick();
  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      <Link
        to={HERO_COPY.ctaProjects.href}
        className="group inline-flex items-center gap-2 rounded-full bg-core-chrome px-6 py-3 text-sm font-medium text-core-obsidian transition-colors duration-300 hover:bg-core-ink"
      >
        {HERO_COPY.ctaProjects.label}
        <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </Link>
      <a
        href={`/${HERO_COPY.ctaAbout.href}`}
        onClick={(e) => {
          e.preventDefault();
          handleNavClick(HERO_COPY.ctaAbout.href);
        }}
        className="inline-flex items-center rounded-full border border-core-graphite px-6 py-3 text-sm font-medium text-core-ink transition-colors duration-300 hover:border-core-mist"
      >
        {HERO_COPY.ctaAbout.label}
      </a>
    </div>
  );
};
