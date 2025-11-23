import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { Calendar } from 'lucide-react';

const experiences = [
    {
        id: 1,
        role: "Senior Frontend Engineer",
        company: "TechNova Solutions",
        period: "2023 - Present",
        description: "Leading the frontend team in rebuilding the core product using React and Next.js. Improved performance by 40% and established a new design system.",
        tags: ["React", "Next.js", "Team Leadership"]
    },
    {
        id: 2,
        role: "Fullstack Developer",
        company: "Orbit Systems",
        period: "2021 - 2023",
        description: "Developed scalable microservices using Node.js and Go. Implemented real-time data visualization features for the client dashboard.",
        tags: ["Node.js", "Go", "WebSockets"]
    },
    {
        id: 3,
        role: "Frontend Developer",
        company: "Creative Pulse",
        period: "2019 - 2021",
        description: "Collaborated with designers to create award-winning websites. Specialized in complex GSAP animations and WebGL experiences.",
        tags: ["Vue.js", "GSAP", "WebGL"]
    },
    {
        id: 4,
        role: "Frontend Developer2",
        company: "Creative Pulse",
        period: "2019 - 2021",
        description: "Collaborated with designers to create award-winning websites. Specialized in complex GSAP animations and WebGL experiences.",
        tags: ["Vue.js", "GSAP", "WebGL"]
    }
];

const Experience: React.FC = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const lineRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Line fill animation
            gsap.fromTo(lineRef.current,
                { height: "0%" },
                {
                    height: "100%",
                    ease: "none",
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top center",
                        end: "bottom center",
                        scrub: 1
                    }
                }
            );

            // Items fade in
            gsap.utils.toArray(".timeline-item").forEach((item: any) => {
                gsap.from(item, {
                    opacity: 0,
                    x: -50,
                    duration: 1,
                    scrollTrigger: {
                        trigger: item,
                        start: "top 80%",
                        toggleActions: "play none none reverse"
                    }
                });
            });

        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="min-h-screen flex items-center justify-center bg-space-white dark:bg-space-black relative py-24 transition-colors duration-300">
            {/* Background Elements */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-nebula-purple/5 via-transparent to-transparent" />
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-nebula-purple dark:text-nebula-glow font-medium tracking-widest uppercase mb-2">Mission History</h2>
                    <h3 className="text-3xl md:text-4xl font-bold text-space-black dark:text-white">Professional Experience</h3>
                </div>

                <div className="relative max-w-4xl mx-auto">
                    {/* Central Line */}
                    <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-gray-200 dark:bg-white/10 -translate-x-1/2 hidden md:block">
                        <div ref={lineRef} className="w-full bg-gradient-to-b from-nebula-purple to-starlight-blue dark:to-starlight-cyan" />
                    </div>

                    <div className="space-y-12">
                        {experiences.map((exp, index) => (
                            <div key={exp.id} className={`timeline-item flex flex-col md:flex-row gap-8 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>

                                {/* Content */}
                                <div className="flex-1">
                                    <div className="glass-panel p-6 rounded-xl border-l-4 border-nebula-purple hover:bg-gray-50 dark:hover:bg-white/5 transition-colors bg-white/50 dark:bg-white/5 border-gray-200 dark:border-white/10 shadow-sm">
                                        <div className="flex items-center justify-between mb-2">
                                            <h4 className="text-lg md:text-xl font-bold text-space-black dark:text-white">{exp.role}</h4>
                                            <span className="text-sm text-nebula-purple dark:text-nebula-glow font-mono hidden sm:inline-block">{exp.company}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm mb-4">
                                            <Calendar className="w-4 h-4" />
                                            {exp.period}
                                            <span className="sm:hidden">• {exp.company}</span>
                                        </div>
                                        <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                                            {exp.description}
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {exp.tags.map((tag, i) => (
                                                <span key={i} className="text-xs px-2 py-1 bg-gray-100 dark:bg-white/5 rounded text-gray-500 dark:text-gray-400">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Dot */}
                                <div className="relative flex items-center justify-center md:w-0">
                                    <div className="w-4 h-4 rounded-full bg-white dark:bg-space-black border-2 border-nebula-purple z-10 shadow-[0_0_10px_rgba(124,58,237,0.5)] hidden md:block" />
                                </div>

                                {/* Spacer for opposite side */}
                                <div className="flex-1 hidden md:block" />

                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Experience;
