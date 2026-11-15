import { useEffect, useState } from "react";

export const useReducedMotion = (): boolean => {
  const [reduced, setReduced] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
};

export interface Quality {
  dpr: number;
  transmissionRes: number;
  samples: number;
  isLow: boolean;
}

const computeQuality = (): Quality => {
  const isLow =
    window.innerWidth < 768 || (navigator.hardwareConcurrency ?? 8) <= 4;
  return isLow
    ? { dpr: 1.5, transmissionRes: 256, samples: 3, isLow }
    : { dpr: 2, transmissionRes: 384, samples: 4, isLow };
};

export const useQuality = (): Quality => {
  const [quality, setQuality] = useState(computeQuality);
  useEffect(() => {
    const onResize = () => {
      const next = computeQuality();
      setQuality((prev) => (prev.isLow === next.isLow ? prev : next));
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return quality;
};

/** Mobile layout breakpoint used by concept layouts (matches Tailwind md). */
export const useIsMobile = (): boolean => {
  const [mobile, setMobile] = useState(() => window.innerWidth < 768);
  useEffect(() => {
    const onResize = () => setMobile(window.innerWidth < 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return mobile;
};
