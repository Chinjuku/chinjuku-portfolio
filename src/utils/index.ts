import { useNavigate, useLocation } from "react-router-dom";

export const useNavClick = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleNavClick = (href: string) => {
        if (location.pathname !== '/') {
            navigate('/');
            // Wait for navigation then scroll
            setTimeout(() => {
                const element = document.querySelector(href);
                if (element) element.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        } else {
            const element = document.querySelector(href);
            if (element) element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return handleNavClick;
};