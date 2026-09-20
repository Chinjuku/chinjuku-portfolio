import React, { useRef, useLayoutEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Github, ExternalLink, ArrowRight, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { projects } from '../data/projects';

gsap.registerPlugin(ScrollTrigger);

const Projects: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const orbitRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [showRepoModal, setShowRepoModal] = useState(false);

    const handleRepoClick = (repos: string | string[]) => {
        if (Array.isArray(repos)) {
            setShowRepoModal(true);
        } else {
            window.open(repos, '_blank');
        }
    };

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            const totalProjects = projects.length;
            // We want to rotate such that each project comes to the "9 o'clock" position (180 degrees in CSS rotation if 0 is 3 o'clock, or 270 if 0 is 12 o'clock).
            // Let's assume 0 degrees is 3 o'clock (standard CSS).
            // We place items at: 0, 90, 180, 270.
            // To bring item 0 to left (180deg), we need initial rotation.

            // Actually, let's just space them evenly and rotate the whole ring.
            // Angle between items = 360 / total.

            // const angleIncrement = 360 / totalProjects; // Unused

            // ScrollTrigger to rotate the orbit
            gsap.to(orbitRef.current, {
                rotation: 360, // Rotate one full circle (or more depending on logic)
                ease: "none",
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top top",
                    end: "+=4000", // Longer scroll distance for slower rotation
                    pin: true,
                    scrub: 1,
                    onUpdate: (self) => {
                        // Calculate active index based on rotation
                        // We want the item at the "left" (180 degrees) to be active.
                        // As we rotate clockwise (+rotation), items move.

                        // Normalize progress to 0-1
                        const progress = self.progress;

                        // Map progress to index. 
                        // 0.0 -> Index 0
                        // 0.25 -> Index 1
                        // etc.
                        const index = Math.round(progress * (totalProjects - 1));
                        setActiveIndex(Math.min(Math.max(index, 0), totalProjects - 1));
                    }
                }
            });

        }, containerRef);

        return () => ctx.revert();
    }, []);

    // Calculate position for each planet
    const getPlanetStyle = (index: number) => {
        const total = projects.length;
        // Place items evenly along the arc
        const offsetAngle = 180 - (index * (360 / total));

        // Determine the radius based on screen size for responsive orbit
        let radius = 150; // Default for mobile (half of 300px orbit width)
        if (window.innerWidth >= 768) { // md breakpoint
            radius = 250; // Half of 500px orbit width
        }
        if (window.innerWidth >= 1024) { // lg breakpoint
            radius = 450; // Half of 900px orbit width
        }

        return {
            transform: `rotate(${offsetAngle}deg) translate(${radius}px) rotate(-${offsetAngle}deg)`,
        };
    };

    return (
        <section ref={containerRef} className="relative h-screen w-full bg-space-white dark:bg-space-black overflow-hidden flex items-center transition-colors duration-300">

            {/* Background Elements */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-nebula-purple/5 via-transparent to-transparent" />

            <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center relative z-10 h-full pt-20 lg:pt-0">

                {/* Left Side: Text Content */}
                <div className="flex flex-col justify-center h-full order-2 lg:order-1 pointer-events-none md:pointer-events-auto relative z-20">
                    <div className="mb-2 lg:mb-4">
                        <span className="sci-fi-subheading">Project 0{projects[activeIndex].id} // DEPLOYMENT</span>
                    </div>

                    <h2 className="text-4xl md:text-5xl lg:text-7xl font-bold sci-fi-heading mb-4 lg:mb-8 transition-all duration-500 leading-tight">
                        {projects[activeIndex].title}
                    </h2>

                    <p className="text-gray-600 dark:text-gray-300 text-sm md:text-base lg:text-lg leading-relaxed mb-6 lg:mb-8 max-w-xl transition-all duration-500 line-clamp-3 md:line-clamp-none">
                        {projects[activeIndex].description}
                    </p>

                    <div className="flex flex-wrap gap-2 lg:gap-3 mb-8 lg:mb-10">
                        {projects[activeIndex].tech.map((t, i) => (
                            <span key={i} className="sci-fi-badge">
                                {t}
                            </span>
                        ))}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 lg:gap-6 mb-8 lg:mb-10">
                        <div className="flex flex-wrap gap-3 lg:gap-5">
                            {projects[activeIndex].web_url && (
                                <button
                                    onClick={() => window.open(projects[activeIndex].web_url, '_blank')}
                                    className="sci-fi-btn-primary"
                                >
                                    <ExternalLink className="w-4 h-4" />
                                    Live Demo
                                </button>
                            )}
                            <button
                                onClick={() => handleRepoClick(projects[activeIndex].repos)}
                                className="sci-fi-btn-secondary"
                            >
                                <Github className="w-4 h-4" />
                                Source Code
                            </button>
                        </div>
                    </div>

                    {/* View All Projects Button */}
                    <Link to="/projects" className="group inline-flex items-center gap-2 text-nebula-purple dark:text-starlight-cyan hover:text-nebula-glow dark:hover:text-white transition-colors mt-2 sm:mt-0 font-mono text-sm tracking-wider uppercase">
                        <span className="font-semibold">View Project Archives</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                    </Link>

                </div>

                {/* Right Side: Visuals (Orbit + Preview) */}
                <div className="relative h-full flex items-center justify-center order-1 lg:order-2">

                    {/* Project Preview Card (Floating) */}
                    <div className="absolute left-0 md:-left-20 top-1/2 -translate-y-1/2 w-full md:w-[600px] aspect-video z-10 hidden md:block">
                        {projects.map((project, index) => (
                            <div
                                key={project.id}
                                className={`absolute inset-0 transition-all duration-700 ease-out ${index === activeIndex ? 'opacity-100 translate-x-0 scale-100' : 'opacity-0 translate-x-20 scale-95'}`}
                            >
                                <div className="relative w-full h-full rounded-2xl overflow-hidden border border-gray-200 dark:border-white/10 shadow-2xl bg-white/50 dark:bg-space-black/50 backdrop-blur-sm group">
                                    <img
                                        src={project.image}
                                        alt={project.title}
                                        className="w-full h-full object-cover opacity-90 dark:opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-white/80 dark:from-space-black/80 via-transparent to-transparent" />

                                    {/* Decorative UI Elements */}
                                    <div className="absolute top-4 left-4 flex gap-2">
                                        <div className="w-3 h-3 rounded-full bg-red-500/50" />
                                        <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                                        <div className="w-3 h-3 rounded-full bg-green-500/50" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* The Orbit Track */}
                    <div
                        ref={orbitRef}
                        className="absolute right-[-100px] md:right-[-200px] lg:right-[-450px] w-[300px] h-[300px] md:w-[500px] md:h-[500px] lg:w-[900px] lg:h-[900px] rounded-full border border-gray-200 dark:border-white/5 flex items-center justify-center pointer-events-none transition-colors duration-300"
                    >
                        {/* Central Star/Core (Decorative) */}
                        <div className="absolute w-[80%] h-[80%] rounded-full border border-dashed border-gray-200 dark:border-white/5 animate-[spin_120s_linear_infinite]" />

                        {/* Planets */}
                        {projects.map((project, index) => (
                            <div
                                key={project.id}
                                className={`absolute w-8 h-8 md:w-12 md:h-12 lg:w-16 lg:h-16 rounded-full shadow-[0_0_30px_rgba(0,0,0,0.5)] transition-all duration-500 flex items-center justify-center ${index === activeIndex ? 'scale-125 z-20' : 'scale-75 z-10 opacity-50'}`}
                                style={getPlanetStyle(index)}
                            >
                                {/* Planet Visual (Gradient) */}
                                <div className={`w-full h-full rounded-full bg-gradient-to-br ${project.color} relative overflow-hidden group`}>
                                    <div className="absolute inset-0 bg-white/30 rounded-full blur-sm opacity-50" />
                                    <div className="absolute -inset-1 bg-gradient-to-tr from-transparent to-white/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>

                                {/* Label for non-active planets */}
                                {index !== activeIndex && (
                                    <div className="absolute -bottom-8 text-xs text-gray-500 font-mono whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity hidden lg:block">
                                        {project.title}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

            </div>

            {/* Scroll Progress Indicator */}
            <div className="absolute bottom-10 right-10 flex flex-col gap-2 z-20">
                {projects.map((_, idx) => (
                    <div
                        key={idx}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${idx === activeIndex ? 'bg-nebula-purple scale-150' : 'bg-gray-300 dark:bg-white/20'}`}
                    />
                ))}
            </div>

            {/* Repo Modal */}
            {showRepoModal && Array.isArray(projects[activeIndex].repos) && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
                    <div className="sci-fi-glass rounded-2xl p-6 max-w-sm w-full relative">
                        <button
                            onClick={() => setShowRepoModal(false)}
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="flex items-center gap-2 mb-4">
                            <span className="w-2 h-2 rounded-full bg-starlight-cyan animate-ping" />
                            <h3 className="text-xl font-bold sci-fi-heading">Select Repository</h3>
                        </div>

                        <div className="space-y-3">
                            <a
                                href={(projects[activeIndex].repos as string[])[0]}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between p-4 rounded-xl sci-fi-card group"
                            >
                                <span className="font-medium text-gray-800 dark:text-gray-200 group-hover:text-nebula-purple dark:group-hover:text-starlight-cyan transition-colors">Frontend Repository</span>
                                <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-nebula-purple dark:group-hover:text-starlight-cyan transition-colors" />
                            </a>

                            <a
                                href={(projects[activeIndex].repos as string[])[1]}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between p-4 rounded-xl sci-fi-card group"
                            >
                                <span className="font-medium text-gray-800 dark:text-gray-200 group-hover:text-nebula-purple dark:group-hover:text-starlight-cyan transition-colors">Backend Repository</span>
                                <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-nebula-purple dark:group-hover:text-starlight-cyan transition-colors" />
                            </a>
                        </div>
                    </div>
                </div>
            )}

        </section>
    );
};

export default Projects;
