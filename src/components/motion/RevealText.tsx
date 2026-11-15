import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePrefersReducedMotion } from "./useMotionPrefs";

gsap.registerPlugin(ScrollTrigger);

type Tag = "h1" | "h2" | "h3" | "p" | "span";

interface RevealTextProps {
  text: string;
  as?: Tag;
  className?: string;
  /** words to render with the gradient-text treatment */
  accentWords?: string[];
  accentClassName?: string;
  delay?: number;
}

/** Headline that rises in word by word from behind a mask when it scrolls into view. */
export const RevealText: React.FC<RevealTextProps> = ({
  text,
  as: Tag = "h2",
  className = "",
  accentWords = [],
  accentClassName = "sci-fi-gradient-text",
  delay = 0,
}) => {
  const ref = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced || !ref.current) return;
    const ctx = gsap.context(() => {
      gsap.from(".reveal-word", {
        yPercent: 115,
        rotate: 3,
        duration: 1,
        ease: "power4.out",
        stagger: 0.045,
        delay,
        scrollTrigger: { trigger: ref.current, start: "top 85%", once: true },
      });
    }, ref);
    return () => ctx.revert();
  }, [reduced, delay, text]);

  const words = text.split(" ");
  return (
    <Tag ref={ref as React.Ref<never>} className={className} aria-label={text}>
      {words.map((w, i) => (
        <React.Fragment key={`${w}-${i}`}>
          <span aria-hidden="true" className="inline-block overflow-hidden pb-[0.12em] align-bottom -mb-[0.12em]">
            <span
              className={`reveal-word inline-block origin-bottom-left ${
                accentWords.includes(w) ? accentClassName : ""
              }`}
            >
              {w}
            </span>
          </span>
          {i < words.length - 1 && " "}
        </React.Fragment>
      ))}
    </Tag>
  );
};
