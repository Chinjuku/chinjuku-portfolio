import { useState, useEffect } from 'react';

interface UseActiveSectionOptions {
    /**
     * Offset factor from top of viewport (0.0 to 1.0) to determine active section.
     * @default 0.35
     */
    offsetFactor?: number;
}

/**
 * Custom hook to detect the currently active section in the viewport.
 * Uses requestAnimationFrame and getBoundingClientRect to ensure 100% accuracy
 * even when sections are pinned or animated by GSAP ScrollTrigger.
 */
export const useActiveSection = (
    sectionIds: string[],
    options: UseActiveSectionOptions = {}
): string => {
    const { offsetFactor = 0.35 } = options;
    const [activeSection, setActiveSection] = useState<string>(sectionIds[0] || '');

    useEffect(() => {
        if (!sectionIds.length) return;

        let ticking = false;

        const checkActiveSection = () => {
            const viewportThreshold = window.innerHeight * offsetFactor;
            let currentId = activeSection;

            // Check if user is scrolled to the very bottom of the page
            const isBottom =
                window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 60;

            if (isBottom) {
                // If at bottom, activate the last section (typically Contact)
                const lastId = sectionIds[sectionIds.length - 1];
                if (lastId) {
                    setActiveSection(lastId);
                    ticking = false;
                    return;
                }
            }

            // Iterate through sections to find the one intersecting the threshold
            for (let i = 0; i < sectionIds.length; i++) {
                const id = sectionIds[i];
                const element = document.getElementById(id);

                if (element) {
                    const rect = element.getBoundingClientRect();
                    // If the section's top is above or near the threshold line
                    // and the section's bottom is still below the threshold line
                    if (rect.top <= viewportThreshold && rect.bottom >= viewportThreshold) {
                        currentId = id;
                        break;
                    }
                }
            }

            // Fallback for top of page
            if (window.scrollY < 100 && sectionIds.length > 0) {
                currentId = sectionIds[0];
            }

            setActiveSection(currentId);
            ticking = false;
        };

        const handleScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(checkActiveSection);
                ticking = true;
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('resize', handleScroll, { passive: true });

        // Initial check
        checkActiveSection();

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleScroll);
        };
    }, [sectionIds, offsetFactor]);

    return activeSection;
};
