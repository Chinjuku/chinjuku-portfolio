import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { useNavClick } from "../../hooks";
import { COPY } from "./tokens";

interface CtaButtonsProps {
  className?: string;
}

export const CtaButtons: React.FC<CtaButtonsProps> = ({ className = "" }) => {
  const handleNavClick = useNavClick();
  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      <Link
        to={COPY.ctaProjects.href}
        className="group inline-flex items-center gap-2 rounded-full bg-[#C9D1DB] px-6 py-3 text-sm font-medium text-[#080B12] transition-colors duration-300 hover:bg-[#F4F6FA]"
      >
        {COPY.ctaProjects.label}
        <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </Link>
      <a
        href={COPY.ctaAbout.href}
        onClick={(e) => {
          e.preventDefault();
          handleNavClick("#about");
        }}
        className="inline-flex items-center rounded-full border border-[#222B39] px-6 py-3 text-sm font-medium text-[#F4F6FA] transition-colors duration-300 hover:border-[#929EAF]"
      >
        {COPY.ctaAbout.label}
      </a>
    </div>
  );
};
