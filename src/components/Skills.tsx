import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { skillCategories, totalSkillCount } from "../constants/skills";
import {
  SkillsHeader,
  SkillsMarquee,
  SkillsTelemetryDivider,
  SkillsPillars,
} from "./skills/index";

gsap.registerPlugin(ScrollTrigger);

const Skills: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  // GSAP ScrollTrigger Component Animations (restarts cleanly every time you scroll into view)
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          toggleActions: "restart none restart none",
        },
      });

      // 1. Header (Subheading & Main Heading)
      tl.fromTo(
        ".skills-header",
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: "power3.out" },
      )
        // 2. Marquee stream rows
        .fromTo(
          ".skills-marquee",
          { y: 25, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" },
          "-=0.25",
        )
        // 3. Telemetry divider
        .fromTo(
          ".skills-divider",
          { scaleX: 0.8, opacity: 0 },
          { scaleX: 1, opacity: 1, duration: 0.45, ease: "power2.out" },
          "-=0.3",
        )
        // 4. 4 Architectural Pillar Cards (Staggered spring)
        .fromTo(
          ".skills-pillar-card",
          { y: 35, opacity: 0, scale: 0.95 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.5,
            stagger: 0.09,
            ease: "back.out(1.2)",
          },
          "-=0.2",
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Flatten skills for rows
  const row1Skills = [
    ...skillCategories[0].skills,
    ...skillCategories[1].skills,
  ]; // Languages + Frameworks
  const row2Skills = [
    ...skillCategories[2].skills,
    ...skillCategories[3].skills,
  ]; // Databases + Tools

  return (
    <section
      ref={sectionRef}
      className="min-h-screen flex flex-col justify-center bg-space-white dark:bg-space-dark relative overflow-hidden py-16 sm:py-20 md:py-28 transition-colors duration-300"
    >
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.05)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="container mx-auto relative z-10 w-full px-4 max-w-7xl">
        {/* Section Header */}
        <SkillsHeader />

        {/* Top Infinite Marquee Stream */}
        <SkillsMarquee row1Skills={row1Skills} row2Skills={row2Skills} />

        {/* Section Telemetry Divider */}
        <SkillsTelemetryDivider totalSkillCount={totalSkillCount} />

        {/* 4 Architectural Pillar Cards */}
        <SkillsPillars categories={skillCategories} />
      </div>
    </section>
  );
};

export default Skills;
