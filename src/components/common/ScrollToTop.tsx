import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * ScrollToTop Component
 * Ensures clean, reliable route transitions in Single Page Application (SPA).
 * - Instantly resets scroll position to top (scrollY = 0) on route change.
 * - Forces GSAP ScrollTrigger to recalculate trigger & pin coordinates accurately.
 * - Respects hash anchors (e.g. /#contact) if navigated with a specific target.
 */
const ScrollToTop: React.FC = () => {
    const { pathname, hash } = useLocation();

    useEffect(() => {
        // If navigating to a specific in-page anchor, smoothly scroll to it
        if (hash) {
            const element = document.querySelector(hash);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
                return;
            }
        }

        // On route change without hash (e.g. "/" -> "/projects"),
        // instantly reset scroll to (0, 0) so the page starts from the very top.
        // Using 'instant' prevents GSAP ScrollTrigger layout calculation glitches.
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

        // Request an animation frame then refresh ScrollTrigger calculations
        requestAnimationFrame(() => {
            ScrollTrigger.refresh();
        });
    }, [pathname, hash]);

    return null;
};

export default ScrollToTop;
