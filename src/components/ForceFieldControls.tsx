import React, { useState } from 'react';
import { RefreshCw, Zap, Sliders, Maximize, Palette, ChevronDown, ChevronUp } from 'lucide-react';

export interface ForceFieldParams {
  hue: number;
  saturation: number;
  minStroke: number;
  maxStroke: number;
  spacing: number;
  forceStrength: number;
  magnifierRadius: number;
}

export interface ForceFieldStats {
  fps: number;
  pointCount: number;
}

interface ForceFieldControlsProps {
  params: ForceFieldParams;
  stats?: ForceFieldStats;
  onChange: (newParams: ForceFieldParams) => void;
  onRandomize: () => void;
}

export const ForceFieldControls: React.FC<ForceFieldControlsProps> = ({
  params,
  stats,
  onChange,
  onRandomize,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);

  const handleRandomize = () => {
    setIsSpinning(true);
    onRandomize();
    setTimeout(() => setIsSpinning(false), 500);
  };

  return (
    <aside
      aria-label="Force Field HUD Controls"
      className="fixed bottom-6 right-6 z-30 pointer-events-auto select-none transition-all duration-300 ease-out"
    >
      <div className="bg-white/80 dark:bg-space-dark/85 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-2xl shadow-2xl shadow-nebula-purple/10 text-space-black dark:text-white overflow-hidden transition-all duration-300">
        {/* Header / Toggle Button */}
        <div className="flex items-center justify-between gap-3 px-4 py-3 bg-black/[0.02] dark:bg-white/[0.03] border-b border-gray-200/60 dark:border-white/5">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 text-xs font-mono tracking-wider uppercase text-gray-700 dark:text-white/80 hover:text-space-black dark:hover:text-white transition-colors focus:outline-none"
            title="Toggle Force Field HUD"
          >
            <span className="w-2 h-2 rounded-full bg-starlight-cyan animate-pulse" />
            <Sliders className="w-3.5 h-3.5 text-starlight-cyan" />
            <span className="font-semibold">HUD</span>
            {stats && (
              <span className="text-[10px] text-gray-500 dark:text-white/40 ml-1">
                {stats.fps} FPS • {stats.pointCount.toLocaleString()}
              </span>
            )}
            {isOpen ? (
              <ChevronDown className="w-3.5 h-3.5 text-gray-400 dark:text-white/50" />
            ) : (
              <ChevronUp className="w-3.5 h-3.5 text-gray-400 dark:text-white/50" />
            )}
          </button>

          <button
            onClick={handleRandomize}
            className="p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-nebula-purple/40 border border-slate-300/80 dark:border-white/15 text-slate-700 dark:text-white/80 hover:text-slate-950 dark:hover:text-white transition-all group shadow-sm cursor-pointer"
            title="Randomize Cosmic Physics"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 transition-transform duration-500 ${
                isSpinning ? 'rotate-180 text-indigo-600 dark:text-starlight-cyan' : 'group-hover:rotate-90'
              }`}
            />
          </button>
        </div>

        {/* Expandable Controls Panel */}
        {isOpen && (
          <div className="p-4 flex flex-col gap-4 animate-in slide-in-from-bottom-2 fade-in duration-200 min-w-[260px] sm:min-w-[300px]">
            {/* Hue Slider */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-xs text-slate-700 dark:text-gray-200 font-medium">
                <span className="flex items-center gap-1.5 uppercase font-mono tracking-wider">
                  <Palette className="w-3.5 h-3.5 text-indigo-600 dark:text-nebula-glow" /> Hue
                </span>
                <span className="font-mono text-indigo-600 dark:text-starlight-cyan font-bold">{params.hue}°</span>
              </div>
              <div className="relative flex items-center">
                <input
                  type="range"
                  min="0"
                  max="360"
                  value={params.hue}
                  onChange={(e) =>
                    onChange({ ...params, hue: parseInt(e.target.value, 10) })
                  }
                  className="w-full h-2 rounded-full appearance-none cursor-pointer accent-slate-900 dark:accent-white"
                  style={{
                    background: 'linear-gradient(to right, #ef4444 0%, #eab308 17%, #22c55e 33%, #06b6d4 50%, #3b82f6 67%, #a855f7 83%, #ef4444 100%)',
                  }}
                />
              </div>
            </div>

            {/* Radius Slider with Dynamic Progress Track */}
            {(() => {
              const radiusPct = Math.round(((params.magnifierRadius - 60) / (320 - 60)) * 100);
              return (
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-xs text-slate-700 dark:text-gray-200 font-medium">
                    <span className="flex items-center gap-1.5 uppercase font-mono tracking-wider">
                      <Maximize className="w-3.5 h-3.5 text-starlight-cyan" /> Field Radius
                    </span>
                    <span className="font-mono text-starlight-cyan font-bold">{params.magnifierRadius}px</span>
                  </div>
                  <input
                    type="range"
                    min="60"
                    max="320"
                    value={params.magnifierRadius}
                    onChange={(e) =>
                      onChange({ ...params, magnifierRadius: parseInt(e.target.value, 10) })
                    }
                    className="w-full h-2 rounded-full appearance-none cursor-pointer accent-starlight-cyan"
                    style={{
                      background: `linear-gradient(to right, #06B6D4 0%, #06B6D4 ${radiusPct}%, rgba(148, 163, 184, 0.3) ${radiusPct}%, rgba(148, 163, 184, 0.3) 100%)`,
                    }}
                  />
                </div>
              );
            })()}

            {/* Force Strength Slider with Dynamic Progress Track */}
            {(() => {
              const forcePct = Math.round(((params.forceStrength - 2) / (30 - 2)) * 100);
              return (
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-xs text-slate-700 dark:text-gray-200 font-medium">
                    <span className="flex items-center gap-1.5 uppercase font-mono tracking-wider">
                      <Zap className="w-3.5 h-3.5 text-amber-500" /> Repel Force
                    </span>
                    <span className="font-mono text-amber-500 font-bold">{params.forceStrength}</span>
                  </div>
                  <input
                    type="range"
                    min="2"
                    max="30"
                    value={params.forceStrength}
                    onChange={(e) =>
                      onChange({ ...params, forceStrength: parseInt(e.target.value, 10) })
                    }
                    className="w-full h-2 rounded-full appearance-none cursor-pointer accent-amber-500"
                    style={{
                      background: `linear-gradient(to right, #F59E0B 0%, #F59E0B ${forcePct}%, rgba(148, 163, 184, 0.3) ${forcePct}%, rgba(148, 163, 184, 0.3) 100%)`,
                    }}
                  />
                </div>
              );
            })()}

            {/* Micro Stats Footer */}
            <div className="pt-2 border-t border-slate-200 dark:border-white/10 flex items-center justify-between text-[10px] font-mono text-slate-600 dark:text-white/40">
              <span>FPS: <strong className="text-slate-900 dark:text-white font-bold">{stats?.fps ?? 60}</strong></span>
              <span>POINTS: <strong className="text-indigo-600 dark:text-starlight-cyan font-bold">{stats?.pointCount?.toLocaleString() ?? 0}</strong></span>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default ForceFieldControls;
