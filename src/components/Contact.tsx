import React, { useRef, useEffect, useLayoutEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Mail, Github, Linkedin, ArrowUpRight, Phone, Briefcase } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { chinjukuContact, CONTACT_HEADLINES } from '../constants/contact';
import { useScrollVelocityMarquee, usePrefersReducedMotion } from './motion';
import Container from './common/Container';

gsap.registerPlugin(ScrollTrigger);

interface KineticHeadingProps {
    text: string;
    className?: string;
    charClassName?: string;
    'aria-hidden'?: boolean | 'true' | 'false';
}

/**
 * Renders words and characters with overflow-hidden mask containers
 * for seamless vertical letter-by-letter clip slide-down animations.
 */
const KineticHeading: React.FC<KineticHeadingProps> = ({
    text,
    className = "",
    charClassName = "contact-letter",
    "aria-hidden": ariaHidden,
}) => {
    const words = text.split(" ");

    return (
        <span aria-hidden={ariaHidden} className={`inline-flex flex-wrap justify-center gap-x-[0.3em] ${className}`}>
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

interface Channel {
    id: string;
    label: string;
    value: string;
    href: string;
    icon: LucideIcon;
    external: boolean;
}

const CHANNELS: Channel[] = [
    { id: "email", label: "Email", value: chinjukuContact.gmail, href: `mailto:${chinjukuContact.gmail}`, icon: Mail, external: false },
    { id: "fastwork", label: "Fastwork", value: "fastwork.com/user/chinatip", href: chinjukuContact.fastwork, icon: Briefcase, external: true },
    { id: "github", label: "GitHub", value: "github.com/Chinjuku", href: chinjukuContact.github, icon: Github, external: true },
    { id: "linkedin", label: "LinkedIn", value: "linkedin.com/in/chinatip-wu", href: chinjukuContact.linkedin, icon: Linkedin, external: true },
    { id: "phone", label: "Phone", value: chinjukuContact.phone, href: `tel:${chinjukuContact.phone}`, icon: Phone, external: false },
];

const ROTATE_MS = 3600;

/**
 * Headline that cycles through CONTACT_HEADLINES: letters slide out the
 * bottom of their mask, the next phrase drops in from the top. Rotation
 * pauses off-screen and is disabled for reduced motion (first phrase only).
 */
const RotatingHeadline: React.FC<{ phrases: readonly string[] }> = ({ phrases }) => {
    const rootRef = useRef<HTMLHeadingElement>(null);
    const [index, setIndex] = useState(0);
    const reduced = usePrefersReducedMotion();
    const inViewRef = useRef(false);
    const introDoneRef = useRef(false);
    const busyRef = useRef(false);

    // letters drop in whenever the phrase changes (first time: when scrolled into view)
    useLayoutEffect(() => {
        if (reduced) return;
        const root = rootRef.current;
        if (!root) return;
        const ctx = gsap.context(() => {
            const from = { yPercent: -125, opacity: 0, rotateX: 45 };
            const to = { yPercent: 0, opacity: 1, rotateX: 0, duration: 0.85, stagger: 0.025, ease: "power4.out" };
            if (!introDoneRef.current) {
                gsap.fromTo(".contact-letter", from, {
                    ...to,
                    scrollTrigger: { trigger: root, start: "top 82%", once: true },
                    onStart: () => { introDoneRef.current = true; },
                });
            } else {
                gsap.fromTo(".contact-letter", from, { ...to, onComplete: () => { busyRef.current = false; } });
            }
        }, root);
        return () => ctx.revert();
    }, [index, reduced]);

    useEffect(() => {
        const root = rootRef.current;
        if (reduced || !root) return;
        const io = new IntersectionObserver(([e]) => { inViewRef.current = e.isIntersecting; });
        io.observe(root);
        const timer = window.setInterval(() => {
            if (!inViewRef.current || !introDoneRef.current || busyRef.current) return;
            busyRef.current = true;
            gsap.to(root.querySelectorAll(".contact-letter"), {
                yPercent: 125,
                opacity: 0,
                duration: 0.4,
                stagger: 0.012,
                ease: "power3.in",
                onComplete: () => setIndex((i) => (i + 1) % phrases.length),
            });
        }, ROTATE_MS);
        return () => {
            io.disconnect();
            window.clearInterval(timer);
            busyRef.current = false;
        };
    }, [reduced, phrases.length]);

    const phrase = phrases[index];
    return (
        <h3
            ref={rootRef}
            aria-label={phrase}
            className="mb-14 flex min-h-[2.3em] items-center justify-center text-4xl font-semibold tracking-[-0.03em] text-core-ink sm:text-5xl md:text-6xl lg:text-7xl"
        >
            <KineticHeading key={phrase} text={phrase} aria-hidden="true" />
        </h3>
    );
};

const Contact: React.FC = () => {
    const containerRef = useRef<HTMLElement>(null);
    useScrollVelocityMarquee(containerRef, '.contact-band-row');

    useEffect(() => {
        const ctx = gsap.context(() => {
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
            className="flex items-center justify-center bg-core-obsidian relative overflow-hidden py-24 sm:py-32 transition-colors duration-300"
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

            <Container className="text-center relative z-10">
                {/* Subtitle Badge */}
                <p className="font-mono text-[11px] tracking-[0.3em] text-core-icy uppercase mb-4">Contact</p>

                {/* Main Heading with Vertical Text Clip Slide-Down Animation */}
                <RotatingHeadline phrases={CONTACT_HEADLINES} />

                {/* Channels: one quiet list, same row language as the About facts */}
                <ul className="contact-cards-grid mx-auto mb-24 max-w-3xl border-t border-core-graphite">
                    {CHANNELS.map(({ id, label, value, href, icon: Icon, external }) => (
                        <li key={id} className="contact-card-item border-b border-core-graphite">
                            <a
                                href={href}
                                {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                                aria-label={`${label}: ${value}`}
                                className="group flex items-center gap-4 px-3 py-5 text-left transition-colors hover:bg-white/[0.03] focus-visible:bg-white/[0.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-core-icy/50 sm:gap-6 sm:px-5"
                            >
                                <Icon className="h-5 w-5 shrink-0 text-core-mist transition-colors group-hover:text-core-icy" aria-hidden="true" />
                                <span className="w-[4.5rem] shrink-0 font-mono text-[11px] uppercase tracking-[0.2em] text-core-mist sm:w-24">{label}</span>
                                <span className="min-w-0 flex-1 truncate text-sm text-core-ink sm:text-lg">{value}</span>
                                <ArrowUpRight className="h-4 w-4 shrink-0 text-core-mist transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-core-icy" aria-hidden="true" />
                            </a>
                        </li>
                    ))}
                </ul>

                {/* giant outlined band that runs faster with the scroll */}
                <div aria-hidden="true" className="relative left-1/2 mb-20 w-screen -translate-x-1/2 overflow-hidden select-none">
                    <div className="contact-band-row flex w-max animate-scroll gap-12 whitespace-nowrap text-[11vw] font-semibold leading-none tracking-[-0.04em] text-transparent [-webkit-text-stroke:1px_rgba(201,209,219,0.22)]">
                        {[0, 1].map((k) => (
                            <span key={k} className="flex gap-12">
                                <span>Full-stack × AI</span>
                                <span className="text-core-icy/10 [-webkit-text-stroke:0]">·</span>
                                <span>Shipping products</span>
                                <span className="text-core-icy/10 [-webkit-text-stroke:0]">·</span>
                                <span>Bangkok</span>
                                <span className="text-core-icy/10 [-webkit-text-stroke:0]">·</span>
                            </span>
                        ))}
                    </div>
                </div>

                {/* Polished Cyber-Cosmos Mission Footer */}
                <footer className="border-t border-gray-200/80 dark:border-white/10 pt-8 flex flex-col lg:flex-row items-center justify-between text-xs font-mono text-gray-500 dark:text-gray-400 gap-4">
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="tracking-wider">BANGKOK, TH</span>
                    </div>
                    <p>© {new Date().getFullYear()} Chinatip Wu (Chinjuku). All rights reserved.</p>
                    <p className="flex items-center gap-1.5">
                        Built with <span className="text-nebula-purple dark:text-starlight-cyan font-semibold">React</span> & <span className="text-starlight-blue dark:text-nebula-glow font-semibold">TypeScript</span>
                    </p>
                </footer>
            </Container>
        </section>
    );
};

export default Contact;
