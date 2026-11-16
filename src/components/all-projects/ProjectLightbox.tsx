import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { ProjectShot } from "../../constants/projects";
import { stepIndex } from "./projectGallery";

interface ProjectLightboxProps {
  shots: ProjectShot[];
  index: number;
  onIndex: (i: number) => void;
  onClose: () => void;
}

const SWIPE_THRESHOLD = 50;

export const ProjectLightbox: React.FC<ProjectLightboxProps> = ({
  shots,
  index,
  onIndex,
  onClose,
}) => {
  const touchStartX = useRef<number | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const latest = useRef({ index, onIndex, onClose, length: shots.length });

  useEffect(() => {
    latest.current = { index, onIndex, onClose, length: shots.length };
  });

  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      const { index: i, onIndex: set, onClose: close, length } = latest.current;
      if (e.key === "Escape") {
        e.stopPropagation();
        close();
      } else if (e.key === "ArrowLeft") {
        set(stepIndex(i, -1, length));
      } else if (e.key === "ArrowRight") {
        set(stepIndex(i, 1, length));
      } else if (e.key === "Tab") {
        // keep focus inside the viewer: cycle through its buttons
        const items = Array.from(rootRef.current?.querySelectorAll<HTMLElement>("button") ?? []);
        if (items.length === 0) return;
        e.preventDefault();
        const pos = items.indexOf(document.activeElement as HTMLElement);
        const from = pos === -1 ? (e.shiftKey ? 0 : -1) : pos;
        items[(from + (e.shiftKey ? -1 : 1) + items.length) % items.length].focus();
      }
    };
    // Capture phase so Escape is handled before the drawer's own listener.
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, []);

  const current = shots[index];
  if (!current) return null;

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(dx) > SWIPE_THRESHOLD) onIndex(stepIndex(index, dx < 0 ? 1 : -1, shots.length));
  };

  const hasBar = Boolean(current.caption) || shots.length > 1;
  const btn =
    "absolute flex h-10 w-10 items-center justify-center rounded-full border border-core-graphite bg-core-obsidian/80 text-core-ink transition-colors hover:border-core-icy focus-visible:outline focus-visible:outline-2 focus-visible:outline-core-icy";

  return createPortal(
    <div
      ref={rootRef}
      role="dialog"
      aria-modal="true"
      aria-label="Screenshot viewer"
      className={`fixed inset-0 z-[70] flex items-center justify-center bg-core-obsidian/95 p-4 ${
        hasBar ? "pb-20" : ""
      }`}
      onClick={onClose}
      onTouchStart={(e) => {
        touchStartX.current = e.touches[0].clientX;
      }}
      onTouchEnd={handleTouchEnd}
    >
      <img
        src={current.src}
        alt={current.caption ?? "Project screenshot"}
        onClick={(e) => e.stopPropagation()}
        className="max-h-full max-w-full rounded-lg object-contain"
      />
      <button
        ref={closeRef}
        type="button"
        aria-label="Close"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        className={`${btn} right-4 top-4`}
      >
        <X size={20} />
      </button>
      {shots.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous screenshot"
            onClick={(e) => {
              e.stopPropagation();
              onIndex(stepIndex(index, -1, shots.length));
            }}
            className={`${btn} left-4 top-1/2 -translate-y-1/2`}
          >
            <ChevronLeft size={20} />
          </button>
          <button
            type="button"
            aria-label="Next screenshot"
            onClick={(e) => {
              e.stopPropagation();
              onIndex(stepIndex(index, 1, shots.length));
            }}
            className={`${btn} right-4 top-1/2 -translate-y-1/2`}
          >
            <ChevronRight size={20} />
          </button>
        </>
      )}
      {hasBar && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-center gap-4 px-4 pb-6 text-center">
          {current.caption && <p className="text-sm text-core-chrome">{current.caption}</p>}
          {shots.length > 1 && (
            <span className="shrink-0 font-mono text-xs text-core-mist">
              {index + 1} / {shots.length}
            </span>
          )}
        </div>
      )}
    </div>,
    document.body,
  );
};
