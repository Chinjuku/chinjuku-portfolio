import React from "react";
import { HERO_STACK_LAYERS, type HeroLayerId } from "../../constants/hero";

// Anchor positions (percent of the Core box) matched to the exploded layer
// positions of IntelligenceCore at scale 0.62, camera z=6 / fov 35.
const LABEL_POS: Record<HeroLayerId, { top: string; side: "left" | "right" }> = {
  frontend: { top: "28%", side: "left" },
  backend: { top: "50%", side: "left" },
  ai: { top: "50%", side: "right" },
  data: { top: "72%", side: "right" },
};

interface HeroLayerLabelProps {
  id: HeroLayerId;
  /** floating = absolutely placed beside the Core (desktop); otherwise a grid cell */
  floating: boolean;
  active?: boolean;
  onSelect?: (id: HeroLayerId) => void;
}

export const HeroLayerLabel: React.FC<HeroLayerLabelProps> = ({
  id,
  floating,
  active = false,
  onSelect,
}) => {
  const layer = HERO_STACK_LAYERS.find((l) => l.id === id)!;
  const pos = LABEL_POS[id];
  const content = (
    <>
      <span
        className={`font-mono text-[11px] tracking-[0.2em] transition-colors ${
          id === "ai" || active ? "text-core-icy" : "text-core-chrome group-hover:text-core-ink"
        }`}
      >
        {layer.label}
      </span>
      <span className="mt-1 block text-xs text-core-mist">{layer.items.join(" · ")}</span>
    </>
  );

  const common = {
    type: "button" as const,
    onClick: () => onSelect?.(id),
    "aria-pressed": active,
    "aria-label": `Open ${layer.label.toLowerCase()} layer`,
  };

  if (!floating) {
    return (
      <button
        {...common}
        className={`hero-layer-label group border-t pt-3 text-left transition-colors ${
          active ? "border-core-icy" : "border-core-graphite"
        }`}
      >
        {content}
      </button>
    );
  }

  return (
    <button
      {...common}
      className={`hero-layer-label group absolute flex w-52 -translate-y-1/2 items-start gap-3 ${
        pos.side === "left" ? "left-0 flex-row-reverse text-right" : "right-0 text-left"
      }`}
      style={{ top: pos.top }}
    >
      <span className="mt-[7px] h-px w-10 shrink-0 bg-core-mist/50 transition-all group-hover:w-14 group-hover:bg-core-icy" />
      <span>{content}</span>
    </button>
  );
};
