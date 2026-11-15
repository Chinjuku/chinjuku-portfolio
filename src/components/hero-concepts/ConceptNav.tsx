import React from "react";
import { Link } from "react-router-dom";
import { useNavClick } from "../../hooks";

interface ConceptNavProps {
  className?: string;
}

/** Minimal shared nav for the concepts (switcher occupies the top-right). */
export const ConceptNav: React.FC<ConceptNavProps> = ({ className = "" }) => {
  const handleNavClick = useNavClick();
  return (
    <nav
      aria-label="Primary"
      className={`flex items-center gap-8 text-sm text-[#929EAF] ${className}`}
    >
      <Link
        to="/"
        className="font-mono text-xs tracking-[0.25em] text-[#F4F6FA]"
      >
        CHINJUKU
      </Link>
      <Link to="/projects" className="transition-colors hover:text-[#F4F6FA]">
        Projects
      </Link>
      <a
        href="/#about"
        onClick={(e) => {
          e.preventDefault();
          handleNavClick("#about");
        }}
        className="transition-colors hover:text-[#F4F6FA]"
      >
        About
      </a>
    </nav>
  );
};
