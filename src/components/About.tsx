import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight, Layers, Send } from "lucide-react";
import { techSatellites } from "../constants/about";
import { AboutTacticalCards, AboutCyberCore } from "./about/index";

gsap.registerPlugin(ScrollTrigger);

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
        { y: 0, opacity: 1, duration: 0.5, ease: "power3.out" },
      )
        // 2. Headline
        .fromTo(
          ".about-headline",
          { y: 25, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" },
          "-=0.3",
        )
        // 3. Story Bio
        .fromTo(
          ".about-bio",
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, ease: "power2.out" },
          "-=0.3",
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
          "-=0.25",
        )
        // 5. Action CTA buttons
        .fromTo(
          ".about-actions",
          { y: 15, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, ease: "power2.out" },
          "-=0.2",
        )
        // 6. Center Cyber Core Entry
        .fromTo(
          ".about-core-center",
          { scale: 0.65, opacity: 0, rotate: -25 },
          {
            scale: 1,
            opacity: 1,
            rotate: 0,
            duration: 0.8,
            ease: "back.out(1.2)",
          },
          0.2,
        )
        // 7. Radar Rings Entry
        .fromTo(
          ".about-radar-ring",
          { scale: 0.75, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.7,
            stagger: 0.1,
            ease: "power2.out",
          },
          0.35,
        )
        // 8. Satellites Pop Outward
        .fromTo(
          ".about-satellite",
          { scale: 0, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.5,
            stagger: 0.06,
            ease: "back.out(1.5)",
          },
          0.45,
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
          <p className="about-pill font-mono text-[11px] tracking-[0.3em] text-core-icy uppercase mb-4">About</p>

          {/* Headline */}
          <h2 className="about-headline text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-semibold sci-fi-heading tracking-[-0.03em] mb-4 tracking-tight leading-tight">
            Full-stack × AI developer <br />
            <span className="sci-fi-gradient-text">
              building products end to end
            </span>
          </h2>

          {/* Story Bio */}
          <div className="about-bio space-y-2.5 mb-5 text-gray-600 dark:text-gray-300 text-xs sm:text-sm md:text-base leading-relaxed">
            <p>
              Graduated in{" "}
              <span className="font-bold text-gray-900 dark:text-white font-mono">
                April 2026
              </span>{" "}
              with an{" "}
              <span className="font-semibold text-nebula-purple dark:text-starlight-cyan">
                IT (Software Engineering)
              </span>{" "}
              degree from{" "}
              <span className="font-semibold text-gray-900 dark:text-white">
                King Mongkut's Institute of Technology Ladkrabang (KMITL)
              </span>
              . I work as a{" "}
              <span className="font-bold text-gray-900 dark:text-white">
                full-stack developer
              </span>
              , building web platforms, front ends and backend APIs, and
              adding AI where it actually helps the product.
            </p>
            <p>
              I care about clean architecture and shipping the whole thing,
              from schema to UI. Open to{" "}
              <span className="font-bold text-cyan-600 dark:text-starlight-cyan">
                Freelance Development
              </span>
              ,{" "}
              <span className="font-bold text-nebula-purple dark:text-nebula-glow">
                Part-time Engineering
              </span>
              , and product teams that build with AI.
            </p>
          </div>

          {/* 4 Tactical Status Cards */}
          <AboutTacticalCards />

          {/* Action Buttons */}
          <div className="about-actions flex flex-wrap items-center gap-3">
            <a
              href="#contact"
              className="sci-fi-btn-primary group cursor-pointer inline-flex items-center gap-2 text-xs sm:text-sm py-2 px-5"
            >
              <Send className="w-3.5 h-3.5 group-hover:rotate-12 transition-transform" />
              <span>Work with me</span>
              <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
            <a
              href="#projects"
              className="sci-fi-btn-secondary group inline-flex items-center gap-2 cursor-pointer text-xs sm:text-sm py-2 px-5"
            >
              <Layers className="w-3.5 h-3.5 text-nebula-purple dark:text-starlight-cyan" />
              <span>See the work</span>
            </a>
          </div>
        </div>

        {/* Right Column: Holographic Cyber Core & Floating Tech Satellites */}
        <AboutCyberCore techSatellites={techSatellites} />
      </div>
    </section>
  );
};

export default About;
