import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { User, Cpu, Zap, BookOpen } from 'lucide-react';

const About: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    
    // Fixed positions to prevent overlaps
    const techItems = [
        { label: "TS", color: "text-nebula-purple dark:text-nebula-glow", top: "10%", left: "80%", duration: "3s", delay: "0s" },
        { label: "React", color: "text-starlight-blue dark:text-starlight-cyan", top: "15%", left: "10%", duration: "4s", delay: "1s" },
        { label: "Node.js", color: "text-starlight-blue dark:text-starlight-cyan", top: "45%", left: "85%", duration: "5s", delay: "0.5s" },
        { label: "Next.js", color: "text-starlight-blue dark:text-starlight-cyan", top: "50%", left: "5%", duration: "3.5s", delay: "1.5s" },
        { label: "Tailwind", color: "text-starlight-blue dark:text-starlight-cyan", top: "80%", left: "70%", duration: "4.5s", delay: "0.8s" },
        { label: "Git", color: "text-starlight-blue dark:text-starlight-cyan", top: "75%", left: "15%", duration: "4s", delay: "2s" }
    ];

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(".about-text > *", {
                x: -50,
                opacity: 0,
                duration: 1,
                stagger: 0.2,
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top 70%",
                }
            });

            gsap.from(".about-visual", {
                x: 50,
                opacity: 0,
                duration: 1,
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top 70%",
                }
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={containerRef} className="min-h-screen flex items-center bg-space-white dark:bg-space-dark relative overflow-hidden py-24 transition-colors duration-300">
            <div className="container mx-auto px-6 flex flex-col md:flex-row items-center gap-10 md:gap-12 lg:gap-16">

                {/* Text Content */}
                <div className="about-text flex-1">
                    <div className="flex items-center gap-2 mb-4">
                        <User className="w-5 h-5 text-nebula-purple dark:text-starlight-cyan" />
                        <span className="sci-fi-subheading">About Me // PROFILE</span>
                    </div>

                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold sci-fi-heading mb-6 leading-tight">
                        Driven by Passion <br />
                        <span className="sci-fi-gradient-text">
                            Defined by Code
                        </span>
                    </h2>

                    <p className="text-gray-600 dark:text-gray-300 text-base md:text-lg leading-relaxed mb-8">
                        A highly responsible and self-motivated college junior with an IT (Information Technology) major at King Mongkut's Institute of Technology Ladkrabang. Seeking an opportunity for a cooperative position as a Fullstack developer that will allow me to apply and expand my skills in Fullstack development your company. I look forward to the opportunity to work with your team.
                    </p>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="p-5 rounded-2xl sci-fi-card">
                            <div className="flex items-center gap-3 mb-2">
                                <Zap className="w-5 h-5 text-amber-500" />
                                <h4 className="font-bold sci-fi-heading">Personal Skills</h4>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Fast learner, Teamwork, Problem-solving, Leadership</p>
                        </div>

                        <div className="p-5 rounded-2xl sci-fi-card">
                            <div className="flex items-center gap-3 mb-2">
                                <BookOpen className="w-5 h-5 text-starlight-blue dark:text-starlight-cyan" />
                                <h4 className="font-bold sci-fi-heading">Education</h4>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">KMITL, Information Technology (Software Engineering), 2022 - Present</p>
                        </div>
                    </div>
                </div>

                {/* Visual Element */}
                <div className="about-visual flex-1 flex justify-center relative">
                    <div className="relative w-[300px] h-[300px] md:w-[400px] md:h-[400px]">
                        {/* Abstract 3D-like elements using CSS/SVG */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-nebula-purple to-starlight-blue dark:to-starlight-cyan rounded-full opacity-20 blur-[80px] animate-pulse-slow" />

                        <div className="absolute inset-10 border-2 border-gray-200 dark:border-white/10 rounded-full animate-spin-slow" />
                        <div className="absolute inset-20 border border-nebula-purple/30 rounded-full animate-spin-slow" style={{ animationDirection: 'reverse', animationDuration: '15s' }} />

                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-32 h-32 sci-fi-glass rounded-2xl rotate-45 flex items-center justify-center shadow-2xl">
                                <Cpu className="w-16 h-16 text-nebula-purple dark:text-starlight-cyan opacity-90 -rotate-45" />
                            </div>
                        </div>

                        {/* Floating elements */}
                        {techItems.map((item, index) => (
                            <div 
                                key={index}
                                className="absolute sci-fi-glass text-xs font-mono font-bold px-3 py-1.5 rounded-xl flex items-center justify-center animate-bounce shadow-lg"
                                style={{ 
                                    top: item.top, 
                                    left: item.left,
                                    animationDuration: item.duration,
                                    animationDelay: item.delay
                                }}
                            >
                                <span className={`text-xs font-bold ${item.color}`}>
                                    {item.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </section>
    );
};

export default About;
