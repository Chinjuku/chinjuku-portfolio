import { useNavigate, useLocation } from "react-router-dom";
import { useCallback } from "react";

/**
 * Custom hook providing robust cross-route and in-page smooth navigation
 */
export const useNavClick = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleNavClick = useCallback((href: string) => {
        // Direct route navigation (e.g. "/projects")
        if (href.startsWith('/')) {
            if (location.pathname !== href) {
                navigate(href);
            } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
            return;
        }

        // Anchor navigation (e.g. "#hero", "#skills")
        if (location.pathname !== '/') {
            navigate('/');
            // Wait for navigation DOM commit then smooth scroll
            setTimeout(() => {
                const element = document.querySelector(href);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                }
            }, 120);
        } else {
            const element = document.querySelector(href);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }, [location.pathname, navigate]);

    return handleNavClick;
};
