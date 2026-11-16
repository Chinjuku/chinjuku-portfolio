import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";
import { ArrowUpRight, X } from "lucide-react";
import type { BuildingItem } from "../../constants/currentlyBuilding";
import { usePrefersReducedMotion } from "../motion";

interface LiveViewProps {
  item: BuildingItem;
  onClose: () => void;
}

/** Near-full-screen window running the real site, so it is big enough to actually play. */
export const LiveView: React.FC<LiveViewProps> = ({ item, onClose }) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const reduced = usePrefersReducedMotion();
  const host = new URL(item.url).host;

  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      opener?.focus();
    };
  }, [onClose]);

  useEffect(() => {
    if (reduced) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".lv-backdrop", { opacity: 0 }, { opacity: 1, duration: 0.3 });
      gsap.fromTo(".lv-window", { y: 40, scale: 0.96, opacity: 0 }, { y: 0, scale: 1, opacity: 1, duration: 0.5, ease: "power3.out" });
    }, rootRef);
    return () => ctx.revert();
  }, [reduced]);

  return createPortal(
    <div ref={rootRef} className="fixed inset-0 z-[70] flex items-center justify-center p-4 md:p-8">
      <div aria-hidden="true" onClick={onClose} className="lv-backdrop absolute inset-0 bg-core-obsidian/85 backdrop-blur-sm" />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`${item.name} live`}
        className="lv-window relative flex h-full max-h-[900px] w-full max-w-[1400px] flex-col overflow-hidden rounded-2xl border border-core-graphite bg-core-obsidian shadow-[0_30px_80px_rgba(0,0,0,0.6)]"
      >
        <div className="flex items-center gap-2 border-b border-core-graphite px-4 py-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-cyber-rose/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-cyber-amber/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-cyber-emerald/70" />
          <span className="ml-2 inline-flex items-center gap-1.5 truncate font-mono text-xs text-core-mist">
            <span className="h-1.5 w-1.5 rounded-full bg-cyber-emerald" aria-hidden="true" /> {host}
          </span>
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto inline-flex items-center gap-1 rounded-full border border-core-graphite px-3 py-1 text-xs text-core-chrome transition-colors hover:border-core-mist hover:text-core-ink"
          >
            New tab <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close live view"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-core-graphite text-core-chrome transition-colors hover:border-core-icy hover:text-core-ink"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <iframe
          src={item.url}
          title={`${item.name} live`}
          sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
          className="w-full flex-1 bg-core-obsidian"
        />
      </div>
    </div>,
    document.body,
  );
};
