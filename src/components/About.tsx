import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight } from "lucide-react";
import portrait from "../assets/profile-tech-cartoon.png";
import { ABOUT_COPY, ABOUT_FACTS } from "../constants/about";
import { useNavClick } from "../hooks";
import { Magnetic, RevealText, TiltCard, usePrefersReducedMotion } from "./motion";
import Container from "./common/Container";

gsap.registerPlugin(ScrollTrigger);

/** About: a real portrait, a two-line statement, two sentences and four facts. */
const About: React.FC = () => {
  const containerRef = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();
  const handleNavClick = useNavClick();

  useEffect(() => {
    if (reduced) return;
    const ctx = gsap.context(() => {
      // portrait: three glass layers slide away (the hero's layers, opened up)
      const reveal = gsap.timeline({
        scrollTrigger: { trigger: ".about-portrait", start: "top 75%", once: true },
      });
      reveal
        .fromTo(".about-portrait", { scale: 1.06 }, { scale: 1, duration: 1.4, ease: "power3.out" }, 0)
        .fromTo(
          ".about-shard",
          { xPercent: 0, opacity: 1 },
          {
            xPercent: (i: number) => (i % 2 === 0 ? -105 : 105),
            opacity: 0.4,
            duration: 1,
            stagger: 0.12,
            ease: "power3.inOut",
          },
          0.15,
        )
        .set(".about-shard", { autoAlpha: 0 });

      // fact rows: a rule sweeps across, flashes icy, then the text lands
      gsap.utils.toArray<HTMLElement>(".about-fact").forEach((row, i) => {
        const tl = gsap.timeline({
          scrollTrigger: { trigger: row, start: "top 90%", once: true },
          delay: i * 0.08,
        });
        tl.fromTo(
          row.querySelector(".about-rule"),
          { scaleX: 0, backgroundColor: "#8abfff" },
          { scaleX: 1, duration: 0.7, ease: "power3.inOut" },
        )
          .to(row.querySelector(".about-rule"), { backgroundColor: "#222B39", duration: 0.6 }, ">-0.1")
          .fromTo(
            row.querySelectorAll("dt, dd"),
            { y: 10, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.5, stagger: 0.06, ease: "power3.out" },
            0.35,
          );
      });
      // the photo drifts inside its frame as the section scrolls
      gsap.fromTo(
        ".about-portrait img",
        { yPercent: -6 },
        {
          yPercent: 6,
          ease: "none",
          scrollTrigger: { trigger: containerRef.current, start: "top bottom", end: "bottom top", scrub: true },
        },
      );
      gsap.from(".about-bio p, .about-actions", {
        y: 18,
        opacity: 0,
        duration: 0.7,
        stagger: 0.07,
        ease: "power3.out",
        scrollTrigger: { trigger: ".about-bio", start: "top 85%", once: true },
      });
    }, containerRef);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      ref={containerRef}
      className="relative overflow-hidden bg-core-obsidian py-28 md:py-36"
    >
      <Container className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
        {/* portrait */}
        <div className="lg:col-span-5">
          <TiltCard max={5} className="mx-auto max-w-sm rounded-[28px] md:max-w-md lg:max-w-none">
            <figure className="about-portrait relative aspect-[4/5] overflow-hidden rounded-[28px] border border-white/10">
              <img
                src={portrait}
                alt={`${ABOUT_COPY.name}, smiling, in front of a dark studio backdrop`}
                loading="lazy"
                className="h-[112%] w-full -translate-y-[6%] object-cover saturate-[0.85] transition-[filter] duration-700 group-hover/tilt:saturate-100"
              />
              {/* icy rim light + fade for the caption */}
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_80%_at_100%_0%,rgba(138,191,255,0.18),transparent_55%)]" />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-core-obsidian/90 to-transparent" />
              <figcaption className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-3">
                <span>
                  <span className="block text-base font-medium text-core-ink">{ABOUT_COPY.name}</span>
                  <span className="mt-0.5 block font-mono text-[10px] tracking-[0.2em] text-core-mist">
                    {ABOUT_COPY.location.toUpperCase()}
                  </span>
                </span>
                <span className="flex items-center gap-1.5 rounded-full border border-white/10 bg-core-obsidian/60 px-2.5 py-1 font-mono text-[10px] tracking-[0.15em] text-core-chrome backdrop-blur-md">
                  <span className="h-1.5 w-1.5 rounded-full bg-core-icy" />
                  FULL-STACK × AI
                </span>
              </figcaption>
              {/* glass layers that slide away on reveal (hidden for reduced motion) */}
              {!reduced && (
                <div aria-hidden="true" className="pointer-events-none absolute inset-0 grid grid-rows-3">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="about-shard border-y border-white/10 bg-core-obsidian/70 backdrop-blur-xl [background-image:linear-gradient(110deg,transparent_30%,rgba(138,191,255,0.12)_50%,transparent_70%)]"
                    />
                  ))}
                </div>
              )}
            </figure>
          </TiltCard>
        </div>

        {/* statement + facts */}
        <div className="lg:col-span-7">
          <p className="font-mono text-[11px] tracking-[0.3em] text-core-icy">{ABOUT_COPY.eyebrow}</p>
          <h2 className="mt-5 text-[clamp(40px,5.2vw,80px)] font-semibold leading-[0.98] tracking-[-0.04em] text-core-ink">
            <RevealText as="span" className="block" text={ABOUT_COPY.headlineLines[0]} />
            <RevealText
              as="span"
              className="block"
              text={ABOUT_COPY.headlineLines[1]}
              accentWords={["AI", "where", "it", "helps."]}
              delay={0.12}
            />
          </h2>

          <div className="about-bio mt-8 max-w-[52ch] space-y-3 text-base leading-relaxed text-core-mist md:text-lg">
            {ABOUT_COPY.bio.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>

          <dl className="mt-10 border-t border-core-graphite">
            {ABOUT_FACTS.map((f) => (
              <div
                key={f.label}
                className="about-fact relative grid grid-cols-[7.5rem_1fr] gap-4 py-3.5 sm:grid-cols-[9rem_1fr]"
              >
                <span aria-hidden="true" className="about-rule absolute inset-x-0 bottom-0 h-px origin-left bg-core-graphite" />
                <dt className="pt-0.5 font-mono text-[10px] tracking-[0.2em] text-core-mist">{f.label}</dt>
                <dd className="text-sm text-core-ink md:text-[15px]">{f.value}</dd>
              </div>
            ))}
          </dl>

          <div className="about-actions mt-10 flex flex-wrap items-center gap-3">
            <Magnetic strength={0.25}>
              <a
                href="/#projects"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick("#projects");
                }}
                className="sci-fi-btn-primary group"
              >
                See the work
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
            </Magnetic>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default About;
