import React, { useRef } from 'react';
import { Code2, Cloud, Database, Globe } from 'lucide-react';

const skillCategories = [
    {
        title: "Programming Languages",
        icon: <Code2 className="w-6 h-6 text-starlight-cyan" />,
        skills: [
            { name: "HTML", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" },
            { name: "CSS", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" },
            { name: "Python", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" },
            { name: "PHP", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg" },
            { name: "Java", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg" },
            { name: "JavaScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" },
            { name: "TypeScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" },
        ]
    },
    {
        title: "Frameworks",
        icon: <Globe className="w-6 h-6 text-nebula-purple" />,
        skills: [
            { name: "React", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
            { name: "Next.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg", darkInvert: true },
            { name: "Vue.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg" },
            { name: "Django", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/django/django-plain.svg" },
            { name: "Tailwind", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg" },
            { name: "Node.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" },
            { name: "Laravel", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/laravel/laravel-original.svg" },
            { name: "FastAPI", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg", darkInvert: true },
            { name: "Flask", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flask/flask-original.svg", darkInvert: true },
        ]
    },
    {
        title: "Databases",
        icon: <Database className="w-6 h-6 text-pink-500" />,
        skills: [
            { name: "MySQL", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg" },
            { name: "SQLite", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sqlite/sqlite-original.svg" },
            { name: "MongoDB", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" },
            { name: "PostgreSQL", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg" },
            { name: "Prisma", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/prisma/prisma-original.svg", darkInvert: true }
        ]
    },
    {
        title: "Tools",
        icon: <Cloud className="w-6 h-6 text-starlight-blue" />,
        skills: [
            { name: "Git", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" },
            { name: "Docker", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg" },
            { name: "VS Code", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg" },
            { name: "Figma", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg" },
            { name: "Canva", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/canva/canva-original.svg" },
            { name: "AWS", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original-wordmark.svg" },
        ]
    }
];

const Skills: React.FC = () => {
    const sectionRef = useRef<HTMLDivElement>(null);

    // Flatten skills for rows
    const row1Skills = [...skillCategories[0].skills, ...skillCategories[1].skills]; // Languages + Frameworks
    const row2Skills = [...skillCategories[2].skills, ...skillCategories[3].skills]; // Databases + Tools

    return (
        <section ref={sectionRef} className="min-h-screen flex items-center justify-center bg-space-white dark:bg-space-dark relative overflow-hidden py-24 transition-colors duration-300">
            {/* Background Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.05)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

            <div className="container mx-auto relative z-10 w-full overflow-hidden">
                <div className="text-center mb-16">
                    <h2 className="text-nebula-purple dark:text-nebula-glow font-medium tracking-widest uppercase mb-2">The Arsenal</h2>
                    <h3 className="text-3xl md:text-4xl font-bold text-space-black dark:text-white">Technical Proficiency</h3>
                </div>

                <div className="space-y-16">
                    {/* Row 1 - Left Scroll */}
                    <div className="relative w-full overflow-hidden group">
                        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-space-white dark:from-space-dark to-transparent z-10" />
                        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-space-white dark:from-space-dark to-transparent z-10" />
                        
                        <div className="flex w-max animate-scroll group-hover:[animation-play-state:paused] gap-8">
                            {[...row1Skills, ...row1Skills].map((skill, idx) => (
                                <div key={`row1-${idx}`} className="flex flex-col items-center justify-center gap-4 w-40 h-40 glass-panel rounded-2xl bg-white/50 dark:bg-white/5 group/item hover:border-nebula-purple transition-colors duration-300">
                                    <div className="w-16 h-16 relative flex items-center justify-center">
                                        <div className="absolute inset-0 bg-nebula-purple/20 rounded-full blur-xl opacity-0 group-hover/item:opacity-100 transition-opacity" />
                                        <img
                                            src={skill.icon}
                                            alt={skill.name}
                                            className={`w-full h-full object-contain ${skill.darkInvert ? 'dark:invert' : ''}`}
                                        />
                                    </div>
                                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 group-hover/item:text-nebula-purple dark:group-hover/item:text-white transition-colors">
                                        {skill.name}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Row 2 - Right Scroll */}
                    <div className="relative w-full overflow-hidden group">
                        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-space-white dark:from-space-dark to-transparent z-10" />
                        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-space-white dark:from-space-dark to-transparent z-10" />

                        <div className="flex w-max animate-scroll-reverse group-hover:[animation-play-state:paused] gap-8">
                            {[...row2Skills, ...row2Skills].map((skill, idx) => (
                                <div key={`row2-${idx}`} className="flex flex-col items-center justify-center gap-4 w-40 h-40 glass-panel rounded-2xl bg-white/50 dark:bg-white/5 group/item hover:border-nebula-purple transition-colors duration-300">
                                    <div className="w-16 h-16 relative flex items-center justify-center">
                                        <div className="absolute inset-0 bg-nebula-purple/20 rounded-full blur-xl opacity-0 group-hover/item:opacity-100 transition-opacity" />
                                        <img
                                            src={skill.icon}
                                            alt={skill.name}
                                            className={`w-full h-full object-contain ${skill.darkInvert ? 'dark:invert' : ''}`}
                                        />
                                    </div>
                                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 group-hover/item:text-nebula-purple dark:group-hover/item:text-white transition-colors">
                                        {skill.name}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Skills;
