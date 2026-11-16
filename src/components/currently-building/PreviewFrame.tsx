import React, { useEffect, useState } from "react";
import type { BuildingItem } from "../../constants/currentlyBuilding";
import { usePrefersReducedMotion } from "../motion";
import { nextShot } from "./previewTimer";

const ROTATE_MS = 4000;

interface PreviewFrameProps {
  item: BuildingItem;
  /** true while the card is hovered or has keyboard focus */
  paused: boolean;
}

/** Browser-chrome frame with cross-fading screenshots, a progress bar and clickable dots. */
export const PreviewFrame: React.FC<PreviewFrameProps> = ({ item, paused }) => {
  const [index, setIndex] = useState(0);
  const reduced = usePrefersReducedMotion();
  const host = new URL(item.url).host;
  const rotating = !paused && !reduced && item.shots.length > 1;

  useEffect(() => {
    if (!rotating) return;
    const id = window.setInterval(() => setIndex((i) => nextShot(i, item.shots.length)), ROTATE_MS);
    return () => window.clearInterval(id);
  }, [rotating, index, item.shots.length]); // index: a dot click restarts the timer

  return (
    <div className="overflow-hidden rounded-xl border border-core-graphite bg-core-obsidian transition-colors duration-300 group-hover:border-core-icy/40">
      <div className="flex items-center gap-1.5 border-b border-core-graphite px-3 py-2">
        <span className="h-2.5 w-2.5 rounded-full bg-cyber-rose/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-cyber-amber/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-cyber-emerald/70" />
        <span className="ml-2 truncate font-mono text-[11px] text-core-mist">{host}</span>
      </div>

      <div className="relative aspect-[16/10] w-full overflow-hidden">
        {item.shots.map((src, i) => (
          <img
            key={src}
            src={src}
            alt={i === index ? `${item.name} screenshot ${i + 1} of ${item.shots.length}` : ""}
            aria-hidden={i !== index}
            loading={i === 0 ? "eager" : "lazy"}
            className={`absolute inset-0 h-full w-full object-cover object-top transition-[opacity,transform] duration-700 ease-out group-hover:scale-[1.03] ${
              i === index ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}

        {/* progress for the current shot; restarts on every change */}
        {item.shots.length > 1 && (
          <div className="absolute inset-x-0 bottom-0 h-0.5 bg-white/10">
            <div
              key={`${index}-${rotating}`}
              className="h-full origin-left bg-core-icy"
              style={{
                animation: rotating ? `now-progress ${ROTATE_MS}ms linear forwards` : "none",
                transform: rotating ? undefined : "scaleX(0)",
              }}
            />
          </div>
        )}
      </div>

      {item.shots.length > 1 && (
        <div className="flex justify-center gap-1.5 py-2.5" role="group" aria-label={`${item.name} screenshots`}>
          {item.shots.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Show screenshot ${i + 1}`}
              aria-current={i === index ? "true" : undefined}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === index ? "w-6 bg-core-icy" : "w-1.5 bg-core-graphite hover:bg-core-mist"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
