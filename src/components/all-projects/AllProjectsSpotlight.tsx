import React, { type RefObject } from "react";
import { Sparkles, ChevronDown } from "lucide-react";

interface AllProjectsSpotlightProps {
  introStageRef: RefObject<HTMLDivElement | null>;
  overlayRef: RefObject<HTMLDivElement | null>;
  lensRingRef: RefObject<HTMLDivElement | null>;
  hudCueRef: RefObject<HTMLDivElement | null>;
  totalProjects: number;
  years: number[];
  onBypass: () => void;
}

export const AllProjectsSpotlight: React.FC<AllProjectsSpotlightProps> = ({
  introStageRef,
  overlayRef,
  lensRingRef,
  hudCueRef,
  totalProjects,
  years,
  onBypass,
}) => {
  return (
    <div
      ref={introStageRef}
      className="h-screen w-full relative overflow-hidden bg-space-white dark:bg-space-black flex flex-col items-center justify-center select-none transition-colors duration-300"
    >
      {/* Subtle Cyber Matrix Grid Background */}
      <div className="absolute inset-0 bg-[radial-gradient(#94a3b8_1px,transparent_1px)] dark:bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-40 dark:opacity-60" />

      {/* 1. Solid Pure Dark Overlay with Expanding Circular Mask */}
      <div
        ref={overlayRef}
        className="absolute inset-0 z-30 bg-[#07070A] dark:bg-black transition-opacity duration-150"
        style={{
          maskImage:
            "radial-gradient(circle at 50% 50%, transparent 0%, black 1px)",
          WebkitMaskImage:
            "radial-gradient(circle at 50% 50%, transparent 0%, black 1px)",
        }}
      />

      {/* 2. Luminous Cyan / Purple Lens Flare Ring (Light Theme & Dark Theme Adaptive) */}
      <div
        ref={lensRingRef}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-30 rounded-full border border-nebula-purple/90 dark:border-starlight-cyan/85 shadow-[0_0_50px_10px_rgba(124,58,237,0.45),inset_0_0_30px_5px_rgba(6,182,212,0.35)] dark:shadow-[0_0_50px_10px_rgba(6,182,212,0.8),inset_0_0_30px_5px_rgba(124,58,237,0.5)] transition-opacity duration-150"
        style={{
          width: "0vmax",
          height: "0vmax",
          opacity: 0,
        }}
      />

      {/* 3. Text to Scroll - Positioned in the Middle of the Monitor */}
      <div
        ref={hudCueRef}
        className="absolute inset-0 z-40 flex flex-col items-center justify-center pointer-events-none select-none px-4 text-center"
      >
        {/* Glowing Cyber Glyph */}
        <div className="w-16 h-16 rounded-full bg-space-dark/90 border border-starlight-cyan/60 shadow-[0_0_30px_rgba(6,182,212,0.5)] flex items-center justify-center mb-5">
          <Sparkles className="w-7 h-7 text-starlight-cyan animate-pulse" />
        </div>

        {/* Primary Text in Middle of Monitor */}
        <h2 className="text-2xl sm:text-3xl md:text-5xl font-mono font-black tracking-widest text-white uppercase mb-3 drop-shadow-[0_2px_16px_rgba(0,0,0,0.95)]">
          SCROLL TO REVEAL ARCHIVES
        </h2>

        {/* Subtext */}
        <p className="text-xs sm:text-sm font-mono text-starlight-cyan tracking-wider uppercase mb-7 drop-shadow-md">
          // Expanding Spotlight Aperture //
        </p>

        {/* Animated Mouse Scroll Indicator */}
        <div className="flex flex-col items-center gap-2 text-gray-400">
          <div className="w-5 h-9 rounded-full border-2 border-starlight-cyan/70 flex items-start justify-center p-1 shadow-[0_0_15px_rgba(6,182,212,0.4)]">
            <div className="w-1.5 h-2 rounded-full bg-starlight-cyan animate-bounce" />
          </div>
          <span className="text-[10px] font-mono tracking-widest text-gray-400 uppercase">
            SCROLL DOWN
          </span>
        </div>

        {/* Quick Access Skip Button */}
        <div className="mt-8 pointer-events-auto">
          <button
            onClick={onBypass}
            className="px-4 py-1.5 rounded-full text-xs font-mono bg-white/10 hover:bg-white/20 text-gray-200 hover:text-white border border-white/20 backdrop-blur-md transition-all cursor-pointer"
          >
            Skip to All Projects ↓
          </button>
        </div>
      </div>

      {/* 4. Inside the Spotlight (Revealed in Stage 1 as aperture expands - Fully Light & Dark Adaptive) */}
      <div className="container mx-auto px-6 max-w-4xl text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-nebula-purple/10 dark:bg-starlight-cyan/10 border border-nebula-purple/30 dark:border-starlight-cyan/30 text-xs font-mono text-nebula-purple dark:text-starlight-cyan uppercase tracking-widest mb-4">
          <Sparkles className="w-3.5 h-3.5 animate-spin" />
          <span>SECURITY CLEARANCE GRANTED // PROTOCOL 07</span>
        </div>
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black sci-fi-heading mb-4 tracking-tight">
          CENTRAL ARCHIVES
        </h1>
        <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base max-w-xl mx-auto leading-relaxed mb-6 font-mono">
          // Decrypting classified backlog of engineering operations and
          deployments...
        </p>

        {/* Telemetry Status Readout Box */}
        <div className="w-full max-w-xs sm:max-w-none sm:w-auto inline-flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-6 bg-white/80 dark:bg-white/5 border border-gray-200/80 dark:border-white/10 px-5 py-4 sm:px-6 sm:py-3.5 rounded-2xl backdrop-blur-md shadow-lg shadow-gray-200/50 dark:shadow-none">
          <div className="flex sm:block justify-between items-center text-left">
            <span className="text-[10px] font-mono text-gray-500 dark:text-gray-400 uppercase block">
              Operations
            </span>
            <span className="text-base sm:text-lg font-black text-slate-900 dark:text-white font-mono">
              {totalProjects} Logged
            </span>
          </div>
          <div className="w-full sm:w-px h-px sm:h-8 bg-gray-200 dark:bg-white/10" />
          <div className="flex sm:block justify-between items-center text-left">
            <span className="text-[10px] font-mono text-gray-500 dark:text-gray-400 uppercase block">
              Timeline
            </span>
            <span className="text-base sm:text-lg font-black text-nebula-purple dark:text-starlight-cyan font-mono">
              {years[years.length - 1]} - {years[0]}
            </span>
          </div>
          <div className="w-full sm:w-px h-px sm:h-8 bg-gray-200 dark:bg-white/10" />
          <div className="flex sm:block justify-between items-center text-left">
            <span className="text-[10px] font-mono text-gray-500 dark:text-gray-400 uppercase block">
              Aperture
            </span>
            <span className="text-base sm:text-lg font-black text-nebula-purple dark:text-nebula-glow font-mono">
              100% Online
            </span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 text-xs font-mono text-nebula-purple dark:text-starlight-cyan mt-8 animate-bounce">
          <span>Continue scrolling to access full catalog</span>
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
};
