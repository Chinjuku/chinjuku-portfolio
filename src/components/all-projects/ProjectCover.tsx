import React, { useState } from "react";

interface ProjectCoverProps {
  src: string;
  title: string;
  className?: string;
}

/** Project image that degrades to a generated cover if the URL is missing or dead. */
export const ProjectCover: React.FC<ProjectCoverProps> = ({ src, title, className = "" }) => {
  const [broken, setBroken] = useState(!src);
  const initials = title
    .replace(/\(.*\)/, "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");

  if (broken) {
    return (
      <div
        role="img"
        aria-label={`${title} cover`}
        className={`relative flex items-center justify-center bg-core-obsidian ${className}`}
        style={{
          backgroundImage:
            "radial-gradient(circle at 50% 55%, rgba(138,191,255,0.16), transparent 55%), linear-gradient(#222B39 1px, transparent 1px), linear-gradient(90deg, #222B39 1px, transparent 1px)",
          backgroundSize: "100% 100%, 32px 32px, 32px 32px",
        }}
      >
        <span className="font-mono text-5xl tracking-[0.2em] text-core-chrome/70">{initials}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt=""
      loading="lazy"
      onError={() => setBroken(true)}
      className={`object-cover opacity-80 saturate-[0.7] ${className}`}
    />
  );
};
