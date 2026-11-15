import React from "react";

/**
 * Static stand-in for the 3D Core: shown while the scene loads and when the
 * browser has no WebGL. Pure SVG/CSS so it never pulls in three.js.
 */
export const CoreFallback: React.FC<{ className?: string }> = ({ className = "" }) => (
  <div aria-hidden="true" className={`flex items-center justify-center ${className}`}>
    <svg viewBox="0 0 400 400" className="h-[70%] max-h-[420px] w-auto">
      <defs>
        <radialGradient id="cf-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#B5D5FF" stopOpacity="0.9" />
          <stop offset="35%" stopColor="#8ABFFF" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#8ABFFF" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="200" cy="200" r="150" fill="url(#cf-glow)" />
      {/* three stacked plates seen in perspective */}
      {[-70, 0, 70].map((dy) => (
        <path
          key={dy}
          d={`M120 ${200 + dy} L200 ${165 + dy} L280 ${200 + dy} L200 ${235 + dy} Z`}
          fill="rgba(201,209,219,0.04)"
          stroke="rgba(201,209,219,0.45)"
          strokeWidth="1"
        />
      ))}
      <circle cx="200" cy="200" r="34" fill="none" stroke="rgba(201,209,219,0.35)" />
      <circle cx="200" cy="200" r="16" fill="#8ABFFF" />
      <ellipse cx="200" cy="200" rx="120" ry="34" fill="none" stroke="rgba(201,209,219,0.4)" transform="rotate(-14 200 200)" />
      <ellipse cx="200" cy="200" rx="140" ry="44" fill="none" stroke="rgba(201,209,219,0.25)" transform="rotate(18 200 200)" />
    </svg>
  </div>
);
