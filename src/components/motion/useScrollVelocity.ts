import { useEffect, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePrefersReducedMotion } from "./useMotionPrefs";

gsap.registerPlugin(ScrollTrigger);

/**
 * Makes CSS-animated marquee rows inside `scope` react to scroll speed:
 * they skew with the scroll and briefly run faster, then settle.
 */
export const useScrollVelocityMarquee = (scope: RefObject<HTMLElement | null>, selector: string) => {
  const reduced = usePrefersReducedMotion();
  useEffect(() => {
    const root = scope.current;
    if (!root || reduced) return;
    const rows = Array.from(root.querySelectorAll<HTMLElement>(selector));
    if (!rows.length) return;
    const setSkew = gsap.quickSetter(rows, "skewX", "deg");
    const clamp = gsap.utils.clamp(-8, 8);
    const proxy = { skew: 0, rate: 1 };
    const apply = () => {
      setSkew(proxy.skew);
      rows.forEach((r) =>
        r.getAnimations({ subtree: true }).forEach((a) => {
          a.playbackRate = proxy.rate;
        }),
      );
    };
    // standard GSAP velocity pattern: jump to the new peak, then ease back to rest
    const st = ScrollTrigger.create({
      trigger: root,
      start: "top bottom",
      end: "bottom top",
      onUpdate: (self) => {
        const v = self.getVelocity();
        const skew = clamp(v / -300);
        if (Math.abs(skew) > Math.abs(proxy.skew)) {
          proxy.skew = skew;
          proxy.rate = 1 + Math.min(Math.abs(v) / 700, 4);
          gsap.to(proxy, {
            skew: 0,
            rate: 1,
            duration: 0.9,
            ease: "power3.out",
            overwrite: true,
            onUpdate: apply,
          });
        }
      },
    });
    return () => {
      st.kill();
      gsap.killTweensOf(proxy);
      rows.forEach((r) => gsap.set(r, { clearProps: "transform" }));
    };
  }, [scope, selector, reduced]);
};
