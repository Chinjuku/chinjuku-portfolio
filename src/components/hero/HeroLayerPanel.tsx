import React, { useEffect } from "react";
import { ArrowUpRight, X } from "lucide-react";
import { HERO_LAYER_DETAILS, HERO_STACK_LAYERS, type HeroLayerId } from "../../constants/hero";
import { primaryRepo, relatedProjects } from "./heroData";

interface HeroLayerPanelProps {
  id: HeroLayerId;
  onClose: () => void;
  onSelect: (id: HeroLayerId) => void;
  className?: string;
}

const ORDER: HeroLayerId[] = ["frontend", "backend", "data", "ai"];

/** Detail card for an opened Core layer: what it is, the stack, related work. */
export const HeroLayerPanel: React.FC<HeroLayerPanelProps> = ({
  id,
  onClose,
  onSelect,
  className = "",
}) => {
  const detail = HERO_LAYER_DETAILS[id];
  const items = HERO_STACK_LAYERS.find((l) => l.id === id)!.items;
  const projects = relatedProjects(id);
  const index = ORDER.indexOf(id);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onSelect(ORDER[(index + 1) % ORDER.length]);
      if (e.key === "ArrowLeft") onSelect(ORDER[(index + ORDER.length - 1) % ORDER.length]);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, onClose, onSelect]);

  return (
    <aside
      role="dialog"
      aria-label={`${detail.title} layer`}
      className={`rounded-2xl border border-white/10 bg-core-obsidian/70 p-5 text-core-ink backdrop-blur-xl ${className}`}
    >
      <div className="flex items-center justify-between">
        <p className="font-mono text-[11px] tracking-[0.2em] text-core-mist">
          LAYER {String(index + 1).padStart(2, "0")} / 04
        </p>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close layer"
          className="-mr-1 rounded-full p-1 text-core-mist transition-colors hover:text-core-ink"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <h2 className={`mt-3 text-2xl font-semibold tracking-tight ${id === "ai" ? "text-core-icy" : ""}`}>
        {detail.title}
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-core-mist">{detail.description}</p>

      <ul className="mt-4 flex flex-wrap gap-1.5">
        {items.map((item) => (
          <li
            key={item}
            className="rounded-full border border-core-graphite px-2.5 py-1 font-mono text-[11px] text-core-chrome"
          >
            {item}
          </li>
        ))}
      </ul>

      {projects.length > 0 && (
        <div className="mt-5 border-t border-core-graphite pt-4">
          <p className="font-mono text-[10px] tracking-[0.2em] text-core-mist">BUILT WITH IT</p>
          <ul className="mt-2 space-y-1">
            {projects.map((p) => (
              <li key={p.id}>
                <a
                  href={primaryRepo(p)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between gap-3 rounded-lg py-1.5 text-sm transition-colors hover:text-core-icy"
                >
                  <span className="truncate">{p.title.replace(/\s*\(.*\)$/, "")}</span>
                  <span className="flex shrink-0 items-center gap-1 font-mono text-[10px] text-core-mist">
                    {p.finished_date.slice(0, 4)}
                    <ArrowUpRight className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-4 flex items-center justify-between font-mono text-[10px] tracking-[0.15em] text-core-mist">
        <button type="button" onClick={() => onSelect(ORDER[(index + ORDER.length - 1) % ORDER.length])} className="hover:text-core-ink">
          ← PREV
        </button>
        <span className="hidden md:inline">ESC TO CLOSE</span>
        <button type="button" onClick={() => onSelect(ORDER[(index + 1) % ORDER.length])} className="hover:text-core-ink">
          NEXT →
        </button>
      </div>
    </aside>
  );
};
