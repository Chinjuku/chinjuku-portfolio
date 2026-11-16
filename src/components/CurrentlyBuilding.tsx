import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CURRENTLY_BUILDING } from "../constants/currentlyBuilding";
import Container from "./common/Container";
import { BuildCard } from "./currently-building";

gsap.registerPlugin(ScrollTrigger);

/** "Currently building": what is in progress right now, between shipped work and activity. */
const CurrentlyBuilding: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { updated, items, interests } = CURRENTLY_BUILDING;

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: sectionRef.current, start: "top 75%", toggleActions: "play none none none" },
      });
      tl.fromTo(".now-head > *", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.06, ease: "power3.out" })
        .fromTo(".now-card", { y: 35, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: "power3.out" }, "-=0.3");
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} aria-labelledby="now-title" className="bg-core-obsidian py-24 md:py-32">
      <Container>
        <div className="now-head flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-mono text-[11px] tracking-[0.3em] text-core-icy">NOW</p>
            <h2 id="now-title" className="mt-4 text-4xl font-semibold tracking-[-0.03em] text-core-ink md:text-6xl">
              Currently building
            </h2>
          </div>
          <p className="font-mono text-[11px] tracking-[0.2em] text-core-mist">UPDATED {updated.toUpperCase()}</p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {items.map((item) => (
            <BuildCard key={item.slug} item={item} />
          ))}
        </div>

        <div className="now-head mt-10 flex flex-wrap items-center gap-3 border-t border-core-graphite pt-6">
          <span className="font-mono text-[11px] tracking-[0.2em] text-core-mist">INTERESTED IN</span>
          {interests.map((t) => (
            <span key={t} className="rounded-full border border-white/10 px-3 py-1 text-sm text-core-chrome">
              {t}
            </span>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default CurrentlyBuilding;
