import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
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

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Entrance Animation
            gsap.from(".skill-category", {
                y: 50,
                opacity: 0,
                duration: 0.8,
                stagger: 0.2,
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 80%",
                }
            });

            // Floating Animation for Icons
            gsap.to(".skill-icon-container", {
                y: -10,
                duration: 2,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
                stagger: {
                    each: 0.1,
                    from: "random"
                }
            });

        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="min-h-screen flex items-center justify-center bg-space-white dark:bg-space-dark relative overflow-hidden py-24 transition-colors duration-300">
            {/* Background Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.05)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-nebula-purple dark:text-nebula-glow font-medium tracking-widest uppercase mb-2">The Arsenal</h2>
                    <h3 className="text-3xl md:text-4xl font-bold text-space-black dark:text-white">Technical Proficiency</h3>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {skillCategories.map((category, idx) => (
                        <div
                            key={idx}
                            className="skill-category glass-panel p-8 rounded-2xl bg-white/50 dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:border-nebula-purple/30 transition-colors duration-300"
                        >
                            <div className="flex items-center gap-4 mb-8">
                                <div className="p-3 rounded-lg bg-nebula-purple/10 dark:bg-white/5">
                                    {category.icon}
                                </div>
                                <h4 className="text-xl font-bold text-space-black dark:text-white">{category.title}</h4>
                            </div>

                            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-6">
                                {category.skills.map((skill, sIdx) => (
                                    <div key={sIdx} className="skill-icon-container flex flex-col items-center gap-3 group">
                                        <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 flex items-center justify-center p-2.5 shadow-sm group-hover:shadow-lg group-hover:border-nebula-purple/50 transition-all duration-300 relative overflow-hidden">
                                            <div className="absolute inset-0 bg-nebula-purple/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            <img
                                                src={skill.icon}
                                                alt={skill.name}
                                                className={`w-full h-full object-contain transition-transform duration-300 group-hover:scale-110 ${skill.darkInvert ? 'dark:invert' : ''}`}
                                            />
                                        </div>
                                        <span className="text-xs font-medium text-gray-600 dark:text-gray-400 group-hover:text-nebula-purple dark:group-hover:text-white transition-colors">
                                            {skill.name}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Skills;
