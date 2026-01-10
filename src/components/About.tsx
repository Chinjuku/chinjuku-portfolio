import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { User, Cpu, Zap, BookOpen } from 'lucide-react';

const About: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);

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
                    <div className="flex items-center gap-2 text-nebula-purple dark:text-nebula-glow mb-4">
                        <User className="w-5 h-5" />
                        <span className="tracking-widest uppercase font-medium">About Me</span>
                    </div>

                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-space-black dark:text-white mb-6 leading-tight">
                        Driven by Passion <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-starlight-blue to-nebula-purple dark:from-starlight-cyan dark:to-nebula-purple">
                            Defined by Code
                        </span>
                    </h2>

                    <p className="text-gray-600 dark:text-gray-300 text-base md:text-lg leading-relaxed mb-8">
                        A highly responsible and self-motivated college junior with an IT (Information Technology) major at King Mongkut's Institute of Technology Ladkrabang. Seeking an opportunity for a cooperative position as a Fullstack developer that will allow me to apply and expand my skills in Fullstack development your company. I look forward to the opportunity to work with your team.
                    </p>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="p-4 rounded-xl bg-white/50 dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-sm">
                            <div className="flex items-center gap-3 mb-2">
                                <Zap className="w-5 h-5 text-yellow-500 dark:text-yellow-400" />
                                <h4 className="font-bold text-space-black dark:text-white">Personal Skills</h4>
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Fast learner, Teamwork, Problem-solving, Leadership</p>
                        </div>

                        <div className="p-4 rounded-xl bg-white/50 dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-sm">
                            <div className="flex items-center gap-3 mb-2">
                                <BookOpen className="w-5 h-5 text-starlight-blue dark:text-starlight-cyan" />
                                <h4 className="font-bold text-space-black dark:text-white">Education</h4>
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">KMITL, Information Technology (Software Engineering), 2022 - Present</p>
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
                            <div className="w-32 h-32 bg-white/50 dark:bg-white/5 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-white/20 rotate-45 flex items-center justify-center shadow-2xl">
                                <Cpu className="w-16 h-16 text-space-black dark:text-white opacity-80 -rotate-45" />
                            </div>
                        </div>

                        {/* Floating elements */}
                        <div className="absolute top-0 right-10 w-12 h-12 bg-white dark:bg-space-black border border-gray-200 dark:border-white/20 rounded-lg flex items-center justify-center animate-bounce shadow-lg" style={{ animationDuration: '3s' }}>
                            <span className="text-xs font-bold text-nebula-purple dark:text-nebula-glow">TS</span>
                        </div>
                        <div className="absolute bottom-10 left-0 w-16 h-10 bg-white dark:bg-space-black border border-gray-200 dark:border-white/20 rounded-lg flex items-center justify-center animate-bounce shadow-lg" style={{ animationDuration: '4s', animationDelay: '1s' }}>
                            <span className="text-xs font-bold text-starlight-blue dark:text-starlight-cyan">React</span>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default About;
