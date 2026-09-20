import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { useNavClick } from '../hooks';

const ScrollToTop: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);
    const handleNavClick = useNavClick();

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.scrollY > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', toggleVisibility, { passive: true });

        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    return (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
            {isVisible && (
                <button
                    onClick={() => handleNavClick('#hero')}
                    className="p-3 rounded-full bg-gradient-to-r from-nebula-purple to-starlight-blue hover:from-nebula-glow hover:to-starlight-cyan text-white shadow-xl shadow-nebula-purple/40 transition-all duration-300 animate-bounce pointer-events-auto cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-starlight-cyan"
                    aria-label="Scroll to top"
                >
                    <ArrowUp className="w-6 h-6" />
                </button>
            )}
        </div>
    );
};

export default ScrollToTop;
