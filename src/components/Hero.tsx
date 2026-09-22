import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ArrowRight, Download, Sparkles, Github, Linkedin, Mail } from 'lucide-react';
import profileTechImg from '../assets/profile.png';
import cosmicNebulaImg from '../assets/cosmic-nebula.jpg';
import { useNavClick } from '../utils';
import resumePdf from '../assets/resume.pdf';
import { chinjukuContact } from '../constants/contact';
import { useTheme } from '../context/ThemeContext';
import ForceFieldBackground from './hero/ForceFieldBackground';
import ForceFieldControls, { type ForceFieldParams, type ForceFieldStats } from './hero/ForceFieldControls';
import ProfileAura from './hero/ProfileAura';

const Hero: React.FC = () => {
    const componentRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLSpanElement>(null);
    const imageContainerRef = useRef<HTMLDivElement>(null);
    const portraitFrameRef = useRef<HTMLDivElement>(null);
    const handleNavClick = useNavClick();
    const { theme } = useTheme();

    // Responsive theme detection (Light vs Dark)
    const [isDark, setIsDark] = useState<boolean>(true);

    useEffect(() => {
        if (theme === 'system') {
            const media = window.matchMedia('(prefers-color-scheme: dark)');
            setIsDark(media.matches);
            const listener = (e: MediaQueryListEvent) => setIsDark(e.matches);
            media.addEventListener('change', listener);
            return () => media.removeEventListener('change', listener);
        } else {
            setIsDark(theme === 'dark');
        }
    }, [theme]);

    // Live FPS and dot count telemetry
    const [stats, setStats] = useState<ForceFieldStats>({
        fps: 60,
        pointCount: 0,
    });

    // Force Field Interactive Physics & Styling state (tuned with softer initial particle sizing)
    const [params, setParams] = useState<ForceFieldParams>({
        hue: 260, // Cosmic Nebula Violet
        saturation: 85,
        minStroke: 1.0,
        maxStroke: 4.2,
        spacing: 13,
        forceStrength: 12,
        magnifierRadius: 160
    });

    const randomize = () => {
        setParams({
            ...params,
            hue: Math.floor(Math.random() * 360),
            minStroke: parseFloat((Math.random() * 1.5 + 0.8).toFixed(1)),
            maxStroke: parseFloat((Math.random() * 3 + 3).toFixed(1)),
            spacing: Math.floor(Math.random() * 6 + 10),
            forceStrength: Math.floor(Math.random() * 16 + 8),
            magnifierRadius: Math.floor(Math.random() * 120 + 120)
        });
    };

    // Typing Effect & Entrance Animation
    useEffect(() => {
        const ctx = gsap.context(() => {
            // Entrance
            gsap.from(".hero-content > *", {
                y: 35,
                opacity: 0,
                duration: 0.9,
                stagger: 0.15,
                ease: "power3.out",
                delay: 0.25
            });

            gsap.from(".hero-image-container", {
                scale: 0.88,
                opacity: 0,
                duration: 1.3,
                ease: "elastic.out(1, 0.6)",
                delay: 0.2
            });

            // Typing Effect
            const roles = ["Fullstack Developer", "Backend Developer", "Software Developer"];
            let roleIndex = 0;
            let charIndex = 0;
            let isDeleting = false;
            let timer: ReturnType<typeof setTimeout>;

            const type = () => {
                const currentRole = roles[roleIndex];
                if (textRef.current) {
                    if (isDeleting) {
                        textRef.current.textContent = currentRole.substring(0, charIndex - 1);
                        charIndex--;
                    } else {
                        textRef.current.textContent = currentRole.substring(0, charIndex + 1);
                        charIndex++;
                    }
                }

                let typeSpeed = 90;
                if (isDeleting) typeSpeed /= 2;

                if (!isDeleting && charIndex === currentRole.length) {
                    isDeleting = true;
                    typeSpeed = 2000; // Pause at end
                } else if (isDeleting && charIndex === 0) {
                    isDeleting = false;
                    roleIndex = (roleIndex + 1) % roles.length;
                    typeSpeed = 450;
                }

                timer = setTimeout(type, typeSpeed);
            };

            timer = setTimeout(type, 1400);

            return () => clearTimeout(timer);
        }, componentRef);

        return () => ctx.revert();
    }, []);

    // Interactive 3D Holographic Mouse Tracking / Tilt effect on profile avatar
    useEffect(() => {
        const container = imageContainerRef.current;
        const heroSection = componentRef.current;
        const frame = portraitFrameRef.current;
        if (!container || !heroSection || !frame) return;

        // Respect prefers-reduced-motion
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        // High-performance GSAP quickTo interpolators for silky 60fps response
        const setRotateX = gsap.quickTo(frame, "rotationX", { duration: 0.6, ease: "power2.out" });
        const setRotateY = gsap.quickTo(frame, "rotationY", { duration: 0.6, ease: "power2.out" });
        const setFrameX = gsap.quickTo(frame, "x", { duration: 0.6, ease: "power2.out" });
        const setFrameY = gsap.quickTo(frame, "y", { duration: 0.6, ease: "power2.out" });

        // Multi-plane orbital rings counter-parallax
        const setRingsX = gsap.quickTo(".hero-orbit-ring", "x", { duration: 0.8, ease: "power2.out" });
        const setRingsY = gsap.quickTo(".hero-orbit-ring", "y", { duration: 0.8, ease: "power2.out" });

        // Floating status pill & HUD corner markers
        const setPillX = gsap.quickTo(".hero-status-pill", "x", { duration: 0.7, ease: "power2.out" });
        const setPillY = gsap.quickTo(".hero-status-pill", "y", { duration: 0.7, ease: "power2.out" });
        const setHudX = gsap.quickTo(".hero-hud-corner", "x", { duration: 0.65, ease: "power2.out" });
        const setHudY = gsap.quickTo(".hero-hud-corner", "y", { duration: 0.65, ease: "power2.out" });

        // Dynamic specular reflection shift
        const setSpecularX = gsap.quickTo(".hero-specular-light", "x", { duration: 0.5, ease: "power2.out" });
        const setSpecularY = gsap.quickTo(".hero-specular-light", "y", { duration: 0.5, ease: "power2.out" });

        const handleMouseMove = (e: MouseEvent) => {
            const rect = container.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            // Normalized distance (-1 to 1) from portrait center across viewport
            const deltaX = (e.clientX - centerX) / (window.innerWidth * 0.45);
            const deltaY = (e.clientY - centerY) / (window.innerHeight * 0.45);

            const clampedX = Math.max(-1, Math.min(1, deltaX));
            const clampedY = Math.max(-1, Math.min(1, deltaY));

            // Subtle angles: Max ~9 degrees rotation for natural high-tech look
            const rotY = clampedX * 9.5;
            const rotX = -clampedY * 9.5;

            setRotateY(rotY);
            setRotateX(rotX);
            setFrameX(clampedX * 10);
            setFrameY(clampedY * 10);

            // Counter-parallax on rings (gives genuine 3D holographic depth)
            setRingsX(-clampedX * 14);
            setRingsY(-clampedY * 14);

            // Subtle floating pill & HUD tracking
            setPillX(clampedX * 8);
            setPillY(clampedY * 8);
            setHudX(clampedX * 6);
            setHudY(clampedY * 6);

            // Dynamic specular highlight reflection
            setSpecularX(clampedX * 18);
            setSpecularY(clampedY * 18);
        };

        const handleMouseLeave = () => {
            gsap.to([frame, ".hero-orbit-ring", ".hero-status-pill", ".hero-hud-corner", ".hero-specular-light"], {
                rotationX: 0,
                rotationY: 0,
                x: 0,
                y: 0,
                duration: 1.2,
                ease: "elastic.out(1, 0.4)",
                overwrite: "auto",
            });
        };

        heroSection.addEventListener("mousemove", handleMouseMove);
        heroSection.addEventListener("mouseleave", handleMouseLeave);

        return () => {
            heroSection.removeEventListener("mousemove", handleMouseMove);
            heroSection.removeEventListener("mouseleave", handleMouseLeave);
        };
    }, []);

    return (
        <section
            ref={componentRef}
            className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-space-white dark:bg-space-black transition-colors duration-500 pt-24 pb-16 lg:py-0"
        >
            {/* Deep Space Cosmic Nebula Image Backdrop Layer */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none">
                <img
                    src={cosmicNebulaImg}
                    alt="Deep Space Cosmic Nebula"
                    className="w-full h-full object-cover opacity-15 dark:opacity-35 scale-105 filter brightness-105 dark:brightness-95 contrast-110 dark:contrast-125 transition-opacity duration-500"
                />
                {/* Space Vignette & Soft Gradient Masks */}
                <div className="absolute inset-0 bg-gradient-to-b from-space-white/90 dark:from-space-black/75 via-transparent to-space-white dark:to-space-black transition-colors duration-500" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(248,250,252,0.7)_70%,#F8FAFC_100%)] dark:bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(11,11,15,0.7)_70%,#0B0B0F_100%)] transition-colors duration-500" />
            </div>

            {/* 3D Force Field Interactive Canvas Layer (Comfortable Opacity) */}
            <div className="absolute inset-0 z-[1] pointer-events-auto opacity-70 dark:opacity-85">
                <ForceFieldBackground
                    imageUrl={cosmicNebulaImg}
                    hue={params.hue}
                    saturation={params.saturation}
                    minStroke={params.minStroke}
                    maxStroke={params.maxStroke}
                    spacing={params.spacing}
                    forceStrength={params.forceStrength}
                    magnifierRadius={params.magnifierRadius}
                    invertImage={false}
                    invertWireframe={true}
                    isDark={isDark}
                    onStatsUpdate={setStats}
                />
            </div>

            {/* Ambient Cosmic Radial Flares */}
            <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-nebula-purple/10 dark:bg-nebula-purple/20 rounded-full blur-[140px] pointer-events-none" />
            <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-starlight-cyan/10 dark:bg-starlight-cyan/15 rounded-full blur-[150px] pointer-events-none" />

            {/* Real-time Telemetry Badge (FPS & Dot Count) */}
            <div className="fixed top-20 right-5 sm:top-24 sm:right-8 z-30 pointer-events-none select-none">
                <div className="bg-white/85 dark:bg-space-black/75 backdrop-blur-md border border-slate-200/80 dark:border-white/10 px-3.5 py-1.5 rounded-full text-[11px] font-mono tracking-wider text-slate-700 dark:text-gray-300 shadow-md flex items-center gap-2.5">
                    <span className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="font-bold text-slate-900 dark:text-white">{stats.fps}</span> FPS
                    </span>
                    <span className="w-px h-3 bg-slate-300 dark:bg-white/15" />
                    <span className="flex items-center gap-1.5">
                        <span className="font-bold text-indigo-600 dark:text-starlight-cyan">{stats.pointCount.toLocaleString()}</span> DOTS
                    </span>
                </div>
            </div>

            {/* Foreground Content */}
            <div className="relative z-10 container mx-auto px-6 flex flex-col-reverse lg:flex-row items-center justify-between gap-12 lg:gap-16 pointer-events-none">

                {/* Left Column: Typography, Bio, CTA & Social Links */}
                <div className="hero-content relative flex-1 text-center lg:text-left pointer-events-auto max-w-2xl">
                    {/* Readability Gradient Backing Mask (creates a crystal-clear reading zone) */}
                    <div className="absolute -inset-6 sm:-inset-10 -z-10 rounded-3xl bg-gradient-to-r from-space-white/95 via-space-white/70 to-transparent dark:from-space-black/90 dark:via-space-black/55 dark:to-transparent backdrop-blur-[3px] pointer-events-none" />

                    {/* Mission Tagline Badge */}
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-space-black/65 backdrop-blur-xl border border-indigo-200/80 dark:border-starlight-cyan/35 text-indigo-700 dark:text-starlight-cyan text-xs font-mono tracking-widest uppercase shadow-sm dark:shadow-[0_0_20px_rgba(6,182,212,0.2)] mb-5">
                        <span className="w-2 h-2 rounded-full bg-indigo-600 dark:bg-starlight-cyan animate-ping" />
                        <Sparkles className="w-3.5 h-3.5 text-indigo-500 dark:text-nebula-glow" />
                        <span>Mission: Navigating the Digital Universe</span>
                    </div>

                    {/* Main Headline */}
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-4 leading-[1.15] text-slate-950 dark:text-white tracking-tight drop-shadow-sm dark:drop-shadow-[0_4px_24px_rgba(0,0,0,0.9)]">
                        I'm{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 via-purple-700 to-cyan-600 dark:from-starlight-cyan dark:via-starlight-blue dark:to-nebula-glow drop-shadow-[0_0_35px_rgba(139,92,246,0.35)]">
                            Chinatip Wu
                        </span>
                    </h1>

                    {/* Role & Animated Typing Effect */}
                    <div className="flex items-center justify-center lg:justify-start gap-2.5 text-base sm:text-xl font-mono mb-4 text-slate-800 dark:text-gray-100">
                        <span className="px-2.5 py-0.5 rounded-md bg-indigo-600/10 dark:bg-starlight-cyan/15 border border-indigo-600/30 dark:border-starlight-cyan/40 text-indigo-700 dark:text-starlight-cyan text-xs uppercase tracking-widest font-bold">
                            ROLE //
                        </span>
                        <span ref={textRef} className="text-indigo-700 dark:text-starlight-cyan font-bold border-r-2 border-indigo-600 dark:border-nebula-purple pr-1 min-h-[1.4em] inline-block"></span>
                    </div>

                    {/* Short Bio (Bridges Whitespace & Builds Clear Context) */}
                    <p className="text-slate-600 dark:text-gray-300 text-sm sm:text-base leading-relaxed mb-7 max-w-xl font-normal">
                        Fullstack engineer specialized in building resilient distributed systems, modern web architectures, and interactive digital experiences. Navigating from high-performance backend pipelines to immersive UI craft.
                    </p>

                    {/* Action CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
                        <button
                            onClick={() => handleNavClick('#experience')}
                            className="group relative px-7 py-3.5 bg-gradient-to-r from-indigo-600 via-nebula-purple to-nebula-glow hover:from-indigo-700 hover:to-starlight-blue text-white rounded-full font-semibold transition-all duration-300 flex items-center justify-center gap-2 overflow-hidden shadow-lg shadow-indigo-600/25 dark:shadow-nebula-purple/35 border border-white/20 cursor-pointer hover:scale-105"
                        >
                            <span className="relative z-10">View Experience Log</span>
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform relative z-10" />
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                        </button>

                        <button
                            onClick={() => window.open(resumePdf, '_blank')}
                            className="group px-7 py-3.5 border border-slate-300 dark:border-white/25 hover:border-indigo-600 dark:hover:border-starlight-cyan/70 text-slate-800 dark:text-white rounded-full font-medium transition-all duration-300 flex items-center justify-center gap-2 bg-white/90 dark:bg-space-black/40 hover:bg-slate-100 dark:hover:bg-white/10 backdrop-blur-xl cursor-pointer shadow-md shadow-slate-200/50 dark:shadow-space-black/50 hover:scale-105"
                        >
                            <span>Download Resume</span>
                            <Download className="w-4 h-4 group-hover:translate-y-1 transition-transform text-indigo-600 dark:text-starlight-cyan" />
                        </button>
                    </div>

                    {/* Social Connect & Availability Bar (Balances Layout) */}
                    <div className="pt-6 border-t border-slate-200/80 dark:border-white/10 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs font-mono text-slate-600 dark:text-gray-400">
                        <span className="uppercase tracking-wider font-semibold text-slate-400 dark:text-gray-500">CONNECT //</span>
                        <div className="flex items-center gap-2">
                            <a
                                href={chinjukuContact.github}
                                target="_blank"
                                rel="noreferrer"
                                className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/15 border border-slate-300/80 dark:border-white/15 text-slate-700 dark:text-white transition-all hover:scale-110 shadow-sm"
                                title="GitHub"
                            >
                                <Github className="w-4 h-4" />
                            </a>
                            <a
                                href={chinjukuContact.linkedin}
                                target="_blank"
                                rel="noreferrer"
                                className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/15 border border-slate-300/80 dark:border-white/15 text-slate-700 dark:text-white transition-all hover:scale-110 shadow-sm"
                                title="LinkedIn"
                            >
                                <Linkedin className="w-4 h-4 text-blue-600 dark:text-starlight-cyan" />
                            </a>
                            <a
                                href={`mailto:${chinjukuContact.gmail}`}
                                className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/15 border border-slate-300/80 dark:border-white/15 text-slate-700 dark:text-white transition-all hover:scale-110 shadow-sm"
                                title="Email"
                            >
                                <Mail className="w-4 h-4 text-purple-600 dark:text-nebula-glow" />
                            </a>
                        </div>
                        <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-slate-300/70 dark:border-white/10 text-[11px]">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-slate-700 dark:text-gray-300 font-medium">Available for missions</span>
                        </div>
                    </div>
                </div>

                {/* Right Column: Profile with Aura Dot Emitter & Cyber HUD */}
                <div
                    ref={imageContainerRef}
                    className="hero-image-container flex-1 flex justify-center items-center relative pointer-events-auto my-4 lg:my-0"
                    style={{ perspective: "1000px" }}
                >
                    {/* Radial Aura Dot Emitter (densely radiating outward from intense to faded) */}
                    <ProfileAura isDark={isDark} />

                    {/* Sci-Fi HUD Corner Target Markers */}
                    <div className="hero-hud-corner absolute -top-6 -left-6 w-4 h-4 border-t-2 border-l-2 border-indigo-600/50 dark:border-starlight-cyan/60 hidden sm:block z-10 will-change-transform" />
                    <div className="hero-hud-corner absolute -top-6 -right-6 w-4 h-4 border-t-2 border-r-2 border-indigo-600/50 dark:border-starlight-cyan/60 hidden sm:block z-10 will-change-transform" />
                    <div className="hero-hud-corner absolute -bottom-6 -left-6 w-4 h-4 border-b-2 border-l-2 border-indigo-600/50 dark:border-starlight-cyan/60 hidden sm:block z-10 will-change-transform" />
                    <div className="hero-hud-corner absolute -bottom-6 -right-6 w-4 h-4 border-b-2 border-r-2 border-indigo-600/50 dark:border-starlight-cyan/60 hidden sm:block z-10 will-change-transform" />

                    {/* Floating Status Pill */}
                    <div className="hero-status-pill absolute -bottom-4 z-20 px-3.5 py-1.5 rounded-full bg-white/95 dark:bg-space-black/85 backdrop-blur-xl border border-slate-200 dark:border-starlight-cyan/40 text-[11px] font-mono tracking-wider text-slate-800 dark:text-starlight-cyan shadow-lg shadow-black/10 dark:shadow-[0_0_20px_rgba(6,182,212,0.3)] flex items-center gap-2 will-change-transform">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span>STATUS: ONLINE // BANGKOK</span>
                    </div>

                    {/* Outer Orbital Rings with Starlight & Nebula accents */}
                    <div className="hero-orbit-ring absolute w-[280px] h-[280px] sm:w-[340px] sm:h-[340px] md:w-[420px] md:h-[420px] lg:w-[470px] lg:h-[470px] border border-indigo-500/20 dark:border-starlight-cyan/30 rounded-full animate-spin-slow shadow-[0_0_25px_rgba(6,182,212,0.15)] will-change-transform" />
                    <div
                        className="hero-orbit-ring absolute w-[260px] h-[260px] sm:w-[310px] sm:h-[310px] md:w-[390px] md:h-[390px] lg:w-[440px] lg:h-[440px] border border-dashed border-purple-500/30 dark:border-nebula-purple/50 rounded-full animate-spin-slow shadow-[0_0_30px_rgba(139,92,246,0.2)] will-change-transform"
                        style={{ animationDirection: 'reverse', animationDuration: '28s' }}
                    />

                    {/* Glowing Cosmos Core behind image */}
                    <div className="hero-orbit-ring absolute w-[210px] h-[210px] sm:w-[270px] sm:h-[270px] md:w-[350px] md:h-[350px] bg-gradient-radial from-indigo-500/20 via-purple-500/15 to-transparent dark:from-nebula-glow/30 dark:via-starlight-blue/20 dark:to-transparent rounded-full blur-[80px] will-change-transform" />

                    {/* Main Tech Portrait Image Frame with Aura Shadow and 3D Perspective Tilt */}
                    <div
                        ref={portraitFrameRef}
                        style={{ transformStyle: 'preserve-3d' }}
                        className="hero-portrait-frame relative w-[220px] h-[220px] sm:w-[270px] sm:h-[270px] md:w-[340px] md:h-[340px] lg:w-[370px] lg:h-[370px] rounded-full p-2 bg-gradient-to-b from-indigo-500/40 via-purple-500/20 to-cyan-500/30 dark:from-starlight-cyan/50 dark:via-white/20 dark:to-nebula-purple/40 backdrop-blur-md shadow-[0_0_35px_rgba(139,92,246,0.35),0_0_70px_rgba(6,182,212,0.2)] dark:shadow-[0_0_45px_rgba(139,92,246,0.5),0_0_90px_rgba(6,182,212,0.3)] transition-shadow duration-500 will-change-transform"
                    >
                        <div className="w-full h-full rounded-full overflow-hidden border-2 border-white/60 dark:border-white/20 relative group bg-space-dark">
                            <img
                                src={profileTechImg}
                                alt="Chinatip Wu"
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            {/* Dynamic specular light reflection that shifts with tilt */}
                            <div className="hero-specular-light absolute -inset-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.25),transparent_60%)] pointer-events-none opacity-40 group-hover:opacity-75 transition-opacity duration-300 will-change-transform" />
                            {/* Subtle futuristic rim light overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-space-black/50 via-transparent to-transparent opacity-40 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none" />
                        </div>
                    </div>
                </div>

            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce text-slate-400 dark:text-gray-500 pointer-events-none hidden sm:flex flex-col items-center gap-1">
                <span className="text-[10px] font-mono tracking-widest uppercase opacity-60">Scroll</span>
                <div className="w-5 h-8 border-2 border-slate-300 dark:border-white/20 rounded-full flex justify-center p-1 backdrop-blur-sm">
                    <div className="w-1 h-2 bg-indigo-600 dark:bg-starlight-cyan rounded-full animate-pulse" />
                </div>
            </div>

            {/* Interactive Force Field Controls HUD */}
            <ForceFieldControls
                params={params}
                stats={stats}
                onChange={setParams}
                onRandomize={randomize}
            />
        </section>
    );
};

export default Hero;
