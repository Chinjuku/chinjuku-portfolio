import React from "react";
import { GraduationCap, Briefcase, Rocket, Zap } from "lucide-react";

export const AboutTacticalCards: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
      {/* Card 1: Education */}
      <div className="about-card p-3.5 sm:p-4 rounded-xl sci-fi-card hover:border-nebula-purple/50 dark:hover:border-starlight-cyan/50 transition-all group">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-nebula-purple/10 dark:bg-starlight-cyan/10 flex items-center justify-center">
              <GraduationCap className="w-3.5 h-3.5 text-nebula-purple dark:text-starlight-cyan" />
            </div>
            <span className="text-[11px] font-mono font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Education
            </span>
          </div>
          <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-300 border border-purple-500/20">
            Class of 2026
          </span>
        </div>
        <h4 className="font-bold text-sm sci-fi-heading font-mono mb-0.5">
          B.Sc. Information Technology
        </h4>
        <p className="text-[11px] text-gray-600 dark:text-gray-400">
          KMITL &bull; Software Engineering &bull; Graduated April 2026
        </p>
      </div>

      {/* Card 2: Current Role */}
      <div className="about-card p-3.5 sm:p-4 rounded-xl sci-fi-card hover:border-cyan-500/50 dark:hover:border-cyan-400/50 transition-all group">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-cyan-500/10 dark:bg-cyan-400/10 flex items-center justify-center">
              <Briefcase className="w-3.5 h-3.5 text-cyan-600 dark:text-starlight-cyan" />
            </div>
            <span className="text-[11px] font-mono font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Current Role
            </span>
          </div>
          <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-300 border border-cyan-500/20 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
            Now
          </span>
        </div>
        <h4 className="font-bold text-sm sci-fi-heading font-mono mb-0.5">
          Fullstack Developer
        </h4>
        <p className="text-[11px] text-gray-600 dark:text-gray-400">
          Building web applications, microservices & UI systems
        </p>
      </div>

      {/* Card 3: Opportunities (Highlight!) */}
      <div className="about-card p-3.5 sm:p-4 rounded-xl bg-cyan-500/5 dark:bg-cyan-950/25 border border-cyan-500/30 dark:border-cyan-400/30 hover:border-cyan-500/60 transition-all group">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-cyan-500/10 dark:bg-cyan-400/15 flex items-center justify-center">
              <Rocket className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
            </div>
            <span className="text-[11px] font-mono font-bold text-cyan-700 dark:text-cyan-300 uppercase tracking-wider">
              Looking for
            </span>
          </div>
          <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border border-cyan-500/30 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-ping" />
            Open
          </span>
        </div>
        <h4 className="font-bold text-sm text-cyan-900 dark:text-cyan-200 font-mono mb-0.5">
          Freelance & Part-time Dev
        </h4>
        <p className="text-[11px] text-cyan-800/80 dark:text-cyan-300/80">
          Available for remote contracts, MVP launches & ongoing features
        </p>
      </div>

      {/* Card 4: Philosophy */}
      <div className="about-card p-3.5 sm:p-4 rounded-xl sci-fi-card hover:border-purple-500/50 dark:hover:border-purple-400/50 transition-all group">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-purple-500/10 dark:bg-purple-400/10 flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-purple-500" />
            </div>
            <span className="text-[11px] font-mono font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              How I work
            </span>
          </div>
          <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-300 border border-purple-500/20">
            End to end
          </span>
        </div>
        <h4 className="font-bold text-sm sci-fi-heading font-mono mb-0.5">
          End-to-End Delivery
        </h4>
        <p className="text-[11px] text-gray-600 dark:text-gray-400">
          Agile collaboration, rapid prototyping, clean code & problem solving
        </p>
      </div>
    </div>
  );
};
