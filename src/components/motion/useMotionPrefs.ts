import { useEffect, useState } from "react";

const query = (q: string) => typeof window !== "undefined" && window.matchMedia(q).matches;

/** Live media-query flag. */
const useMedia = (q: string): boolean => {
  const [match, setMatch] = useState(() => query(q));
  useEffect(() => {
    const mq = window.matchMedia(q);
    const on = () => setMatch(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, [q]);
  return match;
};

/** Pointer effects (tilt, magnetic, cursor light) only for a real mouse and motion allowed. */
export const usePointerFx = (): boolean => {
  const fine = useMedia("(hover: hover) and (pointer: fine)");
  const reduced = useMedia("(prefers-reduced-motion: reduce)");
  return fine && !reduced;
};

export const usePrefersReducedMotion = (): boolean => useMedia("(prefers-reduced-motion: reduce)");
