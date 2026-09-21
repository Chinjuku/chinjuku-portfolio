import React, { useRef } from "react";
import { Code2, Cloud, Database, Globe, Sparkles } from "lucide-react";

interface SkillItem {
  name: string;
  icon: string;
  darkInvert?: boolean;
}

interface SkillCategory {
  id: string;
  title: string;
  tagline: string;
  accent: "cyan" | "purple" | "pink" | "blue";
  icon: React.ReactNode;
  skills: SkillItem[];
}

const skillCategories: SkillCategory[] = [
  {
    id: "languages",
    title: "Languages & Core",
    tagline: "Algorithmic logic, typed contracts & modern scripting",
    accent: "cyan",
    icon: <Code2 className="w-5 h-5 text-starlight-cyan" />,
    skills: [
      {
        name: "HTML",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg",
      },
      {
        name: "CSS",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg",
      },
      {
        name: "Python",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
      },
      {
        name: "PHP",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg",
      },
      {
        name: "Java",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg",
      },
      {
        name: "JavaScript",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
      },
      {
        name: "TypeScript",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
      },
    ],
  },
  {
    id: "frameworks",
    title: "Frameworks & APIs",
    tagline: "Reactive web apps, microservices & RESTful backends",
    accent: "purple",
    icon: <Globe className="w-5 h-5 text-nebula-purple" />,
    skills: [
      {
        name: "React",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
      },
      {
        name: "Next.js",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg",
        darkInvert: true,
      },
      {
        name: "Vue.js",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg",
      },
      {
        name: "Node.js",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
      },
      {
        name: "FastAPI",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg",
        darkInvert: true,
      },
      {
        name: "Django",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/django/django-plain.svg",
      },
      {
        name: "Laravel",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/laravel/laravel-original.svg",
      },
      {
        name: "Tailwind",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg",
      },
      {
        name: "Flask",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flask/flask-original.svg",
        darkInvert: true,
      },
    ],
  },
  {
    id: "databases",
    title: "Databases & Storage",
    tagline: "Relational schemas, NoSQL document stores & modern ORMs",
    accent: "pink",
    icon: <Database className="w-5 h-5 text-pink-500" />,
    skills: [
      {
        name: "MySQL",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg",
      },
      {
        name: "PostgreSQL",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg",
      },
      {
        name: "MongoDB",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg",
      },
      {
        name: "SQLite",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sqlite/sqlite-original.svg",
      },
      {
        name: "Prisma",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/prisma/prisma-original.svg",
        darkInvert: true,
      },
    ],
  },
  {
    id: "tools",
    title: "DevOps & AI Toolchain",
    tagline: "Containerization, cloud workloads, CI/CD & AI agentic workflows",
    accent: "blue",
    icon: <Cloud className="w-5 h-5 text-starlight-blue" />,
    skills: [
      {
        name: "Docker",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg",
      },
      {
        name: "AWS",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original-wordmark.svg",
      },
      {
        name: "Git",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg",
      },
      {
        name: "VS Code",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg",
      },
      {
        name: "Claude Code",
        icon: "/icons/claude.svg",
      },
      {
        name: "Antigravity",
        icon: "/icons/antigravity.svg",
      },
      {
        name: "ChatGPT",
        icon: "/icons/chatgpt.svg",
      },
      {
        name: "Codex",
        icon: "/icons/codex.svg",
      },
      {
        name: "Figma",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg",
      },
      {
        name: "Canva",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/canva/canva-original.svg",
      },
    ],
  },
];

const totalSkillCount = skillCategories.reduce(
  (acc, cat) => acc + cat.skills.length,
  0,
);

const Skills: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  // Flatten skills for rows
  const row1Skills = [
    ...skillCategories[0].skills,
    ...skillCategories[1].skills,
  ]; // Languages + Frameworks
  const row2Skills = [
    ...skillCategories[2].skills,
    ...skillCategories[3].skills,
  ]; // Databases + Tools

  return (
    <section
      ref={sectionRef}
      className="min-h-screen flex flex-col justify-center bg-space-white dark:bg-space-dark relative overflow-hidden py-16 sm:py-20 md:py-28 transition-colors duration-300"
    >
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.05)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="container mx-auto relative z-10 w-full px-4 max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-10 md:mb-12">
          <h2 className="sci-fi-subheading mb-2 flex items-center justify-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-starlight-cyan animate-pulse" />
            The Arsenal
          </h2>
          <h3 className="text-2xl sm:text-3xl md:text-4xl sci-fi-heading">
            Technical Proficiency
          </h3>
        </div>

        {/* Top Infinite Marquee Stream */}
        <div className="space-y-3 sm:space-y-4 mb-10 sm:mb-12 md:mb-16">
          {/* Row 1 - Left Scroll */}
          <div className="relative w-full overflow-hidden group">
            <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-16 md:w-28 lg:w-36 bg-gradient-to-r from-space-white dark:from-space-dark to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-16 md:w-28 lg:w-36 bg-gradient-to-l from-space-white dark:from-space-dark to-transparent z-10 pointer-events-none" />

            <div className="flex w-max animate-scroll group-hover:[animation-play-state:paused] gap-2.5 sm:gap-3.5 md:gap-4 py-1.5">
              {[...row1Skills, ...row1Skills].map((skill, idx) => (
                <div
                  key={`row1-${idx}`}
                  className="flex items-center gap-2.5 sm:gap-3 px-3.5 py-2 sm:px-4 sm:py-2.5 sci-fi-card rounded-full group/item hover:scale-105 transition-all duration-300 shrink-0 cursor-default select-none shadow-sm hover:shadow-md hover:shadow-cyan-500/10 dark:hover:shadow-cyan-400/10"
                >
                  <div className="w-5 h-5 sm:w-6 sm:h-6 relative flex items-center justify-center shrink-0">
                    <div className="absolute inset-0 bg-nebula-purple/20 dark:bg-starlight-cyan/20 rounded-full blur-md opacity-0 group-hover/item:opacity-100 transition-opacity duration-300" />
                    <img
                      src={skill.icon}
                      alt={skill.name}
                      className={`w-full h-full object-contain ${skill.darkInvert ? "dark:invert" : ""}`}
                      loading="lazy"
                    />
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-200 group-hover/item:text-nebula-purple dark:group-hover/item:text-starlight-cyan transition-colors whitespace-nowrap">
                    {skill.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Row 2 - Right Scroll */}
          <div className="relative w-full overflow-hidden group">
            <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-16 md:w-28 lg:w-36 bg-gradient-to-r from-space-white dark:from-space-dark to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-16 md:w-28 lg:w-36 bg-gradient-to-l from-space-white dark:from-space-dark to-transparent z-10 pointer-events-none" />

            <div className="flex w-max animate-scroll-reverse group-hover:[animation-play-state:paused] gap-2.5 sm:gap-3.5 md:gap-4 py-1.5">
              {[...row2Skills, ...row2Skills].map((skill, idx) => (
                <div
                  key={`row2-${idx}`}
                  className="flex items-center gap-2.5 sm:gap-3 px-3.5 py-2 sm:px-4 sm:py-2.5 sci-fi-card rounded-full group/item hover:scale-105 transition-all duration-300 shrink-0 cursor-default select-none shadow-sm hover:shadow-md hover:shadow-purple-500/10 dark:hover:shadow-purple-400/10"
                >
                  <div className="w-5 h-5 sm:w-6 sm:h-6 relative flex items-center justify-center shrink-0">
                    <div className="absolute inset-0 bg-starlight-blue/20 dark:bg-nebula-glow/20 rounded-full blur-md opacity-0 group-hover/item:opacity-100 transition-opacity duration-300" />
                    <img
                      src={skill.icon}
                      alt={skill.name}
                      className={`w-full h-full object-contain ${skill.darkInvert ? "dark:invert" : ""}`}
                      loading="lazy"
                    />
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-200 group-hover/item:text-nebula-purple dark:group-hover/item:text-starlight-cyan transition-colors whitespace-nowrap">
                    {skill.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Section Telemetry Divider */}
        <div className="flex items-center justify-center gap-3 mb-8 sm:mb-10 text-center">
          <div className="h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-white/10 to-transparent flex-1 max-w-xs" />
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/70 dark:bg-white/5 border border-gray-200/80 dark:border-white/10 shadow-sm backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] sm:text-xs font-mono uppercase tracking-widest text-gray-600 dark:text-gray-400">
              Core Architecture Domains &bull; {totalSkillCount} Active Nodes
            </span>
          </div>
          <div className="h-px bg-gradient-to-l from-transparent via-gray-300 dark:via-white/10 to-transparent flex-1 max-w-xs" />
        </div>

        {/* 4 Architectural Pillar Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 max-w-6xl mx-auto">
          {skillCategories.map((category) => {
            const accentBorder = {
              cyan: "hover:border-starlight-cyan/60 group-hover:shadow-starlight-cyan/10",
              purple:
                "hover:border-nebula-purple/60 group-hover:shadow-nebula-purple/10",
              pink: "hover:border-pink-500/60 group-hover:shadow-pink-500/10",
              blue: "hover:border-starlight-blue/60 group-hover:shadow-starlight-blue/10",
            }[category.accent];

            const accentBadge = {
              cyan: "border-starlight-cyan/30 text-starlight-cyan bg-starlight-cyan/10",
              purple:
                "border-nebula-purple/30 text-nebula-purple bg-nebula-purple/10",
              pink: "border-pink-500/30 text-pink-500 bg-pink-500/10",
              blue: "border-starlight-blue/30 text-starlight-blue bg-starlight-blue/10",
            }[category.accent];

            const accentGlow = {
              cyan: "from-starlight-cyan/20 to-transparent",
              purple: "from-nebula-purple/20 to-transparent",
              pink: "from-pink-500/20 to-transparent",
              blue: "from-starlight-blue/20 to-transparent",
            }[category.accent];

            return (
              <div
                key={category.id}
                className={`group relative rounded-2xl bg-white/70 dark:bg-space-dark/80 backdrop-blur-md border border-gray-200/80 dark:border-white/10 p-5 sm:p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${accentBorder} flex flex-col justify-between`}
              >
                {/* Top Accent Gradient Line */}
                <div
                  className={`absolute top-0 left-6 right-6 h-[2px] bg-gradient-to-r ${accentGlow} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                />

                <div>
                  {/* Card Header */}
                  <div className="flex items-center justify-between mb-3.5">
                    <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-white/5 border border-gray-200/80 dark:border-white/10 flex items-center justify-center shrink-0 shadow-inner">
                      {category.icon}
                    </div>
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${accentBadge}`}
                    >
                      {String(category.skills.length).padStart(2, "0")} NODES
                    </span>
                  </div>

                  {/* Title & Tagline */}
                  <h4 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white font-mono tracking-tight mb-1 group-hover:text-nebula-purple dark:group-hover:text-starlight-cyan transition-colors">
                    {category.title}
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 mb-4 leading-relaxed">
                    {category.tagline}
                  </p>
                </div>

                {/* Skills Chips */}
                <div className="flex flex-wrap gap-1.5 pt-3 border-t border-gray-200/60 dark:border-white/5">
                  {category.skills.map((skill) => (
                    <span
                      key={skill.name}
                      className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] font-mono font-medium bg-gray-100/90 dark:bg-white/5 border border-gray-200/80 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:border-nebula-purple/40 dark:hover:border-starlight-cyan/40 hover:text-nebula-purple dark:hover:text-starlight-cyan transition-colors"
                    >
                      <img
                        src={skill.icon}
                        alt={skill.name}
                        className={`w-3 h-3 object-contain shrink-0 ${skill.darkInvert ? "dark:invert" : ""}`}
                        loading="lazy"
                      />
                      <span>{skill.name}</span>
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Skills;
