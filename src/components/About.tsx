import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
    Cpu,
    Zap,
    GraduationCap,
    Briefcase,
    Rocket,
    ArrowUpRight,
    Layers,
    Send,
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface TechSatellite {
    label: string;
    sublabel: string;
    icon: string;
    darkInvert?: boolean;
    top?: string;
    left?: string;
    right?: string;
    bottom?: string;
    accentColor: string;
    floatDelay: number;
    floatDuration: number;
}

const techSatellites: TechSatellite[] = [
    {
        label: "React / Next.js",
        sublabel: "Reactive UI",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
        top: "2%",
        left: "2%",
        accentColor: "border-cyan-500/40 text-starlight-cyan shadow-cyan-500/10",
        floatDelay: 0,
        floatDuration: 2.8,
    },
    {
        label: "TypeScript",
        sublabel: "Typed Systems",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
        top: "2%",
        right: "2%",
        accentColor: "border-blue-500/40 text-starlight-blue shadow-blue-500/10",
        floatDelay: 0.5,
        floatDuration: 3.2,
    },
    {
        label: "Node / APIs",
        sublabel: "Microservices",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
        top: "44%",
        right: "-2%",
        accentColor: "border-emerald-500/40 text-emerald-500 dark:text-emerald-400 shadow-emerald-500/10",
        floatDelay: 0.2,
        floatDuration: 3.0,
    },
    {
        label: "PostgreSQL",
        sublabel: "Relational DB",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg",
        bottom: "4%",
        right: "3%",
        accentColor: "border-purple-500/40 text-nebula-purple shadow-purple-500/10",
        floatDelay: 0.7,
        floatDuration: 2.6,
    },
    {
        label: "Tailwind CSS",
        sublabel: "Design Tokens",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg",
        bottom: "4%",
        left: "3%",
        accentColor: "border-sky-500/40 text-sky-500 dark:text-sky-400 shadow-sky-500/10",
        floatDelay: 0.4,
        floatDuration: 3.4,
    },
    {
        label: "Docker & Cloud",
        sublabel: "Deployment",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg",
        top: "44%",
        left: "-2%",
        accentColor: "border-cyan-500/40 text-starlight-cyan shadow-cyan-500/10",
        floatDelay: 0.9,
        floatDuration: 2.9,
    },
];

const About: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top 75%",
                    toggleActions: "restart none restart none",
                },
            });

            // 1. Header Pill
            tl.fromTo(
                ".about-pill",
                { y: -20, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.5, ease: "power3.out" }
            )
            // 2. Headline
            .fromTo(
                ".about-headline",
                { y: 25, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" },
                "-=0.3"
            )
            // 3. Story Bio
            .fromTo(
                ".about-bio",
                { y: 20, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.5, ease: "power2.out" },
                "-=0.3"
            )
            // 4. 4 Tactical Cards (Staggered spring)
            .fromTo(
                ".about-card",
                { y: 30, opacity: 0, scale: 0.95 },
                {
                    y: 0,
                    opacity: 1,
                    scale: 1,
                    duration: 0.5,
                    stagger: 0.08,
                    ease: "back.out(1.2)",
                },
                "-=0.25"
            )
            // 5. Action CTA buttons
            .fromTo(
                ".about-actions",
                { y: 15, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.5, ease: "power2.out" },
                "-=0.2"
            )
            // 6. Center Cyber Core Entry
            .fromTo(
                ".about-core-center",
                { scale: 0.65, opacity: 0, rotate: -25 },
                { scale: 1, opacity: 1, rotate: 0, duration: 0.8, ease: "back.out(1.2)" },
                0.2
            )
            // 7. Radar Rings Entry
            .fromTo(
                ".about-radar-ring",
                { scale: 0.75, opacity: 0 },
                { scale: 1, opacity: 1, duration: 0.7, stagger: 0.1, ease: "power2.out" },
                0.35
            )
            // 8. Satellites Pop Outward
            .fromTo(
                ".about-satellite",
                { scale: 0, opacity: 0 },
                { scale: 1, opacity: 1, duration: 0.5, stagger: 0.06, ease: "back.out(1.5)" },
                0.45
            );

            // Separate continuous sinusoidal floating for the inner elements (zero conflict)
            techSatellites.forEach((sat, i) => {
                gsap.to(`.about-sat-float-${i}`, {
                    y: i % 2 === 0 ? -8 : 8,
                    x: i % 3 === 0 ? 3 : -3,
                    duration: sat.floatDuration,
                    delay: sat.floatDelay,
                    repeat: -1,
                    yoyo: true,
                    ease: "sine.inOut",
                });
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={containerRef}
            className="min-h-screen flex items-center justify-center bg-space-white dark:bg-space-dark relative overflow-hidden py-14 sm:py-16 lg:py-0 transition-colors duration-300"
        >
            {/* Background Ambient Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.04)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

            <div className="container mx-auto px-4 sm:px-6 max-w-7xl relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12 xl:gap-16">

                {/* Left Column: Story & Tactical Status */}
                <div className="flex-1 w-full max-w-2xl lg:max-w-none">
                    {/* Header Pill */}
                    <div className="about-pill inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 dark:bg-starlight-cyan/10 border border-cyan-500/30 dark:border-starlight-cyan/30 text-xs font-mono text-cyan-700 dark:text-starlight-cyan tracking-widest uppercase mb-3">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                        <span>PROFILE // MISSION LOG & BIO</span>
                    </div>

                    {/* Headline */}
                    <h2 className="about-headline text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-black sci-fi-heading mb-4 tracking-tight leading-tight">
                        Fullstack Developer <br />
                        <span className="sci-fi-gradient-text">
                            Engineering Modern Web Systems
                        </span>
                    </h2>

                    {/* Story Bio */}
                    <div className="about-bio space-y-2.5 mb-5 text-gray-600 dark:text-gray-300 text-xs sm:text-sm md:text-base leading-relaxed">
                        <p>
                            Graduated in <span className="font-bold text-gray-900 dark:text-white font-mono">April 2026</span> with an <span className="font-semibold text-nebula-purple dark:text-starlight-cyan">IT (Software Engineering)</span> degree from <span className="font-semibold text-gray-900 dark:text-white">King Mongkut's Institute of Technology Ladkrabang (KMITL)</span>. Currently operating as a professional <span className="font-bold text-gray-900 dark:text-white">Fullstack Developer</span>, architecting resilient web platforms, reactive frontend interfaces, and scalable backend APIs.
                        </p>
                        <p>
                            Focused on clean architecture and full-lifecycle delivery. Actively looking for exciting projects—readily available for <span className="font-bold text-cyan-600 dark:text-starlight-cyan">Freelance Development</span>, <span className="font-bold text-nebula-purple dark:text-nebula-glow">Part-time Engineering</span>, and impactful collaborative products.
                        </p>
                    </div>

                    {/* 4 Tactical Status Cards */}
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
                                    Active Ops
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
                        <div className="about-card p-3.5 sm:p-4 rounded-xl bg-emerald-500/5 dark:bg-emerald-950/25 border border-emerald-500/30 dark:border-emerald-400/30 hover:border-emerald-500/60 transition-all group">
                            <div className="flex items-center justify-between mb-1.5">
                                <div className="flex items-center gap-2">
                                    <div className="w-7 h-7 rounded-lg bg-emerald-500/10 dark:bg-emerald-400/15 flex items-center justify-center">
                                        <Rocket className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                                    </div>
                                    <span className="text-[11px] font-mono font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider">
                                        Target Horizon
                                    </span>
                                </div>
                                <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                                    Open for Hires
                                </span>
                            </div>
                            <h4 className="font-bold text-sm text-emerald-900 dark:text-emerald-200 font-mono mb-0.5">
                                Freelance & Part-time Dev
                            </h4>
                            <p className="text-[11px] text-emerald-800/80 dark:text-emerald-300/80">
                                Available for remote contracts, MVP launches & ongoing features
                            </p>
                        </div>

                        {/* Card 4: Philosophy */}
                        <div className="about-card p-3.5 sm:p-4 rounded-xl sci-fi-card hover:border-amber-500/50 dark:hover:border-amber-400/50 transition-all group">
                            <div className="flex items-center justify-between mb-1.5">
                                <div className="flex items-center gap-2">
                                    <div className="w-7 h-7 rounded-lg bg-amber-500/10 dark:bg-amber-400/10 flex items-center justify-center">
                                        <Zap className="w-3.5 h-3.5 text-amber-500" />
                                    </div>
                                    <span className="text-[11px] font-mono font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Execution
                                    </span>
                                </div>
                                <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-300 border border-amber-500/20">
                                    Full Spectrum
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

                    {/* Action Buttons */}
                    <div className="about-actions flex flex-wrap items-center gap-3">
                        <a
                            href="#contact"
                            className="sci-fi-btn-primary group cursor-pointer inline-flex items-center gap-2 text-xs sm:text-sm py-2 px-5"
                        >
                            <Send className="w-3.5 h-3.5 group-hover:rotate-12 transition-transform" />
                            <span>Initiate Collaboration</span>
                            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </a>
                        <a
                            href="#projects"
                            className="sci-fi-btn-secondary group inline-flex items-center gap-2 cursor-pointer text-xs sm:text-sm py-2 px-5"
                        >
                            <Layers className="w-3.5 h-3.5 text-nebula-purple dark:text-starlight-cyan" />
                            <span>Explore Projects Archive</span>
                        </a>
                    </div>
                </div>

                {/* Right Column: Holographic Cyber Core & Floating Tech Satellites */}
                <div className="w-full lg:w-auto flex justify-center items-center relative py-4 lg:py-0 shrink-0">
                    <div className="relative w-[300px] h-[300px] sm:w-[350px] sm:h-[350px] md:w-[380px] md:h-[380px] lg:w-[400px] lg:h-[400px] flex items-center justify-center">

                        {/* Ambient Glow */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-nebula-purple/30 via-starlight-blue/20 to-starlight-cyan/30 rounded-full blur-[70px] pointer-events-none" />

                        {/* Outer Telemetry Compass Ring (Slow Spin) */}
                        <div className="about-radar-ring absolute inset-2 sm:inset-4 border border-dashed border-cyan-500/30 dark:border-cyan-400/35 rounded-full animate-spin-slow pointer-events-none" />

                        {/* Inner Concentric Gyro Ring (Reverse Spin) */}
                        <div
                            className="about-radar-ring absolute inset-8 sm:inset-12 border border-purple-500/25 dark:border-purple-400/30 rounded-full animate-spin-slow pointer-events-none"
                            style={{ animationDirection: 'reverse', animationDuration: '28s' }}
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

                        {/* Orbiting Satellite Tech Chips (Decoupled animation containers) */}
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
                                        className={`w-3.5 h-3.5 sm:w-4 sm:h-4 object-contain shrink-0 ${sat.darkInvert ? 'dark:invert' : ''}`}
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

            </div>
        </section>
    );
};

export default About;
