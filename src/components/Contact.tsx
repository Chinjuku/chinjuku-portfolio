import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Mail, Github, Linkedin, FileText, ArrowUpRight, Phone } from 'lucide-react';
import resumePdf from '../assets/resume.pdf';
import { chinjukuContact } from '../constants/contact';
import { Magnetic, useScrollVelocityMarquee } from './motion';

gsap.registerPlugin(ScrollTrigger);

interface KineticHeadingProps {
    text: string;
    className?: string;
    charClassName?: string;
}

/**
 * Renders words and characters with overflow-hidden mask containers
 * for seamless vertical letter-by-letter clip slide-down animations.
 */
const KineticHeading: React.FC<KineticHeadingProps> = ({
    text,
    className = "",
    charClassName = "contact-letter"
}) => {
    const words = text.split(" ");

    return (
        <span className={`inline-flex flex-wrap justify-center gap-x-[0.3em] ${className}`}>
            {words.map((word, wordIdx) => (
                <span key={wordIdx} className="inline-flex whitespace-nowrap">
                    {Array.from(word).map((char, charIdx) => (
                        <span
                            key={charIdx}
                            className="inline-block overflow-hidden align-top py-0.5"
                        >
                            <span
                                className={`${charClassName} inline-block will-change-transform`}
                            >
                                {char}
                            </span>
                        </span>
                    ))}
                </span>
            ))}
        </span>
    );
};

const Contact: React.FC = () => {
    const containerRef = useRef<HTMLElement>(null);
    useScrollVelocityMarquee(containerRef, '.contact-band-row');
    const headingRef = useRef<HTMLHeadingElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Animate headline letters sliding down from clipped upper boundary
            gsap.fromTo(
                ".contact-letter",
                {
                    yPercent: -125,
                    opacity: 0,
                    rotateX: 45,
                },
                {
                    yPercent: 0,
                    opacity: 1,
                    rotateX: 0,
                    duration: 0.85,
                    stagger: 0.025,
                    ease: "power4.out",
                    scrollTrigger: {
                        trigger: headingRef.current,
                        start: "top 82%",
                        toggleActions: "play none none reverse",
                    },
                }
            );

            // Stagger-in contact cards right after heading animation
            gsap.fromTo(
                ".contact-card-item",
                {
                    y: 35,
                    opacity: 0,
                },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.7,
                    stagger: 0.08,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: ".contact-cards-grid",
                        start: "top 85%",
                        toggleActions: "play none none reverse",
                    },
                }
            );
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={containerRef}
            onPointerMove={(e) => {
                const el = containerRef.current;
                if (!el) return;
                const r = el.getBoundingClientRect();
                el.style.setProperty("--cx", `${e.clientX - r.left}px`);
                el.style.setProperty("--cy", `${e.clientY - r.top}px`);
            }}
            className="flex items-center justify-center bg-space-white dark:bg-space-black relative overflow-hidden py-24 sm:py-32 transition-colors duration-300"
        >
            {/* light that follows the cursor across the section */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 transition-opacity duration-500"
                style={{
                    background:
                        "radial-gradient(600px circle at var(--cx, 50%) var(--cy, 40%), rgba(138,191,255,0.10), transparent 55%)",
                }}
            />

            {/* Background Cosmic Particle Grid & Radial Aura */}
            <div className="absolute inset-0 bg-[radial-gradient(#ffffff15_1px,transparent_1px)] [background-size:18px_18px] opacity-40 pointer-events-none" />
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-starlight-blue/10 via-nebula-purple/5 to-transparent opacity-60 pointer-events-none" />

            <div className="container mx-auto px-6 text-center relative z-10">
                {/* Subtitle Badge */}
                <p className="font-mono text-[11px] tracking-[0.3em] text-core-icy uppercase mb-4">Contact</p>

                {/* Main Heading with Vertical Text Clip Slide-Down Animation */}
                <h3
                    ref={headingRef}
                    className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold sci-fi-heading tracking-[-0.03em] mb-14 tracking-tight"
                >
                    <KineticHeading text="Let's build something intelligent." />
                </h3>

                {/* Contact Cards Grid */}
                <div className="contact-cards-grid flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-8 mb-24 max-w-5xl mx-auto">
                    <Magnetic strength={0.2}>
                    <a
                        href={`mailto:${chinjukuContact.gmail}`}
                        className="contact-card-item group flex items-center gap-3 px-6 py-4 rounded-2xl sci-fi-card hover:scale-105"
                        aria-label={`Send email to ${chinjukuContact.gmail}`}
                    >
                        <div className="p-2.5 rounded-xl bg-nebula-purple/10 text-nebula-purple dark:text-nebula-glow group-hover:bg-nebula-purple group-hover:text-white transition-all">
                            <Mail className="w-5 h-5 sm:w-6 sm:h-6" />
                        </div>
                        <div className="text-left">
                            <span className="text-xs font-mono text-gray-500 dark:text-gray-400 uppercase tracking-wider block">Email</span>
                            <span className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white group-hover:text-nebula-purple dark:group-hover:text-starlight-cyan transition-colors">{chinjukuContact.gmail}</span>
                        </div>
                        <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-nebula-purple dark:group-hover:text-starlight-cyan group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all ml-1" />
                    </a>
                    </Magnetic>

                    <Magnetic strength={0.2}>
                    <a
                        href={chinjukuContact.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="contact-card-item group flex items-center gap-3 px-6 py-4 rounded-2xl sci-fi-card hover:scale-105"
                        aria-label="View GitHub profile"
                    >
                        <div className="p-2.5 rounded-xl bg-space-black/10 dark:bg-white/10 text-space-black dark:text-white group-hover:bg-space-black dark:group-hover:bg-white dark:group-hover:text-space-black group-hover:text-white transition-all">
                            <Github className="w-5 h-5 sm:w-6 sm:h-6" />
                        </div>
                        <div className="text-left">
                            <span className="text-xs font-mono text-gray-500 dark:text-gray-400 uppercase tracking-wider block">GitHub</span>
                            <span className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white group-hover:text-nebula-purple dark:group-hover:text-starlight-cyan transition-colors">GitHub</span>
                        </div>
                        <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-nebula-purple dark:group-hover:text-starlight-cyan group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all ml-1" />
                    </a>
                    </Magnetic>

                    <Magnetic strength={0.2}>
                    <a
                        href={chinjukuContact.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="contact-card-item group flex items-center gap-3 px-6 py-4 rounded-2xl sci-fi-card hover:scale-105"
                        aria-label="Connect on LinkedIn"
                    >
                        <div className="p-2.5 rounded-xl bg-starlight-blue/10 text-starlight-blue group-hover:bg-starlight-blue group-hover:text-white transition-all">
                            <Linkedin className="w-5 h-5 sm:w-6 sm:h-6" />
                        </div>
                        <div className="text-left">
                            <span className="text-xs font-mono text-gray-500 dark:text-gray-400 uppercase tracking-wider block">LinkedIn</span>
                            <span className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white group-hover:text-starlight-blue dark:group-hover:text-starlight-cyan transition-colors">LinkedIn</span>
                        </div>
                        <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-starlight-blue dark:group-hover:text-starlight-cyan group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all ml-1" />
                    </a>
                    </Magnetic>

                    <Magnetic strength={0.2}>
                    <a
                        href={resumePdf}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="contact-card-item group flex items-center gap-3 px-6 py-4 rounded-2xl sci-fi-card hover:scale-105"
                        aria-label="View Resume PDF document"
                    >
                        <div className="p-2.5 rounded-xl bg-starlight-cyan/10 text-starlight-cyan group-hover:bg-starlight-cyan group-hover:text-white transition-all">
                            <FileText className="w-5 h-5 sm:w-6 sm:h-6" />
                        </div>
                        <div className="text-left">
                            <span className="text-xs font-mono text-gray-500 dark:text-gray-400 uppercase tracking-wider block">Resume</span>
                            <span className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white group-hover:text-starlight-cyan transition-colors">Resume PDF</span>
                        </div>
                        <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-starlight-cyan group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all ml-1" />
                    </a>
                    </Magnetic>

                    <Magnetic strength={0.2}>
                    <a
                        href={`tel:${chinjukuContact.phone}`}
                        className="contact-card-item group flex items-center gap-3 px-6 py-4 rounded-2xl sci-fi-card hover:scale-105"
                        aria-label={`Call ${chinjukuContact.phone}`}
                    >
                        <div className="p-2.5 rounded-xl bg-cyber-emerald/10 text-cyber-emerald group-hover:bg-cyber-emerald group-hover:text-white transition-all">
                            <Phone className="w-5 h-5 sm:w-6 sm:h-6" />
                        </div>
                        <div className="text-left">
                            <span className="text-xs font-mono text-gray-500 dark:text-gray-400 uppercase tracking-wider block">Phone</span>
                            <span className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white group-hover:text-cyber-emerald transition-colors">{chinjukuContact.phone}</span>
                        </div>
                        <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-cyber-emerald group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all ml-1" />
                    </a>
                    </Magnetic>
                </div>

                {/* giant outlined band that runs faster with the scroll */}
                <div aria-hidden="true" className="relative left-1/2 mb-20 w-screen -translate-x-1/2 overflow-hidden select-none">
                    <div className="contact-band-row flex w-max animate-scroll gap-12 whitespace-nowrap text-[11vw] font-semibold leading-none tracking-[-0.04em] text-transparent [-webkit-text-stroke:1px_rgba(201,209,219,0.22)]">
                        {[0, 1].map((k) => (
                            <span key={k} className="flex gap-12">
                                <span>Full-stack × AI</span>
                                <span className="text-core-icy/10 [-webkit-text-stroke:0]">·</span>
                                <span>Open for work</span>
                                <span className="text-core-icy/10 [-webkit-text-stroke:0]">·</span>
                                <span>Bangkok</span>
                                <span className="text-core-icy/10 [-webkit-text-stroke:0]">·</span>
                            </span>
                        ))}
                    </div>
                </div>

                {/* Polished Cyber-Cosmos Mission Footer */}
                <footer className="border-t border-gray-200/80 dark:border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between text-xs font-mono text-gray-500 dark:text-gray-400 gap-4">
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="tracking-wider">AVAILABLE FOR WORK</span>
                    </div>
                    <p>© {new Date().getFullYear()} Chinatip Wu (Chinjuku). All rights reserved.</p>
                    <p className="flex items-center gap-1.5">
                        Built with <span className="text-nebula-purple dark:text-starlight-cyan font-semibold">React</span> & <span className="text-starlight-blue dark:text-nebula-glow font-semibold">TypeScript</span>
                    </p>
                </footer>
            </div>
        </section>
    );
};

export default Contact;
