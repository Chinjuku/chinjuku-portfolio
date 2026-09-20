import React, { useState, useMemo, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { all_projects } from '../data/projects';
import {
    ArrowLeft,
    ExternalLink,
    Github,
    X,
    Sparkles,
    Calendar,
    Layers,
    FolderGit2,
    CheckCircle2,
    ChevronDown,
} from 'lucide-react';
import { Link } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

const AllProjects: React.FC = () => {
    const [showRepoModal, setShowRepoModal] = useState(false);
    const [selectedRepo, setSelectedRepo] = useState<string | string[] | null>(null);
    const [selectedYear, setSelectedYear] = useState<string>('All');

    const introStageRef = useRef<HTMLDivElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);
    const lensRingRef = useRef<HTMLDivElement>(null);
    const hudCueRef = useRef<HTMLDivElement>(null);
    const allContentRef = useRef<HTMLDivElement>(null);
    const projectsGridRef = useRef<HTMLDivElement>(null);

    // Get unique years sorted descending, ensuring 2026 is included
    const years = useMemo(() => {
        const yearSet = new Set(all_projects.map((p) => new Date(p.finished_date).getFullYear()));
        yearSet.add(2026);
        return Array.from(yearSet).sort((a, b) => b - a);
    }, []);

    // Compute Project Summary by Year telemetry statistics
    const yearStats = useMemo(() => {
        const stats: Record<
            number,
            { count: number; techs: Set<string>; liveCount: number; repoCount: number }
        > = {};

        // Pre-seed all years including 2026
        years.forEach((y) => {
            stats[y] = { count: 0, techs: new Set(), liveCount: 0, repoCount: 0 };
        });

        all_projects.forEach((p) => {
            const year = new Date(p.finished_date).getFullYear();
            if (!stats[year]) {
                stats[year] = { count: 0, techs: new Set(), liveCount: 0, repoCount: 0 };
            }
            stats[year].count += 1;
            p.tech.forEach((t) => stats[year].techs.add(t));
            if (p.web_url) stats[year].liveCount += 1;
            if (Array.isArray(p.repos)) {
                stats[year].repoCount += p.repos.length;
            } else if (p.repos) {
                stats[year].repoCount += 1;
            }
        });

        return Object.entries(stats)
            .map(([yearStr, data]) => ({
                year: parseInt(yearStr),
                count: data.count,
                techs: data.count === 0 ? ['Active', 'In Progress'] : Array.from(data.techs),
                liveCount: data.liveCount,
                repoCount: data.repoCount,
            }))
            .sort((a, b) => b.year - a.year);
    }, [years]);

    // Filter and sort projects
    const filteredProjects = useMemo(() => {
        return all_projects
            .filter(
                (project) =>
                    selectedYear === 'All' ||
                    new Date(project.finished_date).getFullYear().toString() === selectedYear
            )
            .sort(
                (a, b) =>
                    new Date(b.finished_date).getTime() - new Date(a.finished_date).getTime()
            );
    }, [selectedYear]);

    // Handle Year Card selection: update filter and scroll to projects grid
    const handleYearCardClick = (year: string) => {
        setSelectedYear(year);
        if (projectsGridRef.current) {
            projectsGridRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    const handleRepoClick = (repos: string | string[]) => {
        if (Array.isArray(repos)) {
            setSelectedRepo(repos);
            setShowRepoModal(true);
        } else {
            window.open(repos, '_blank');
        }
    };

    // Stage 1: The "Lens Flare" Spotlight Mask Scroll Sequence at the very top ("scroll แรกสุด")
    useEffect(() => {
        const ctx = gsap.context(() => {
            const maskData = { r: 0 };

            gsap.to(maskData, {
                r: 150,
                ease: 'none',
                scrollTrigger: {
                    trigger: introStageRef.current,
                    start: 'top top',
                    end: '+=600',
                    pin: true,
                    scrub: 0.5,
                    onUpdate: (self) => {
                        const r = self.progress * 150;

                        if (overlayRef.current) {
                            if (r >= 145) {
                                overlayRef.current.style.opacity = '0';
                                overlayRef.current.style.visibility = 'hidden';
                                overlayRef.current.style.pointerEvents = 'none';
                            } else {
                                overlayRef.current.style.opacity = '1';
                                overlayRef.current.style.visibility = 'visible';
                                overlayRef.current.style.maskImage = `radial-gradient(circle at 50% 50%, transparent ${r}%, black calc(${r}% + 1px))`;
                                overlayRef.current.style.webkitMaskImage = `radial-gradient(circle at 50% 50%, transparent ${r}%, black calc(${r}% + 1px))`;
                            }
                        }

                        if (lensRingRef.current) {
                            if (r <= 0.5 || r >= 142) {
                                lensRingRef.current.style.opacity = '0';
                            } else {
                                lensRingRef.current.style.width = `${r * 2.2}vmax`;
                                lensRingRef.current.style.height = `${r * 2.2}vmax`;
                                const ringOpacity =
                                    r > 80 ? Math.max(0, 1 - (r - 80) / 35) : Math.min(1, r / 12);
                                lensRingRef.current.style.opacity = `${ringOpacity}`;
                            }
                        }

                        if (hudCueRef.current) {
                            const textOpacity = Math.max(0, 1 - self.progress * 3.5);
                            hudCueRef.current.style.opacity = `${textOpacity}`;
                            hudCueRef.current.style.pointerEvents = textOpacity > 0.05 ? 'auto' : 'none';
                        }
                    },
                },
            });
        }, introStageRef);

        return () => ctx.revert();
    }, []);

    // Refresh ScrollTrigger when filtered project list length changes
    useEffect(() => {
        ScrollTrigger.refresh();
    }, [filteredProjects]);

    // Quick skip helper to jump past the initial spotlight stage directly into AllProject content
    const bypassSpotlight = () => {
        if (allContentRef.current) {
            allContentRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <div className="relative w-full min-h-screen bg-space-white dark:bg-space-black text-slate-900 dark:text-white transition-colors duration-300">
            {/* Ambient Background Glow for Light and Dark Modes */}
            <div className="fixed inset-0 pointer-events-none z-0 opacity-40 dark:opacity-25 bg-[radial-gradient(circle_at_top,_rgba(124,58,237,0.12),_transparent_55%),radial-gradient(circle_at_bottom_right,_rgba(6,182,212,0.1),_transparent_50%)]" />

            {/* ============================================================ */}
            {/* 1. INITIAL SCROLL STAGE ("scroll แรกสุด")                      */}
            {/* ============================================================ */}
            <div
                ref={introStageRef}
                className="h-screen w-full relative overflow-hidden bg-space-white dark:bg-space-black flex flex-col items-center justify-center select-none transition-colors duration-300"
            >
                {/* Subtle Cyber Matrix Grid Background */}
                <div className="absolute inset-0 bg-[radial-gradient(#94a3b8_1px,transparent_1px)] dark:bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-40 dark:opacity-60" />

                {/* 1. Solid Pure Dark Overlay with Expanding Circular Mask */}
                <div
                    ref={overlayRef}
                    className="absolute inset-0 z-30 bg-[#07070A] dark:bg-black transition-opacity duration-150"
                    style={{
                        maskImage: 'radial-gradient(circle at 50% 50%, transparent 0%, black 1px)',
                        WebkitMaskImage: 'radial-gradient(circle at 50% 50%, transparent 0%, black 1px)',
                    }}
                />

                {/* 2. Luminous Cyan / Purple Lens Flare Ring (Light Theme & Dark Theme Adaptive) */}
                <div
                    ref={lensRingRef}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-30 rounded-full border border-nebula-purple/90 dark:border-starlight-cyan/85 shadow-[0_0_50px_10px_rgba(124,58,237,0.45),inset_0_0_30px_5px_rgba(6,182,212,0.35)] dark:shadow-[0_0_50px_10px_rgba(6,182,212,0.8),inset_0_0_30px_5px_rgba(124,58,237,0.5)] transition-opacity duration-150"
                    style={{
                        width: '0vmax',
                        height: '0vmax',
                        opacity: 0,
                    }}
                />

                {/* 3. Text to Scroll - Positioned in the Middle of the Monitor */}
                <div
                    ref={hudCueRef}
                    className="absolute inset-0 z-40 flex flex-col items-center justify-center pointer-events-none select-none px-4 text-center"
                >
                    {/* Glowing Cyber Glyph */}
                    <div className="w-16 h-16 rounded-full bg-space-dark/90 border border-starlight-cyan/60 shadow-[0_0_30px_rgba(6,182,212,0.5)] flex items-center justify-center mb-5">
                        <Sparkles className="w-7 h-7 text-starlight-cyan animate-pulse" />
                    </div>

                    {/* Primary Text in Middle of Monitor */}
                    <h2 className="text-2xl sm:text-3xl md:text-5xl font-mono font-black tracking-widest text-white uppercase mb-3 drop-shadow-[0_2px_16px_rgba(0,0,0,0.95)]">
                        SCROLL TO REVEAL ARCHIVES
                    </h2>

                    {/* Subtext */}
                    <p className="text-xs sm:text-sm font-mono text-starlight-cyan tracking-wider uppercase mb-7 drop-shadow-md">
                        // Expanding Spotlight Aperture //
                    </p>

                    {/* Animated Mouse Scroll Indicator */}
                    <div className="flex flex-col items-center gap-2 text-gray-400">
                        <div className="w-5 h-9 rounded-full border-2 border-starlight-cyan/70 flex items-start justify-center p-1 shadow-[0_0_15px_rgba(6,182,212,0.4)]">
                            <div className="w-1.5 h-2 rounded-full bg-starlight-cyan animate-bounce" />
                        </div>
                        <span className="text-[10px] font-mono tracking-widest text-gray-400 uppercase">
                            SCROLL DOWN
                        </span>
                    </div>

                    {/* Quick Access Skip Button */}
                    <div className="mt-8 pointer-events-auto">
                        <button
                            onClick={bypassSpotlight}
                            className="px-4 py-1.5 rounded-full text-xs font-mono bg-white/10 hover:bg-white/20 text-gray-200 hover:text-white border border-white/20 backdrop-blur-md transition-all cursor-pointer"
                        >
                            Skip to All Projects ↓
                        </button>
                    </div>
                </div>

                {/* 4. Inside the Spotlight (Revealed in Stage 1 as aperture expands - Fully Light & Dark Adaptive) */}
                <div className="container mx-auto px-6 max-w-4xl text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-nebula-purple/10 dark:bg-starlight-cyan/10 border border-nebula-purple/30 dark:border-starlight-cyan/30 text-xs font-mono text-nebula-purple dark:text-starlight-cyan uppercase tracking-widest mb-4">
                        <Sparkles className="w-3.5 h-3.5 animate-spin" />
                        <span>SECURITY CLEARANCE GRANTED // PROTOCOL 07</span>
                    </div>
                    <h1 className="text-3xl sm:text-5xl md:text-6xl font-black sci-fi-heading mb-4 tracking-tight">
                        CENTRAL ARCHIVES
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base max-w-xl mx-auto leading-relaxed mb-6 font-mono">
                        // Decrypting classified backlog of engineering operations and deployments...
                    </p>

                    {/* Telemetry Status Readout Box */}
                    <div className="inline-flex items-center gap-4 sm:gap-6 bg-white/80 dark:bg-white/5 border border-gray-200/80 dark:border-white/10 px-6 py-3.5 rounded-2xl backdrop-blur-md shadow-lg shadow-gray-200/50 dark:shadow-none">
                        <div>
                            <span className="text-[10px] font-mono text-gray-500 dark:text-gray-400 uppercase block">Operations</span>
                            <span className="text-lg font-black text-slate-900 dark:text-white font-mono">{all_projects.length} Logged</span>
                        </div>
                        <div className="w-px h-8 bg-gray-200 dark:bg-white/10" />
                        <div>
                            <span className="text-[10px] font-mono text-gray-500 dark:text-gray-400 uppercase block">Timeline</span>
                            <span className="text-lg font-black text-nebula-purple dark:text-starlight-cyan font-mono">
                                {years[years.length - 1]} - {years[0]}
                            </span>
                        </div>
                        <div className="w-px h-8 bg-gray-200 dark:bg-white/10" />
                        <div>
                            <span className="text-[10px] font-mono text-gray-500 dark:text-gray-400 uppercase block">Aperture</span>
                            <span className="text-lg font-black text-nebula-purple dark:text-nebula-glow font-mono font-bold">100% Online</span>
                        </div>
                    </div>

                    <div className="flex items-center justify-center gap-2 text-xs font-mono text-nebula-purple dark:text-starlight-cyan mt-8 animate-bounce">
                        <span>Continue scrolling to access full catalog</span>
                        <ChevronDown className="w-4 h-4" />
                    </div>
                </div>
            </div>

            {/* ============================================================ */}
            {/* 2. ALL PROJECT CONTENT ("จากนั้นค่อย show content AllProject") */}
            {/* ============================================================ */}
            <div ref={allContentRef} className="container mx-auto px-6 py-20 max-w-7xl relative z-10">
                {/* Header Navigation & Title */}
                <div className="mb-10 sm:mb-12">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 text-nebula-purple dark:text-starlight-cyan hover:underline mb-4 sm:mb-6 font-mono text-xs sm:text-sm uppercase tracking-wider group"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        <span>Return to Mission Control</span>
                    </Link>

                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-nebula-purple/10 dark:bg-starlight-cyan/10 border border-nebula-purple/30 dark:border-starlight-cyan/30 text-xs font-mono text-nebula-purple dark:text-starlight-cyan uppercase tracking-widest mb-2.5">
                                <Sparkles className="w-3.5 h-3.5" />
                                <span>CENTRAL LOGS // CLASSIFIED OPERATIONS</span>
                            </div>
                            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black sci-fi-heading mb-3 tracking-tight">
                                Project Archives
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base max-w-2xl leading-relaxed">
                                Comprehensive catalog of production deployments, architectural prototypes, and engineering systems.
                            </p>
                        </div>

                        {/* Aggregate Quick Stats Badge */}
                        <div className="flex items-center gap-4 bg-white/70 dark:bg-white/5 border border-gray-200/80 dark:border-white/10 px-5 py-3 rounded-2xl backdrop-blur-md shadow-sm self-start md:self-auto">
                            <div>
                                <span className="text-[11px] font-mono text-gray-500 dark:text-gray-400 uppercase block">Total Operations</span>
                                <span className="text-lg sm:text-xl font-black text-slate-900 dark:text-white font-mono">{all_projects.length}</span>
                            </div>
                            <div className="w-px h-8 bg-gray-200 dark:bg-white/10" />
                            <div>
                                <span className="text-[11px] font-mono text-gray-500 dark:text-gray-400 uppercase block">Timeline Span</span>
                                <span className="text-lg sm:text-xl font-black text-nebula-purple dark:text-starlight-cyan font-mono">
                                    {years[years.length - 1]} - {years[0]}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Project Summary by Year Cards */}
                <div className="mb-10 sm:mb-12">
                    <div className="flex items-center justify-between mb-3.5">
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-nebula-purple dark:text-starlight-cyan" />
                            <span className="sci-fi-subheading">Yearly Telemetry Summary</span>
                        </div>
                        <span className="text-xs font-mono text-gray-500 dark:text-gray-400 hidden sm:inline-block">
                            Click a card to filter and view projects
                        </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
                        {/* All Years Aggregate Card */}
                        <div
                            onClick={() => handleYearCardClick('All')}
                            className={`p-4 sm:p-5 rounded-2xl sci-fi-card cursor-pointer transition-all duration-300 relative group overflow-hidden ${
                                selectedYear === 'All'
                                    ? '!border-nebula-purple dark:!border-starlight-cyan ring-1 ring-nebula-purple/50 dark:ring-starlight-cyan/50 shadow-[0_0_25px_rgba(124,58,237,0.2)] scale-[1.02]'
                                    : 'hover:scale-[1.02]'
                            }`}
                        >
                            <div className="flex items-center justify-between mb-2 sm:mb-3">
                                <span className="px-2 py-0.5 rounded-full text-[11px] sm:text-xs font-mono font-bold bg-nebula-purple/15 text-nebula-purple dark:bg-starlight-cyan/15 dark:text-starlight-cyan">
                                    ALL YEARS
                                </span>
                                <Layers className="w-4 h-4 text-gray-400 group-hover:text-nebula-purple dark:group-hover:text-starlight-cyan transition-colors" />
                            </div>

                            <div className="mb-2">
                                <div className="text-2xl sm:text-3xl font-black sci-fi-heading font-mono">
                                    {all_projects.length}{' '}
                                    <span className="text-xs font-normal text-gray-500 dark:text-gray-400 font-sans">
                                        Projects
                                    </span>
                                </div>
                                <p className="text-[11px] sm:text-xs text-gray-600 dark:text-gray-400 mt-0.5 line-clamp-1">
                                    Complete historical backlog
                                </p>
                            </div>

                            <div className="pt-2 border-t border-gray-100 dark:border-white/5 flex items-center justify-between text-[10px] sm:text-[11px] font-mono text-gray-500 dark:text-gray-400">
                                <span>Active Years</span>
                                <span className="font-semibold text-gray-800 dark:text-gray-200">
                                    {years.length} Milestones
                                </span>
                            </div>
                        </div>

                        {/* Specific Year Summary Cards */}
                        {yearStats.map((stat) => {
                            const isSelected = selectedYear === stat.year.toString();
                            return (
                                <div
                                    key={stat.year}
                                    onClick={() => handleYearCardClick(stat.year.toString())}
                                    className={`p-4 sm:p-5 rounded-2xl sci-fi-card cursor-pointer transition-all duration-300 relative group overflow-hidden ${
                                        isSelected
                                            ? '!border-nebula-purple dark:!border-starlight-cyan ring-1 ring-nebula-purple/50 dark:ring-starlight-cyan/50 shadow-[0_0_25px_rgba(6,182,212,0.2)] scale-[1.02]'
                                            : 'hover:scale-[1.02]'
                                    }`}
                                >
                                    <div className="flex items-center justify-between mb-2 sm:mb-3">
                                        <span className="px-2 py-0.5 rounded-full text-[11px] sm:text-xs font-mono font-bold bg-gray-100 dark:bg-white/10 text-gray-800 dark:text-gray-200 group-hover:bg-nebula-purple/15 group-hover:text-nebula-purple dark:group-hover:text-starlight-cyan transition-colors">
                                            {stat.year}
                                        </span>
                                        {isSelected ? (
                                            <CheckCircle2 className="w-4 h-4 text-nebula-purple dark:text-starlight-cyan" />
                                        ) : (
                                            <FolderGit2 className="w-4 h-4 text-gray-400 group-hover:text-starlight-blue transition-colors" />
                                        )}
                                    </div>

                                    <div className="mb-2">
                                        <div className="text-2xl sm:text-3xl font-black sci-fi-heading font-mono">
                                            {stat.count}{' '}
                                            <span className="text-xs font-normal text-gray-500 dark:text-gray-400 font-sans">
                                                {stat.count === 1 ? 'Project' : 'Projects'}
                                            </span>
                                        </div>
                                        <div className="flex flex-wrap gap-1 mt-1.5">
                                            {stat.techs.slice(0, 3).map((tech, idx) => (
                                                <span
                                                    key={idx}
                                                    className="text-[9px] sm:text-[10px] font-mono px-1.5 py-0.5 rounded bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-300"
                                                >
                                                    {tech}
                                                </span>
                                            ))}
                                            {stat.techs.length > 3 && (
                                                <span className="text-[9px] font-mono text-gray-400 self-center">
                                                    +{stat.techs.length - 3}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="pt-2 border-t border-gray-100 dark:border-white/5 flex items-center justify-between text-[10px] sm:text-[11px] font-mono text-gray-500 dark:text-gray-400">
                                        <span>Repositories</span>
                                        <span className="font-semibold text-gray-800 dark:text-gray-200">
                                            {stat.repoCount} Repos
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Filter by Year Pills */}
                <div ref={projectsGridRef} className="flex items-center justify-between mb-8 flex-wrap gap-4 pt-4 border-t border-gray-200/80 dark:border-white/10">
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-mono text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Filter by Year:
                        </span>
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => setSelectedYear('All')}
                                className={`px-4 py-1.5 rounded-full text-xs font-mono font-semibold transition-all duration-300 cursor-pointer ${
                                    selectedYear === 'All'
                                        ? 'bg-gradient-to-r from-nebula-purple to-starlight-blue text-white shadow-md shadow-nebula-purple/30'
                                        : 'sci-fi-card text-gray-700 dark:text-gray-300 hover:text-nebula-purple dark:hover:text-starlight-cyan hover:border-nebula-purple/40 dark:hover:border-starlight-cyan/40'
                                }`}
                            >
                                All ({all_projects.length})
                            </button>
                            {years.map((year) => {
                                const count = all_projects.filter(
                                    (p) => new Date(p.finished_date).getFullYear() === year
                                ).length;
                                return (
                                    <button
                                        key={year}
                                        onClick={() => setSelectedYear(year.toString())}
                                        className={`px-4 py-1.5 rounded-full text-xs font-mono font-semibold transition-all duration-300 cursor-pointer ${
                                            selectedYear === year.toString()
                                                ? 'bg-gradient-to-r from-nebula-purple to-starlight-blue text-white shadow-md shadow-nebula-purple/30'
                                                : 'sci-fi-card text-gray-700 dark:text-gray-300 hover:text-nebula-purple dark:hover:text-starlight-cyan hover:border-nebula-purple/40 dark:hover:border-starlight-cyan/40'
                                        }`}
                                    >
                                        {year} ({count})
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <span className="text-xs font-mono text-gray-500 dark:text-gray-400">
                        Showing <span className="text-gray-900 dark:text-white font-bold">{filteredProjects.length}</span> of {all_projects.length} operations
                    </span>
                </div>

                {/* Projects Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredProjects.map((project) => (
                        <div
                            key={project.id}
                            className="group relative sci-fi-card rounded-2xl overflow-hidden hover:-translate-y-1.5 transition-all duration-300 flex flex-col hover:shadow-xl hover:shadow-gray-200/60 dark:hover:shadow-[0_10px_30px_rgba(124,58,237,0.15)]"
                        >
                            {/* Thumbnail Image */}
                            <div className="h-52 overflow-hidden relative">
                                <img
                                    src={project.image}
                                    alt={project.title}
                                    loading="lazy"
                                    decoding="async"
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-space-black/85 via-space-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />

                                {/* Role Tag on Image */}
                                <div className="absolute top-3 left-3">
                                    <span className="sci-fi-badge !bg-black/60 !backdrop-blur-md !text-white !border-white/20">
                                        {project.role}
                                    </span>
                                </div>
                            </div>

                            {/* Content Details */}
                            <div className="p-6 flex-1 flex flex-col">
                                <div className="flex justify-between items-start mb-3">
                                    <h3 className="text-xl font-bold sci-fi-heading group-hover:text-nebula-purple dark:group-hover:text-starlight-cyan transition-colors">
                                        {project.title}
                                    </h3>
                                    <span className="text-xs font-mono text-gray-500 dark:text-gray-400 bg-station-light dark:bg-white/5 border border-station-gray dark:border-white/10 px-2.5 py-1 rounded-full whitespace-nowrap ml-2">
                                        {new Date(project.finished_date).toLocaleDateString('en-US', {
                                            month: 'short',
                                            year: 'numeric',
                                        })}
                                    </span>
                                </div>

                                <p className="text-gray-600 dark:text-gray-300 text-sm mb-6 line-clamp-3 leading-relaxed">
                                    {project.description}
                                </p>

                                {/* Tech Pills */}
                                <div className="flex flex-wrap gap-2 mb-6">
                                    {project.tech.map((t, i) => (
                                        <span key={i} className="sci-fi-badge">
                                            {t}
                                        </span>
                                    ))}
                                </div>

                                {/* Action Links */}
                                <div className="flex gap-4 mt-auto pt-4 border-t border-gray-100 dark:border-white/5">
                                    {project.web_url && (
                                        <button
                                            onClick={() => window.open(project.web_url, '_blank')}
                                            className="flex items-center gap-1.5 text-xs font-mono font-semibold text-gray-800 dark:text-white hover:text-nebula-purple dark:hover:text-starlight-cyan transition-colors cursor-pointer"
                                        >
                                            <ExternalLink className="w-4 h-4 text-nebula-purple dark:text-starlight-cyan" />
                                            Live Demo
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleRepoClick(project.repos)}
                                        className="flex items-center gap-1.5 text-xs font-mono font-semibold text-gray-800 dark:text-white hover:text-nebula-purple dark:hover:text-starlight-cyan transition-colors cursor-pointer"
                                    >
                                        <Github className="w-4 h-4" />
                                        Source Code
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Empty State */}
                {filteredProjects.length === 0 && (
                    <div className="text-center py-20 sci-fi-card rounded-2xl">
                        <Layers className="w-10 h-10 text-nebula-purple dark:text-starlight-cyan mx-auto mb-3 animate-pulse" />
                        <h3 className="text-lg font-bold sci-fi-heading mb-1">
                            {selectedYear === '2026' ? '2026 Operations In Progress' : 'No Projects Found'}
                        </h3>
                        <p className="text-sm text-gray-500 max-w-md mx-auto">
                            {selectedYear === '2026'
                                ? 'Classified engineering systems and deployments scheduled for 2026 are currently in active development.'
                                : 'No operations recorded for the selected filter.'}
                        </p>
                    </div>
                )}
            </div>

            {/* Repository Modal */}
            {showRepoModal && selectedRepo && Array.isArray(selectedRepo) && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
                    <div className="sci-fi-glass rounded-2xl p-6 max-w-sm w-full relative animate-in fade-in zoom-in-95 duration-200">
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
                                href={selectedRepo[0]}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between p-4 rounded-xl sci-fi-card group"
                            >
                                <span className="font-medium text-gray-800 dark:text-gray-200 group-hover:text-nebula-purple dark:group-hover:text-starlight-cyan transition-colors">
                                    Frontend Repository
                                </span>
                                <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-nebula-purple dark:group-hover:text-starlight-cyan transition-colors" />
                            </a>

                            <a
                                href={selectedRepo[1]}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between p-4 rounded-xl sci-fi-card group"
                            >
                                <span className="font-medium text-gray-800 dark:text-gray-200 group-hover:text-nebula-purple dark:group-hover:text-starlight-cyan transition-colors">
                                    Backend Repository
                                </span>
                                <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-nebula-purple dark:group-hover:text-starlight-cyan transition-colors" />
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AllProjects;
