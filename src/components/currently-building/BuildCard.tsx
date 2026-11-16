import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight, Play } from "lucide-react";
import type { BuildingItem } from "../../constants/currentlyBuilding";
import { LiveView } from "./LiveView";
import { PreviewFrame } from "./PreviewFrame";

const STATUS = {
  live: { label: "Live", className: "border-cyber-emerald/40 text-cyber-emerald" },
  "in-progress": { label: "In progress", className: "border-cyber-amber/40 text-cyber-amber" },
} as const;

const btn =
  "inline-flex items-center gap-1.5 rounded-full border border-core-graphite px-4 py-2 text-xs font-medium text-core-ink transition-colors hover:border-core-mist";

/** One project in progress: preview, what it is, what is being worked on, and links. */
export const BuildCard: React.FC<{ item: BuildingItem }> = ({ item }) => {
  const [live, setLive] = useState(false);
  const [paused, setPaused] = useState(false);
  const status = STATUS[item.status];

  return (
    <article
      className="now-card group flex flex-col rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 transition-[transform,border-color,background-color] duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.035] motion-reduce:hover:translate-y-0"
      // pause the screenshot rotation while the card is hovered or a control in it has focus
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setPaused(false);
      }}
    >
      <PreviewFrame item={item} paused={paused || live} />
      {live && <LiveView item={item} onClose={() => setLive(false)} />}

      <div className="mt-5 flex items-center justify-between gap-3">
        <h3 className="text-2xl font-semibold tracking-tight text-core-ink">{item.name}</h3>
        <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[11px] ${status.className}`}>
          <span aria-hidden="true" className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-current opacity-60 motion-reduce:hidden" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-current" />
          </span> {status.label}
        </span>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-core-mist">{item.summary}</p>

      <p className="mt-5 font-mono text-[11px] tracking-[0.2em] text-core-mist">WORKING ON</p>
      <p className="mt-1 text-base text-core-ink">{item.workingOn}</p>

      <ul className="mt-4 flex flex-wrap gap-1.5">
        {item.stack.map((t) => (
          <li key={t} className="rounded-full border border-white/10 px-2.5 py-1 font-mono text-[11px] text-core-chrome">
            {t}
          </li>
        ))}
      </ul>

      <div className="mt-auto flex flex-wrap gap-2 pt-6">
        {item.embeddable && (
          <>
            {/* tablet and up: load the real site in the frame */}
            <button
              type="button"
              onClick={() => setLive(true)}
              className="hidden items-center gap-1.5 rounded-full bg-core-chrome px-4 py-2 text-xs font-medium text-core-obsidian transition-colors hover:bg-core-ink md:inline-flex"
            >
              <Play className="h-3.5 w-3.5" /> Try it here
            </button>
            {/* phones: too slow and cramped in a frame, open a tab instead */}
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full bg-core-chrome px-4 py-2 text-xs font-medium text-core-obsidian md:hidden"
            >
              <Play className="h-3.5 w-3.5" /> Try it
            </a>
          </>
        )}
        <a href={item.url} target="_blank" rel="noopener noreferrer" className={btn}>
          Open site <ArrowUpRight className="h-3.5 w-3.5" />
        </a>
        <Link to={`/projects/${item.slug}`} className={btn}>
          Case study <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </article>
  );
};
