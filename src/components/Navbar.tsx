import React, { useState, useEffect } from 'react';
import { Menu, X, Rocket, Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useLocation, useNavigate } from 'react-router-dom';
import resumePdf from '../assets/resume.pdf';

const Navbar: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { theme, setTheme } = useTheme();
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Mission', href: '#hero' },
        { name: 'Arsenal', href: '#skills' },
        { name: 'Projects', href: '#projects' },
        { name: 'Log', href: '#experience' },
        { name: 'Profile', href: '#about' },
        { name: 'Contact', href: '#contact' },
    ];

    const handleOpenResume = () => {
        window.open(resumePdf, '_blank');
    };

    const toggleTheme = () => {
        if (theme === 'light') setTheme('dark');
        else if (theme === 'dark') setTheme('system');
        else setTheme('light');
    };

    const handleNavClick = (href: string) => {
        setIsOpen(false);
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

    const ThemeIcon = () => {
        if (theme === 'light') return <Sun className="w-5 h-5" />;
        if (theme === 'dark') return <Moon className="w-5 h-5" />;
        return <Monitor className="w-5 h-5" />;
    };

    return (
        <>
            <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? 'py-4 bg-space-white/80 dark:bg-space-black/80 backdrop-blur-md border-b border-gray-200 dark:border-white/10 shadow-sm' : 'py-6 bg-transparent'}`}>
                <div className="container mx-auto px-6 flex items-center justify-between">

                    {/* Logo */}
                    <button onClick={() => handleNavClick('#hero')} className="flex items-center gap-2 group z-50">
                        <div className="p-2 bg-nebula-purple rounded-lg group-hover:rotate-12 transition-transform duration-300">
                            <Rocket className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-lg md:text-xl font-bold tracking-wider text-space-black dark:text-white">CHINJUKU</span>
                    </button>

                    {/* Desktop Menu */}
                    <div className="hidden lg:flex items-center gap-4 lg:gap-8">
                        <div className="flex items-center gap-3 lg:gap-6">
                            {navLinks.map((link) => (
                                <button
                                    key={link.name}
                                    onClick={() => handleNavClick(link.href)}
                                    className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-nebula-purple dark:hover:text-nebula-glow transition-colors uppercase tracking-widest"
                                >
                                    {link.name}
                                </button>
                            ))}
                        </div>

                        <div className="h-6 w-px bg-gray-300 dark:bg-white/20" />

                        <button
                            onClick={handleOpenResume}
                            className="px-5 py-2 bg-space-black/5 dark:bg-white/10 hover:bg-space-black/10 dark:hover:bg-white/20 border border-gray-200 dark:border-white/10 rounded-full text-sm font-medium transition-all text-space-black dark:text-white"
                        >
                            Resume
                        </button>

                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-full bg-space-black/5 dark:bg-white/5 hover:bg-space-black/10 dark:hover:bg-white/10 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:text-space-black dark:hover:text-white transition-colors"
                            aria-label="Toggle Theme"
                        >
                            <ThemeIcon />
                        </button>
                    </div>

                    {/* Mobile Toggle */}
                    <div className="flex items-center gap-4 lg:hidden z-50">
                        <button
                            onClick={toggleTheme}
                            className="p-2 text-gray-600 dark:text-gray-300 hover:text-space-black dark:hover:text-white"
                        >
                            <ThemeIcon />
                        </button>
                        <button
                            className="text-space-black dark:text-white p-2"
                            onClick={() => setIsOpen(!isOpen)}
                        >
                            {isOpen ? <X /> : <Menu />}
                        </button>
                    </div>

                </div>
            </nav>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="fixed inset-0 bg-space-white dark:bg-space-black z-40 flex flex-col items-center justify-center gap-8 lg:hidden pt-24">
                    {navLinks.map((link) => (
                        <button
                            key={link.name}
                            onClick={() => handleNavClick(link.href)}
                            className="text-2xl font-bold text-space-black dark:text-white hover:text-nebula-purple dark:hover:text-nebula-glow transition-colors uppercase tracking-widest"
                        >
                            {link.name}
                        </button>
                    ))}
                    <button
                        onClick={handleOpenResume}
                        className="px-8 py-3 bg-white/10 border border-white/10 rounded-full text-lg font-medium text-white"
                    >
                        Resume
                    </button>
                </div>
            )}
        </>
    );
};

export default Navbar;
