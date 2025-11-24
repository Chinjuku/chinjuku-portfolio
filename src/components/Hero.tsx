import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ArrowRight, Download } from 'lucide-react';
import ProfileAvatar from '../assets/profile.png';
import { useNavClick } from '../utils';
import resumePdf from '../assets/resume.pdf';

const Hero: React.FC = () => {
    const componentRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLSpanElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const handleNavClick = useNavClick();

    // Particle Animation
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = window.innerWidth;
        let height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;

        const particles: { x: number; y: number; size: number; speedX: number; speedY: number; opacity: number }[] = [];
        const particleCount = 100;

        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                size: Math.random() * 2,
                speedX: (Math.random() - 0.5) * 0.5,
                speedY: (Math.random() - 0.5) * 0.5,
                opacity: Math.random() * 0.5 + 0.1
            });
        }

        const animate = () => {
            ctx.clearRect(0, 0, width, height);

            particles.forEach(p => {
                p.x += p.speedX;
                p.y += p.speedY;

                if (p.x < 0) p.x = width;
                if (p.x > width) p.x = 0;
                if (p.y < 0) p.y = height;
                if (p.y > height) p.y = 0;

                ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
            });

            requestAnimationFrame(animate);
        };

        animate();

        const handleResize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Typing Effect & Entrance Animation
    useEffect(() => {
        const ctx = gsap.context(() => {
            // Entrance
            gsap.from(".hero-content > *", {
                y: 50,
                opacity: 0,
                duration: 1,
                stagger: 0.2,
                ease: "power3.out",
                delay: 0.5
            });

            gsap.from(".hero-image-container", {
                scale: 0.8,
                opacity: 0,
                duration: 1.5,
                ease: "elastic.out(1, 0.5)",
                delay: 0.2
            });

            // Typing Effect
            const roles = ["Backend Developer", "Fullstack Developer", "Software Engineer"];
            let roleIndex = 0;
            let charIndex = 0;
            let isDeleting = false;

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

                let typeSpeed = 100;
                if (isDeleting) typeSpeed /= 2;

                if (!isDeleting && charIndex === currentRole.length) {
                    isDeleting = true;
                    typeSpeed = 2000; // Pause at end
                } else if (isDeleting && charIndex === 0) {
                    isDeleting = false;
                    roleIndex = (roleIndex + 1) % roles.length;
                    typeSpeed = 500;
                }

                setTimeout(type, typeSpeed);
            };

            setTimeout(type, 2000);

        }, componentRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={componentRef} className="relative w-full h-screen flex items-center justify-center overflow-hidden bg-space-white dark:bg-space-black transition-colors duration-300">
            <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20 dark:opacity-100" />

            <div className="relative z-10 container mx-auto px-6 flex flex-col-reverse lg:flex-row items-center justify-between gap-8 md:gap-12 lg:gap-12">

                {/* Text Content */}
                <div className="hero-content flex-1 text-center md:text-left">
                    <h2 className="text-nebula-purple dark:text-nebula-glow font-medium text-base md:text-lg mb-4 tracking-widest uppercase">Welcome to my universe</h2>
                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight text-space-black dark:text-white">
                        I'm <span className="text-transparent bg-clip-text bg-gradient-to-r from-starlight-blue to-nebula-purple dark:from-starlight-cyan dark:to-nebula-purple">
                            Chinatip Wu
                        </span>
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-8 font-light">
                        Navigating the Digital Universe
                    </p>

                    <div className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-8 h-8 font-mono">
                        I am a <span ref={textRef} className="text-space-black dark:text-white border-r-2 border-nebula-purple pr-1"></span>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                        <button onClick={() => handleNavClick('#experience')} className="group relative px-6 py-2 md:px-8 md:py-3 bg-nebula-purple hover:bg-nebula-glow text-white rounded-full font-medium transition-all duration-300 flex items-center justify-center gap-2 overflow-hidden shadow-lg shadow-nebula-purple/20">
                            <span className="relative z-10">View Mission Log</span>
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform relative z-10" />
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                        </button>

                        <button onClick={() => window.open(resumePdf, '_blank')} className="group px-6 py-2 md:px-8 md:py-3 border border-gray-300 dark:border-white/20 hover:border-starlight-blue dark:hover:border-starlight-cyan text-space-black dark:text-white rounded-full font-medium transition-all duration-300 flex items-center justify-center gap-2 hover:bg-gray-100 dark:hover:bg-white/5">
                            <span>Download Flight Data</span>
                            <Download className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
                        </button>
                    </div>
                </div>

                {/* Image / Visual */}
                <div className="hero-image-container flex-1 flex justify-center items-center relative">
                    {/* Orbital Rings */}
                    <div className="absolute w-[240px] h-[240px] sm:w-[300px] sm:h-[300px] md:w-[450px] md:h-[450px] lg:w-[500px] lg:h-[500px] border border-white/10 rounded-full animate-spin-slow" />
                    <div className="absolute w-[220px] h-[220px] sm:w-[280px] sm:h-[280px] md:w-[430px] md:h-[430px] lg:w-[480px] lg:h-[480px] border border-nebula-purple/20 rounded-full animate-spin-slow" style={{ animationDirection: 'reverse' }} />

                    {/* Glowing Background behind image */}
                    <div className="absolute w-[200px] h-[200px] sm:w-[250px] sm:h-[250px] md:w-[380px] md:h-[380px] lg:w-[400px] lg:h-[400px] bg-nebula-purple/20 rounded-full blur-[100px]" />

                    {/* Main Image Frame */}
                    <div className="relative w-[220px] h-[220px] sm:w-[260px] sm:h-[260px] md:w-[380px] md:h-[380px] lg:w-[420px] lg:h-[420px] rounded-full p-2 bg-gradient-to-b from-white/20 to-transparent backdrop-blur-sm">
                        <div className="w-full h-full rounded-full overflow-hidden border-4 border-space-dark relative group">
                            <img
                                src={ProfileAvatar}
                                alt="Astronaut"
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-space-black/80 to-transparent opacity-60" />
                        </div>
                    </div>
                </div>

            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-gray-500">
                <div className="w-6 h-10 border-2 border-gray-500 rounded-full flex justify-center p-1">
                    <div className="w-1 h-3 bg-starlight-cyan rounded-full" />
                </div>
            </div>
        </section>
    );
};

export default Hero;
