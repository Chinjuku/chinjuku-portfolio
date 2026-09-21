import React, { useRef, useLayoutEffect, useEffect, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Github, ExternalLink, ArrowRight, X, ChevronsUp, ArrowUpDown, Radio, Crosshair } from 'lucide-react';
import { Link } from 'react-router-dom';
import { projects } from '../data/projects';

gsap.registerPlugin(ScrollTrigger);

const Projects: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const orbitRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [showRepoModal, setShowRepoModal] = useState(false);
    const [selectedRepos, setSelectedRepos] = useState<string | string[] | null>(null);

    // Responsive window width tracking
    const [windowWidth, setWindowWidth] = useState<number>(() =>
        typeof window !== 'undefined' ? window.innerWidth : 1200
    );

    const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
    const scrollTriggerInstanceRef = useRef<ScrollTrigger | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const touchStartYRef = useRef(0);
    const touchCurrentYRef = useRef(0);

    // Resize listener for fluid responsive orbit geometry
    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleRepoClick = (repos: string | string[]) => {
        setSelectedRepos(repos);
        if (Array.isArray(repos)) {
            setShowRepoModal(true);
        } else {
            window.open(repos, '_blank');
        }
    };

    // Smooth programmatic scroll to a project step
    const scrollToProject = useCallback((targetIndex: number) => {
        const totalProjects = projects.length;
        const clampedIndex = Math.min(Math.max(targetIndex, 0), totalProjects - 1);
        const st = scrollTriggerInstanceRef.current;
        if (st) {
            const progressTarget = clampedIndex / (totalProjects - 1);
            const targetScroll = st.start + progressTarget * (st.end - st.start);
            window.scrollTo({
                top: targetScroll,
                behavior: 'smooth',
            });
        } else {
            setActiveIndex(clampedIndex);
        }
    }, []);

    // Swap trigger button & swipe handler
    const triggerSwap = useCallback((direction: 'up' | 'down' = 'up') => {
        const totalProjects = projects.length;
        const nextIndex = direction === 'up'
            ? (activeIndex + 1) % totalProjects
            : (activeIndex - 1 + totalProjects) % totalProjects;
        scrollToProject(nextIndex);
    }, [activeIndex, scrollToProject]);

    // Touch gesture handlers for mobile swipe
    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartYRef.current = e.touches[0].clientY;
        touchCurrentYRef.current = e.touches[0].clientY;
        setIsDragging(true);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!isDragging) return;
        touchCurrentYRef.current = e.touches[0].clientY;
    };

    const handleTouchEnd = () => {
        if (!isDragging) return;
        setIsDragging(false);
        const diff = touchCurrentYRef.current - touchStartYRef.current;
        if (diff < -35) {
            triggerSwap('up');
        } else if (diff > 35) {
            triggerSwap('down');
        }
    };

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            const totalProjects = projects.length;
            const totalOrbitRotation = (totalProjects - 1) * (360 / totalProjects);

            // Set initial card states with depth and subtle drop shadow
            cardsRef.current.forEach((card, idx) => {
                if (!card) return;
                if (idx === 0) {
                    gsap.set(card, { y: 0, scale: 1, opacity: 1, zIndex: 30 });
                } else if (idx === 1) {
                    gsap.set(card, { y: 22, scale: 0.96, opacity: 0.88, zIndex: 20 });
                } else if (idx === 2) {
                    gsap.set(card, { y: 44, scale: 0.92, opacity: 0.65, zIndex: 10 });
                } else {
                    gsap.set(card, { y: 66, scale: 0.88, opacity: 0, zIndex: 5 });
                }
            });

            // Unified Master Timeline pinned to scroll
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top top",
                    end: "+=3600",
                    pin: true,
                    scrub: 1,
                    onUpdate: (self) => {
                        const progress = self.progress;
                        const index = Math.round(progress * (totalProjects - 1));
                        setActiveIndex(Math.min(Math.max(index, 0), totalProjects - 1));
                    }
                }
            });

            scrollTriggerInstanceRef.current = tl.scrollTrigger ?? null;

            // 1. Synchronized Orbit Rotation matching scroll
            tl.to(orbitRef.current, {
                rotation: totalOrbitRotation,
                ease: "none",
                duration: totalProjects - 1,
            }, 0);

            // 2. Synchronized Card Swapping per project step
            for (let i = 0; i < totalProjects - 1; i++) {
                const stepStartTime = i;

                // Active card i lifts smoothly upwards and out of view
                const currentCard = cardsRef.current[i];
                if (currentCard) {
                    tl.to(currentCard, {
                        y: "-130%",
                        rotation: -2.5,
                        opacity: 0,
                        ease: "power1.inOut",
                        duration: 0.85,
                    }, stepStartTime + 0.08);
                }

                // Next card i+1 steps up into front active position (y: 0, scale 1, opacity 1)
                const nextCard = cardsRef.current[i + 1];
                if (nextCard) {
                    tl.to(nextCard, {
                        y: 0,
                        scale: 1,
                        opacity: 1,
                        zIndex: 30,
                        ease: "power1.inOut",
                        duration: 0.85,
                    }, stepStartTime + 0.08);
                }

                // Card i+2 steps up into middle peek position (22px, scale 0.96, opacity 0.88)
                if (i + 2 < totalProjects) {
                    const card2 = cardsRef.current[i + 2];
                    if (card2) {
                        tl.to(card2, {
                            y: 22,
                            scale: 0.96,
                            opacity: 0.88,
                            zIndex: 20,
                            ease: "power1.inOut",
                            duration: 0.85,
                        }, stepStartTime + 0.08);
                    }
                }

                // Card i+3 steps up into back deck position (44px, scale 0.92, opacity 0.65)
                if (i + 3 < totalProjects) {
                    const card3 = cardsRef.current[i + 3];
                    if (card3) {
                        tl.to(card3, {
                            y: 44,
                            scale: 0.92,
                            opacity: 0.65,
                            zIndex: 10,
                            ease: "power1.inOut",
                            duration: 0.85,
                        }, stepStartTime + 0.08);
                    }
                }
            }

        }, containerRef);

        return () => ctx.revert();
    }, []);

    // Calculate dynamic responsive radius matching the orbit element width
    const getPlanetRadius = useCallback(() => {
        if (windowWidth >= 1280) return 440; // xl (orbit ~880px)
        if (windowWidth >= 1024) return 360; // lg (orbit ~720px)
        if (windowWidth >= 768) return 210;  // md (orbit ~420px)
        if (windowWidth >= 640) return 160;  // sm (orbit ~320px)
        return 130;                          // mobile (< 640px, orbit ~260px)
    }, [windowWidth]);

    // Calculate position for each planet along the circular track
    const getPlanetStyle = (index: number) => {
        const total = projects.length;
        // Planet 0 starts at 180deg (9 o'clock), each next is 90deg counter-clockwise
        const offsetAngle = 180 - (index * (360 / total));
        const radius = getPlanetRadius();

        return {
            transform: `rotate(${offsetAngle}deg) translate(${radius}px) rotate(-${offsetAngle}deg)`,
        };
    };

    const activeProject = projects[activeIndex];

    return (
        <section ref={containerRef} className="relative h-screen w-full bg-space-white dark:bg-space-black overflow-hidden flex items-center transition-colors duration-300">

            {/* Background Ambient Elements */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-nebula-purple/5 via-transparent to-transparent pointer-events-none" />

            <div className="container mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-12 items-center relative z-10 h-full pt-20 sm:pt-28 md:pt-36 lg:pt-0">

                {/* Left Side: Modern Vertical Card-Stack Swap UI Component */}
                <div className="flex flex-col justify-center h-full order-2 lg:order-1 relative z-20 w-full max-w-xl mx-auto lg:mx-0">
                    {/* Header telemetry info */}
                    <div className="flex items-center justify-between gap-3 mb-2 sm:mb-3 px-1">
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-starlight-cyan animate-pulse shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
                            <span className="sci-fi-subheading tracking-wider text-[11px] sm:text-xs">MISSION LOG // CARD STACK</span>
                        </div>
                        <div className="flex items-center gap-1.5 font-mono text-xs text-gray-500 dark:text-gray-400">
                            <span className="text-nebula-purple dark:text-starlight-cyan font-bold">0{activeIndex + 1}</span>
                            <span>/</span>
                            <span>0{projects.length}</span>
                        </div>
                    </div>

                    {/* Vertical Card Stack Container (All 4 cards rendered, animated synchronously with scroll) */}
                    <div
                        className="relative w-full h-[350px] sm:h-[420px] lg:h-[490px] select-none"
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                    >
                        {projects.map((project, idx) => {
                            const isCurrentActive = idx === activeIndex;
                            const isBehind = idx > activeIndex;

                            return (
                                <div
                                    key={project.id}
                                    ref={(el) => { cardsRef.current[idx] = el; }}
                                    onClick={() => {
                                        if (isBehind) {
                                            scrollToProject(idx);
                                        }
                                    }}
                                    className={`absolute inset-x-0 top-0 rounded-2xl md:rounded-3xl border border-gray-200/90 dark:border-cyan-500/30 bg-white/95 dark:bg-[#0b0d16]/95 backdrop-blur-xl p-4 sm:p-6 lg:p-7 shadow-[0_18px_45px_rgba(0,0,0,0.12)] dark:shadow-[0_20px_55px_rgba(0,0,0,0.85)] ring-1 ring-black/5 dark:ring-white/5 overflow-hidden transition-colors ${
                                        isCurrentActive
                                            ? 'pointer-events-auto'
                                            : isBehind
                                            ? 'cursor-pointer hover:border-nebula-purple/50 dark:hover:border-starlight-cyan/50'
                                            : 'pointer-events-none'
                                    }`}
                                >
                                    {/* Corner HUD Reticle Accents */}
                                    <div className="absolute top-2.5 left-2.5 w-3 h-3 border-t-2 border-l-2 border-nebula-purple/50 dark:border-starlight-cyan/60 pointer-events-none" />
                                    <div className="absolute bottom-2.5 right-2.5 w-3 h-3 border-b-2 border-r-2 border-nebula-purple/50 dark:border-starlight-cyan/60 pointer-events-none" />

                                    {/* Card Header */}
                                    <div className="flex items-center justify-between gap-2 mb-2 sm:mb-3">
                                        <div className="flex items-center gap-1.5 min-w-0">
                                            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isCurrentActive ? 'bg-emerald-400 animate-pulse' : 'bg-gray-400'}`} />
                                            <span className="sci-fi-subheading text-[10px] sm:text-xs truncate">
                                                {isCurrentActive ? `PROJECT 0${project.id} // ACTIVE` : `PROJECT 0${project.id} // DECK`}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-1.5 shrink-0">
                                            <span className="text-[10px] sm:text-[11px] font-mono px-2 py-0.5 rounded-full bg-black/5 dark:bg-white/10 text-gray-600 dark:text-gray-300">
                                                {project.role}
                                            </span>
                                            {/* Swap Action Button */}
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    triggerSwap('up');
                                                }}
                                                className="group flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full border border-gray-200 dark:border-white/15 bg-black/5 dark:bg-white/5 hover:bg-nebula-purple/15 dark:hover:bg-cyan-500/15 text-gray-700 dark:text-gray-200 text-xs font-mono transition-all cursor-pointer"
                                                title="Swap to next project card"
                                            >
                                                <ChevronsUp className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform text-nebula-purple dark:text-starlight-cyan" />
                                                <span className="hidden sm:inline text-[11px] font-semibold">SWAP</span>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Mobile-Only Tactical Screenshot Banner (Visible on mobile < sm) */}
                                    <div className="sm:hidden relative w-full h-20 rounded-lg overflow-hidden mb-2 border border-cyan-500/25 bg-black/80">
                                        <img
                                            src={project.image}
                                            alt={project.title}
                                            className="w-full h-full object-cover opacity-85"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                                        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.35)_50%)] bg-[length:100%_4px] opacity-40 pointer-events-none" />
                                        <div className="absolute top-1.5 left-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/70 border border-cyan-400/40 text-[9px] font-mono text-cyan-300">
                                            <Radio className="w-2.5 h-2.5 animate-pulse text-cyan-400" />
                                            <span>SYS.0{project.id} // CAM FEED</span>
                                        </div>
                                    </div>

                                    {/* Project Title */}
                                    <h3 className="text-lg sm:text-2xl lg:text-3xl font-bold sci-fi-heading mb-1 sm:mb-2 transition-colors">
                                        {project.title}
                                    </h3>

                                    {/* Project Description */}
                                    <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm lg:text-base leading-relaxed mb-2.5 sm:mb-4 line-clamp-2 sm:line-clamp-3 md:line-clamp-4">
                                        {project.description}
                                    </p>

                                    {/* Tech Stack Badges */}
                                    <div className="flex flex-wrap gap-1 sm:gap-1.5 mb-3 sm:mb-5">
                                        {project.tech.map((t, i) => (
                                            <span key={i} className="sci-fi-badge text-[10px] sm:text-xs py-0.5 px-2 sm:px-2.5">
                                                {t}
                                            </span>
                                        ))}
                                    </div>

                                    {/* Distinct Primary Action Button & Secondary Button */}
                                    <div className="flex items-center gap-2 pt-2 border-t border-gray-100 dark:border-white/10">
                                        {project.web_url ? (
                                            <>
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        window.open(project.web_url, '_blank');
                                                    }}
                                                    className="sci-fi-btn-primary flex-1 py-1.5 sm:py-2 px-3 text-xs sm:text-sm shadow-md shadow-cyan-500/25 dark:shadow-cyan-500/40"
                                                >
                                                    <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                                    <span>Live Demo</span>
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleRepoClick(project.repos);
                                                    }}
                                                    className="sci-fi-btn-secondary py-1.5 sm:py-2 px-3 sm:px-4 text-xs sm:text-sm"
                                                    title="Inspect Source Code"
                                                >
                                                    <Github className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                                    <span className="hidden sm:inline">Source Code</span>
                                                </button>
                                            </>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleRepoClick(project.repos);
                                                }}
                                                className="sci-fi-btn-primary w-full py-1.5 sm:py-2 text-xs sm:text-sm shadow-md shadow-nebula-purple/30 dark:shadow-starlight-cyan/30"
                                            >
                                                <Github className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                                <span>Inspect Source Code</span>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Bottom Deck Controls & Footer (Spaced generously below peek cards for comfortable mobile touch) */}
                    <div className="flex items-center justify-between gap-3 mt-14 sm:mt-16 lg:mt-6 px-1 relative z-30">
                        {/* View Project Archives Link */}
                        <Link
                            to="/projects"
                            className="group inline-flex items-center gap-1.5 py-2 px-1 text-xs sm:text-sm font-mono text-gray-600 dark:text-gray-400 hover:text-nebula-purple dark:hover:text-starlight-cyan transition-colors"
                        >
                            <span className="font-semibold underline-offset-4 group-hover:underline">View Project Archives</span>
                            <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-1.5 transition-transform text-starlight-cyan" />
                        </Link>

                        {/* Swipe Gesture Hint & Interactive Stack Dots */}
                        <div className="flex items-center gap-2 sm:gap-3">
                            <div className="hidden xs:flex items-center gap-1 font-mono text-[10px] sm:text-[11px] text-gray-500 dark:text-gray-400">
                                <ArrowUpDown className="w-3 h-3 text-nebula-purple dark:text-starlight-cyan animate-pulse" />
                                <span className="hidden sm:inline">Swap</span>
                            </div>

                            <div className="flex items-center gap-1 p-1 rounded-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10">
                                {projects.map((_, idx) => (
                                    <button
                                        key={idx}
                                        type="button"
                                        onClick={() => scrollToProject(idx)}
                                        className="p-1 cursor-pointer flex items-center justify-center transition-all"
                                        aria-label={`Go to project ${idx + 1}`}
                                    >
                                        <span
                                            className={`block h-2 rounded-full transition-all duration-300 ${
                                                idx === activeIndex
                                                    ? 'w-6 bg-gradient-to-r from-nebula-purple to-starlight-cyan shadow-[0_0_8px_rgba(6,182,212,0.7)]'
                                                    : 'w-2 bg-gray-300 dark:bg-white/20 hover:bg-gray-400 dark:hover:bg-white/40'
                                            }`}
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Option 1 Holographic Tactical Observatory */}
                <div className="relative h-[240px] sm:h-[270px] md:h-[300px] lg:h-full flex items-center justify-center order-1 lg:order-2 w-full my-auto lg:my-0 pointer-events-none">

                    {/* Dynamic SVG Telemetry Callout (Desktop/Large Screen) */}
                    <div className="absolute inset-0 pointer-events-none z-15 hidden lg:block overflow-visible">
                        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                                <linearGradient id="tacticalLinkGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.9" />
                                    <stop offset="60%" stopColor="#8b5cf6" stopOpacity="0.6" />
                                    <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.15" />
                                </linearGradient>
                            </defs>
                            {/* Animated telemetry connection line from preview card to 9 o'clock active planet */}
                            <line
                                x1="38%"
                                y1="50%"
                                x2="66%"
                                y2="50%"
                                stroke="url(#tacticalLinkGrad)"
                                strokeWidth="1.5"
                                strokeDasharray="4 4"
                                className="animate-pulse"
                            />
                            {/* Contact reticle ring */}
                            <circle cx="52%" cy="50%" r="3.5" fill="#06b6d4" className="animate-ping" />
                            <circle cx="52%" cy="50%" r="2" fill="#06b6d4" />
                            {/* In-line telemetry label */}
                            <text
                                x="52%"
                                y="47%"
                                fill="#06b6d4"
                                fontSize="9"
                                fontFamily="monospace"
                                textAnchor="middle"
                                className="opacity-80 tracking-widest uppercase font-semibold"
                            >
                                LOCK: SYS.0{activeProject.id} // 180° AZ
                            </text>
                        </svg>
                    </div>

                    {/* Floating Holographic Tactical Observatory Terminal (Preview Card) */}
                    <div className="hidden sm:block absolute left-2 sm:left-4 md:left-6 lg:left-[-40px] xl:left-[-70px] top-1/2 -translate-y-1/2 w-full max-w-[340px] sm:max-w-[380px] md:max-w-[420px] lg:max-w-[500px] xl:max-w-[580px] aspect-video z-20 pointer-events-auto">
                        <div className="relative group select-none transition-all duration-300 h-full">

                            {/* Ambient Backlight Glow matching active project */}
                            <div className={`absolute -inset-4 sm:-inset-6 rounded-3xl bg-gradient-to-r ${activeProject.color} opacity-20 dark:opacity-35 blur-2xl transition-all duration-700 pointer-events-none`} />

                            {/* Tactical Chassis Frame */}
                            <div className="relative h-full flex flex-col justify-between rounded-2xl md:rounded-3xl border border-cyan-500/40 dark:border-cyan-400/35 bg-white/95 dark:bg-[#0b0e1a]/95 backdrop-blur-2xl p-2 sm:p-2.5 md:p-3 shadow-[0_20px_50px_rgba(0,0,0,0.15)] dark:shadow-[0_25px_65px_rgba(0,0,0,0.85)] ring-1 ring-cyan-500/20 overflow-hidden">

                                {/* 4 Corner Cybernetic Reticle Brackets */}
                                <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-cyan-400 pointer-events-none" />
                                <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-cyan-400 pointer-events-none" />
                                <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-cyan-400 pointer-events-none" />
                                <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-cyan-400 pointer-events-none" />

                                {/* Top Tactical Header Bar */}
                                <div className="flex items-center justify-between gap-2 px-1 sm:px-2 pb-1 sm:pb-1.5 border-b border-gray-200/80 dark:border-white/10">
                                    <div className="flex items-center gap-1.5 min-w-0">
                                        <div className="flex items-center gap-1">
                                            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                        </div>
                                        <div className="flex items-center gap-1 font-mono text-[10px] sm:text-xs font-semibold text-gray-700 dark:text-gray-200 truncate">
                                            <span className="text-nebula-purple dark:text-starlight-cyan whitespace-nowrap">OBSERVATORY</span>
                                            <span className="text-gray-400 dark:text-gray-500">//</span>
                                            <span className="truncate">FEED.0{activeProject.id} {activeProject.title}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 sm:gap-2.5 font-mono text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 shrink-0">
                                        {/* Telemetry Signal Bars */}
                                        <div className="flex items-end gap-0.5 h-2.5 sm:h-3" title="Signal Integrity: 99.4%">
                                            <span className="w-0.5 sm:w-1 h-1 sm:h-1.5 rounded-sm bg-cyan-400" />
                                            <span className="w-0.5 sm:w-1 h-1.5 sm:h-2 rounded-sm bg-cyan-400" />
                                            <span className="w-0.5 sm:w-1 h-2 sm:h-2.5 rounded-sm bg-cyan-400" />
                                            <span className="w-0.5 sm:w-1 h-2.5 sm:h-3 rounded-sm bg-cyan-400 animate-pulse" />
                                        </div>
                                        <span className="hidden sm:inline text-[10px] text-gray-400 font-mono">SIG: 99.4%</span>
                                        <span className="text-[10px] font-mono px-1.5 sm:px-2 py-0.5 rounded-full bg-cyan-400/10 border border-cyan-400/30 text-cyan-300 font-semibold">
                                            LOCKED
                                        </span>
                                    </div>
                                </div>

                                {/* Viewport Screen */}
                                <div className="relative flex-1 rounded-xl sm:rounded-2xl overflow-hidden bg-black/90 my-1">
                                    {projects.map((project, index) => (
                                        <div
                                            key={project.id}
                                            className={`absolute inset-0 transition-all duration-700 ease-out ${
                                                index === activeIndex
                                                    ? 'opacity-100 scale-100 translate-x-0'
                                                    : 'opacity-0 scale-95 translate-x-8 pointer-events-none'
                                            }`}
                                        >
                                            <img
                                                src={project.image}
                                                alt={project.title}
                                                className="w-full h-full object-cover opacity-90 dark:opacity-85 group-hover:scale-105 transition-transform duration-700"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
                                        </div>
                                    ))}

                                    {/* CRT Scanline Overlay */}
                                    <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.35)_50%)] bg-[length:100%_4px] opacity-40 dark:opacity-55" />

                                    {/* Center Crosshair Target Reticle */}
                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                        <div className="relative flex items-center justify-center w-12 h-12">
                                            <Crosshair className="w-7 h-7 text-cyan-400/50 group-hover:text-cyan-400 group-hover:scale-110 transition-all duration-300" />
                                            <div className="absolute inset-0 rounded-full border border-dashed border-cyan-400/30 animate-[spin_20s_linear_infinite]" />
                                        </div>
                                    </div>

                                    {/* Viewport Corner Brackets */}
                                    <div className="absolute top-2 left-2 w-2.5 h-2.5 border-t border-l border-cyan-300/60 pointer-events-none" />
                                    <div className="absolute top-2 right-2 w-2.5 h-2.5 border-t border-r border-cyan-300/60 pointer-events-none" />
                                    <div className="absolute bottom-2 left-2 w-2.5 h-2.5 border-b border-l border-cyan-300/60 pointer-events-none" />
                                    <div className="absolute bottom-2 right-2 w-2.5 h-2.5 border-b border-r border-cyan-300/60 pointer-events-none" />

                                    {/* Bottom In-Screen Status Bar */}
                                    <div className="absolute bottom-1.5 left-1.5 right-1.5 flex items-center justify-between pointer-events-none px-2 py-0.5 rounded-lg bg-black/60 backdrop-blur-sm border border-white/10">
                                        <div className="flex items-center gap-1 font-mono text-[9px] sm:text-[10px] text-gray-300">
                                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                                            <span className="text-cyan-300 font-bold">{activeProject.role}</span>
                                        </div>
                                        <div className="font-mono text-[9px] sm:text-[10px] text-gray-400">
                                            {activeProject.finished_date ? `DATE: ${activeProject.finished_date}` : 'STATUS: DEPLOYED'}
                                        </div>
                                    </div>
                                </div>

                                {/* Bottom Frame Controls */}
                                <div className="flex items-center justify-between pt-1 px-1 text-[9px] sm:text-[10px] font-mono text-gray-500 dark:text-gray-400">
                                    <div className="flex items-center gap-1">
                                        <Radio className="w-3 h-3 text-cyan-400 animate-pulse" />
                                        <span className="hidden sm:inline">RADAR TELEMETRY // 180° AZ</span>
                                        <span className="sm:hidden">TELEMETRY</span>
                                    </div>

                                    <div className="flex items-center gap-1.5">
                                        {activeProject.web_url && (
                                            <button
                                                type="button"
                                                onClick={() => window.open(activeProject.web_url, '_blank')}
                                                className="flex items-center gap-1 px-2 py-0.5 rounded bg-cyan-500/15 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-400/30 transition-all cursor-pointer"
                                            >
                                                <ExternalLink className="w-2.5 h-2.5" />
                                                <span>Live Demo</span>
                                            </button>
                                        )}
                                        <button
                                            type="button"
                                            onClick={() => handleRepoClick(activeProject.repos)}
                                            className="flex items-center gap-1 px-2 py-0.5 rounded bg-black/10 dark:bg-white/5 hover:bg-white/10 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-white/15 transition-all cursor-pointer"
                                        >
                                            <Github className="w-2.5 h-2.5" />
                                            <span>Repo</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* The Orbit Track (Tactical Radar Observatory) */}
                    <div
                        ref={orbitRef}
                        className="absolute right-[-100px] sm:right-[-120px] md:right-[-140px] lg:right-[-320px] xl:right-[-420px] w-[260px] h-[260px] sm:w-[320px] sm:h-[320px] md:w-[420px] md:h-[420px] lg:w-[720px] lg:h-[720px] xl:w-[880px] xl:h-[880px] rounded-full border border-gray-200/80 dark:border-cyan-500/20 flex items-center justify-center transition-all duration-300 pointer-events-none"
                    >
                        {/* Rotary Radar Sweep Beam */}
                        <div
                            className="absolute inset-0 rounded-full pointer-events-none opacity-40 dark:opacity-60"
                            style={{
                                background: 'conic-gradient(from 0deg, rgba(6, 182, 212, 0.22) 0deg, rgba(6, 182, 212, 0) 55deg)',
                                animation: 'spin 10s linear infinite',
                            }}
                        />

                        {/* Concentric Dashed Compass Ring */}
                        <div className="absolute w-[82%] h-[82%] rounded-full border border-dashed border-gray-300/70 dark:border-white/10 animate-[spin_120s_linear_infinite]" />

                        {/* Inner Radar Range Ring */}
                        <div className="absolute w-[54%] h-[54%] rounded-full border border-cyan-500/20 dark:border-cyan-400/20 animate-[spin_60s_linear_infinite_reverse]" />

                        {/* Cardinal Coordinate Markings (Azimuth 0°, 90°, 180°, 270°) */}
                        <div className="absolute left-2 font-mono text-[9px] sm:text-[10px] text-cyan-400/80 tracking-tighter uppercase font-bold">
                            180° LOCK
                        </div>
                        <div className="absolute top-2 font-mono text-[9px] sm:text-[10px] text-gray-400 dark:text-gray-500">
                            090°
                        </div>
                        <div className="absolute right-2 font-mono text-[9px] sm:text-[10px] text-gray-400 dark:text-gray-500">
                            000°
                        </div>
                        <div className="absolute bottom-2 font-mono text-[9px] sm:text-[10px] text-gray-400 dark:text-gray-500">
                            270°
                        </div>

                        {/* Central Pulsar Observatory Core */}
                        <div className="relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-cyan-500/10 dark:bg-cyan-400/10 border border-cyan-400/40 backdrop-blur-sm flex flex-col items-center justify-center">
                            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-cyan-400 animate-ping opacity-60" />
                            <div className="absolute w-2 h-2 rounded-full bg-cyan-400" />
                            <span className="absolute -bottom-4 font-mono text-[8px] text-cyan-400/70 tracking-widest hidden md:inline">
                                OBS // CORE
                            </span>
                        </div>

                        {/* Planets (Tactical Nodes with Saturn 3D Rings & Atmospheric Halos) */}
                        {projects.map((project, index) => {
                            const isActive = index === activeIndex;
                            return (
                                <button
                                    key={project.id}
                                    type="button"
                                    onClick={() => scrollToProject(index)}
                                    className={`absolute w-8 h-8 sm:w-10 sm:h-10 md:w-13 md:h-13 lg:w-16 lg:h-16 rounded-full shadow-[0_0_30px_rgba(0,0,0,0.5)] transition-all duration-500 flex items-center justify-center pointer-events-auto cursor-pointer group focus:outline-none ${
                                        isActive ? 'scale-125 z-20' : 'scale-80 z-10 opacity-60 hover:opacity-100 hover:scale-95'
                                    }`}
                                    style={getPlanetStyle(index)}
                                    aria-label={`Target project 0${project.id}: ${project.title}`}
                                >
                                    {/* Saturn-Style 3D Orbital Ring */}
                                    <div
                                        className={`absolute -inset-2 sm:-inset-2.5 md:-inset-3 rounded-full border pointer-events-none transition-all duration-500 ${
                                            isActive
                                                ? 'border-cyan-400/70 shadow-[0_0_12px_rgba(6,182,212,0.6)]'
                                                : 'border-white/25 dark:border-white/10 group-hover:border-cyan-400/40'
                                        }`}
                                        style={{
                                            transform: 'rotateX(74deg) rotateY(-20deg)',
                                        }}
                                    />

                                    {/* Active Atmospheric Corona & Pulse Beacon */}
                                    {isActive && (
                                        <>
                                            <div className="absolute -inset-3 rounded-full bg-cyan-400/25 blur-md animate-pulse pointer-events-none" />
                                            <div className="absolute -inset-2 rounded-full border border-cyan-400/60 animate-ping opacity-40 pointer-events-none" />
                                            <div className="absolute -inset-3.5 rounded-full border border-dashed border-cyan-400/70 animate-[spin_12s_linear_infinite] pointer-events-none" />
                                        </>
                                    )}

                                    {/* Planet Sphere Visual (Gradient) */}
                                    <div className={`w-full h-full rounded-full bg-gradient-to-br ${project.color} relative overflow-hidden shadow-inner ring-1 ${isActive ? 'ring-white/90 ring-offset-2 ring-offset-black' : 'ring-white/20'}`}>
                                        <div className="absolute inset-0 bg-white/30 rounded-full blur-sm opacity-50" />
                                        <div className="absolute -inset-1 bg-gradient-to-tr from-transparent to-white/40 opacity-0 group-hover:opacity-100 transition-opacity" />

                                        {/* Centered Node Number */}
                                        <div className="absolute inset-0 flex items-center justify-center font-mono text-[9px] sm:text-[10px] md:text-xs font-bold text-white drop-shadow-md">
                                            0{project.id}
                                        </div>
                                    </div>

                                    {/* Planet Label Tooltip */}
                                    <div className={`absolute -bottom-7 font-mono text-[10px] sm:text-[11px] whitespace-nowrap px-2 py-0.5 rounded-full bg-black/85 backdrop-blur-md border border-cyan-400/40 text-cyan-300 shadow-md transition-all pointer-events-none ${
                                        isActive
                                            ? 'opacity-100 translate-y-0'
                                            : 'opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0'
                                    }`}>
                                        {project.title}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>

            </div>

            {/* Scroll Progress Indicator */}
            <div className="absolute bottom-10 right-6 sm:right-10 flex flex-col gap-2 z-20">
                {projects.map((_, idx) => (
                    <button
                        key={idx}
                        type="button"
                        onClick={() => scrollToProject(idx)}
                        className={`w-2 h-2 rounded-full transition-all duration-300 cursor-pointer ${
                            idx === activeIndex
                                ? 'bg-starlight-cyan scale-150 shadow-[0_0_8px_rgba(6,182,212,0.8)]'
                                : 'bg-gray-300 dark:bg-white/20 hover:bg-gray-400 dark:hover:bg-white/40'
                        }`}
                        aria-label={`Scroll indicator project ${idx + 1}`}
                    />
                ))}
            </div>

            {/* Repo Modal */}
            {showRepoModal && selectedRepos && Array.isArray(selectedRepos) && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
                    <div className="sci-fi-glass rounded-2xl p-6 max-w-sm w-full relative">
                        <button
                            onClick={() => setShowRepoModal(false)}
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white transition-colors cursor-pointer"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="flex items-center gap-2 mb-4">
                            <span className="w-2 h-2 rounded-full bg-starlight-cyan animate-ping" />
                            <h3 className="text-xl font-bold sci-fi-heading">Select Repository</h3>
                        </div>

                        <div className="space-y-3">
                            <a
                                href={selectedRepos[0]}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between p-4 rounded-xl sci-fi-card group"
                            >
                                <span className="font-medium text-gray-800 dark:text-gray-200 group-hover:text-nebula-purple dark:group-hover:text-starlight-cyan transition-colors">Frontend Repository</span>
                                <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-nebula-purple dark:group-hover:text-starlight-cyan transition-colors" />
                            </a>

                            <a
                                href={selectedRepos[1]}
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
