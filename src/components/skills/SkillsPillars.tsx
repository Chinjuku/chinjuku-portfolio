import React from "react";
import type { SkillCategory } from "../../constants/skills";

interface SkillsPillarsProps {
  categories: SkillCategory[];
}

/**
 * The stack as a quiet table: one row per category, logos only.
 * Names show on hover/focus (and stay readable to screen readers).
 */
export const SkillsPillars: React.FC<SkillsPillarsProps> = ({ categories }) => (
  <dl className="mx-auto max-w-5xl border-t border-core-graphite">
    {categories.map((category) => (
      <div
        key={category.id}
        className="skills-row group grid grid-cols-1 items-center gap-4 border-b border-core-graphite py-5 transition-colors hover:bg-white/[0.015] md:grid-cols-[16rem_1fr] md:gap-8"
      >
        <dt className="flex items-baseline gap-3">
          <span className="text-base font-medium text-core-ink transition-colors group-hover:text-core-icy">
            {category.title.replace(" & ", " and ")}
          </span>
          <span className="font-mono text-[10px] tracking-[0.2em] text-core-mist">
            {String(category.skills.length).padStart(2, "0")}
          </span>
        </dt>
        <dd>
          <ul className="flex flex-wrap gap-2">
            {category.skills.map((skill) => (
              <li key={skill.name} className="skills-logo group/logo relative">
                <span
                  tabIndex={0}
                  className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.02] outline-none transition-all duration-300 hover:-translate-y-0.5 hover:border-core-icy/40 hover:bg-white/[0.05] focus-visible:border-core-icy/60 [@media(pointer:coarse)]:w-auto [@media(pointer:coarse)]:gap-2 [@media(pointer:coarse)]:px-3"
                >
                  <img
                    src={skill.icon}
                    alt={skill.name}
                    loading="lazy"
                    className={`h-5 w-5 object-contain ${skill.darkInvert ? "invert" : ""}`}
                  />
                  {/* touch screens have no hover: show the name next to the logo */}
                  <span aria-hidden="true" className="hidden text-xs text-core-chrome [@media(pointer:coarse)]:inline">
                    {skill.name}
                  </span>
                </span>
                {/* name tooltip (mouse / keyboard) */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -top-8 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-md border border-white/10 bg-core-obsidian px-2 py-1 font-mono text-[10px] text-core-chrome opacity-0 transition-opacity group-focus-within/logo:opacity-100 group-hover/logo:opacity-100 [@media(pointer:coarse)]:hidden"
                >
                  {skill.name}
                </span>
              </li>
            ))}
          </ul>
        </dd>
      </div>
    ))}
  </dl>
);
