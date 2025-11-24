import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { useNavClick } from '../utils';

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

        window.addEventListener('scroll', toggleVisibility);

        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    return (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50">
            {isVisible && (
                <button
                    onClick={() => handleNavClick('#hero')}
                    className="p-3 rounded-full bg-nebula-purple hover:bg-nebula-glow text-white shadow-lg transition-all duration-300 animate-bounce"
                    aria-label="Scroll to top"
                >
                    <ArrowUp className="w-6 h-6" />
                </button>
            )}
        </div>
    );
};

export default ScrollToTop;
