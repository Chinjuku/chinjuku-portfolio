import { useEffect, useState } from "react";

/**
 * Floating UI that gets out of the way: hidden while the user scrolls down
 * (reading, about to tap something), shown again when they scroll up,
 * and hidden near the bottom of the page so it never covers the footer.
 */
export const useAutoHide = ({ bottomGap = 160 } = {}): boolean => {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;
    let raf = 0;

    const update = () => {
      raf = 0;
      const y = window.scrollY;
      const atBottom = window.innerHeight + y >= document.documentElement.scrollHeight - bottomGap;
      if (atBottom || (y > lastY + 4 && y > 120)) setHidden(true);
      else if (y < lastY - 4) setHidden(false);
      lastY = y;
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [bottomGap]);

  return hidden;
};
