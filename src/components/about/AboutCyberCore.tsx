import React from "react";
import { Cpu } from "lucide-react";
import type { TechSatellite } from "../../constants/about";

interface AboutCyberCoreProps {
  techSatellites: TechSatellite[];
}

export const AboutCyberCore: React.FC<AboutCyberCoreProps> = ({
  techSatellites,
}) => {
  return (
    <div className="w-full lg:w-auto flex justify-center items-center relative py-4 lg:py-0 shrink-0">
      <div className="relative w-[300px] h-[300px] sm:w-[350px] sm:h-[350px] md:w-[380px] md:h-[380px] lg:w-[400px] lg:h-[400px] flex items-center justify-center">
        {/* Ambient Glow */}
        <div className="absolute inset-0 bg-gradient-to-tr from-nebula-purple/30 via-starlight-blue/20 to-starlight-cyan/30 rounded-full blur-[70px] pointer-events-none" />

        {/* Outer Telemetry Compass Ring (Slow Spin) */}
        <div className="about-radar-ring absolute inset-2 sm:inset-4 border border-dashed border-cyan-500/30 dark:border-cyan-400/35 rounded-full animate-spin-slow pointer-events-none" />

        {/* Inner Concentric Gyro Ring (Reverse Spin) */}
        <div
          className="about-radar-ring absolute inset-8 sm:inset-12 border border-purple-500/25 dark:border-purple-400/30 rounded-full animate-spin-slow pointer-events-none"
          style={{ animationDirection: "reverse", animationDuration: "28s" }}
        />

        {/* Center Reticles */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-full h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
          <div className="absolute h-full w-px bg-gradient-to-b from-transparent via-purple-500/20 to-transparent" />
        </div>

        {/* Center Holographic Core Reactor */}
        <div className="about-core-center absolute inset-0 flex items-center justify-center z-10">
          <div className="relative group/core">
            {/* Core Aura Glow */}
            <div className="absolute -inset-2.5 bg-gradient-to-r from-nebula-purple/40 to-starlight-cyan/40 rounded-3xl blur-lg opacity-60 group-hover/core:opacity-100 transition-opacity duration-700 animate-pulse-slow" />

            {/* Glass Reactor Box */}
            <div className="relative w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40 sci-fi-glass rounded-3xl border border-cyan-500/40 dark:border-starlight-cyan/40 flex flex-col items-center justify-center shadow-2xl p-3 transition-transform duration-500 group-hover/core:scale-105">
              {/* Corner Reticles */}
              <div className="absolute top-2 left-2 w-2 h-2 border-t-2 border-l-2 border-starlight-cyan/70 rounded-tl" />
              <div className="absolute top-2 right-2 w-2 h-2 border-t-2 border-r-2 border-starlight-cyan/70 rounded-tr" />
              <div className="absolute bottom-2 left-2 w-2 h-2 border-b-2 border-l-2 border-starlight-cyan/70 rounded-bl" />
              <div className="absolute bottom-2 right-2 w-2 h-2 border-b-2 border-r-2 border-starlight-cyan/70 rounded-br" />

              {/* CPU Icon */}
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr from-nebula-purple/20 to-starlight-cyan/20 border border-white/10 flex items-center justify-center mb-1.5 shadow-inner group-hover/core:rotate-6 transition-transform duration-500">
                <Cpu className="w-7 h-7 sm:w-8 sm:h-8 text-nebula-purple dark:text-starlight-cyan drop-shadow-[0_0_12px_rgba(6,182,212,0.8)]" />
              </div>

              <span className="text-[10px] sm:text-[11px] font-mono font-black text-gray-900 dark:text-white tracking-widest uppercase">
                FULLSTACK CORE
              </span>
              <span className="text-[8px] sm:text-[9px] font-mono text-cyan-600 dark:text-starlight-cyan/90 mt-0.5 font-semibold">
                DEPLOYED // OPTIMAL
              </span>
            </div>

            {/* Bottom Live Status Pill */}
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap px-3 py-0.5 rounded-full bg-white/95 dark:bg-space-dark/95 border border-emerald-500/50 shadow-md shadow-emerald-500/15 backdrop-blur-md flex items-center gap-1.5 z-20">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[9px] sm:text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 tracking-wider uppercase">
                AVAILABLE FOR WORK
              </span>
            </div>
          </div>
        </div>

        {/* Orbiting Satellite Tech Chips */}
        {techSatellites.map((sat, idx) => (
          <div
            key={sat.label}
            className="about-satellite absolute z-20"
            style={{
              top: sat.top,
              left: sat.left,
              right: sat.right,
              bottom: sat.bottom,
            }}
          >
            <div
              className={`about-sat-float-${idx} sci-fi-glass px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl border flex items-center gap-1.5 sm:gap-2 shadow-lg backdrop-blur-md hover:scale-110 transition-transform duration-300 cursor-default select-none ${sat.accentColor}`}
            >
              <img
                src={sat.icon}
                alt={sat.label}
                className={`w-3.5 h-3.5 sm:w-4 sm:h-4 object-contain shrink-0 ${
                  sat.darkInvert ? "dark:invert" : ""
                }`}
                loading="lazy"
              />
              <div className="flex flex-col">
                <span className="text-[10px] sm:text-[11px] font-mono font-bold text-gray-800 dark:text-gray-200 whitespace-nowrap leading-none">
                  {sat.label}
                </span>
                <span className="text-[8px] font-mono text-gray-500 dark:text-gray-400 leading-none mt-0.5">
                  {sat.sublabel}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
