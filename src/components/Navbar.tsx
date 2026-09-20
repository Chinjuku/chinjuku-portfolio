import React, { useState, useEffect, useMemo } from 'react';
import { Menu, X, Rocket, Sun, Moon, Monitor } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useActiveSection, useNavClick } from '../hooks';
import resumePdf from '../assets/resume.pdf';

const getThemeIcon = (theme: string) => {
    if (theme === 'light') return <Sun className="w-4 h-4 text-amber-400" />;
    if (theme === 'dark') return <Moon className="w-4 h-4 text-starlight-cyan" />;
    return <Monitor className="w-4 h-4 text-nebula-glow" />;
};

const Navbar: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { theme, setTheme } = useTheme();
    const location = useLocation();
    const handleNavClick = useNavClick();

    const isArchivePage = location.pathname === '/projects';

    const navLinks = useMemo(
        () => [
            { name: 'Mission', href: '#hero' },
            { name: 'Skills', href: '#skills' },
            { name: 'Projects', href: '#projects' },
            { name: 'Activity', href: '#activity' },
            { name: 'Log', href: '#experience' },
            { name: 'Profile', href: '#about' },
            { name: 'Contact', href: '#contact' },
            { name: 'Archives', href: '/projects', isRoute: true },
        ],
        []
    );

    const sectionIds = useMemo(
        () => navLinks.filter((l) => !l.isRoute).map((l) => l.href.replace('#', '')),
        [navLinks]
    );

    const activeSection = useActiveSection(sectionIds, { offsetFactor: 0.35 });

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 40);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleOpenResume = () => {
        window.open(resumePdf, '_blank');
    };

    const toggleTheme = () => {
        if (theme === 'light') setTheme('dark');
        else if (theme === 'dark') setTheme('system');
        else setTheme('light');
    };

    const onLinkClick = (href: string) => {
        setIsOpen(false);
        handleNavClick(href);
    };

    return (
        <header className="fixed top-4 sm:top-5 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-6xl select-none transition-all duration-300">
            {/* Floating Glassmorphic Capsule Navbar */}
            <nav
                className={`w-full rounded-full px-4 sm:px-6 py-2 sm:py-2.5 transition-all duration-300 flex items-center justify-between border ${
                    scrolled
                        ? 'bg-white/90 dark:bg-space-black/90 backdrop-blur-2xl border-nebula-purple/30 dark:border-starlight-cyan/40 shadow-[0_14px_35px_rgba(0,0,0,0.12)] dark:shadow-[0_16px_40px_rgba(0,0,0,0.85)] ring-1 ring-black/5 dark:ring-white/10'
                        : 'bg-white/80 dark:bg-space-black/75 backdrop-blur-xl border-gray-200/80 dark:border-white/20 shadow-[0_10px_30px_rgba(0,0,0,0.06)] dark:shadow-[0_12px_36px_rgba(0,0,0,0.7)]'
                }`}
                aria-label="Main Navigation"
            >
                {/* Logo */}
                <button
                    onClick={() => onLinkClick('#hero')}
                    className="flex items-center gap-2.5 group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-nebula-purple/50 rounded-full py-1 pr-2"
                    title="Chinjuku Mission Control"
                >
                    <div className="p-2 rounded-full bg-gradient-to-tr from-nebula-purple to-starlight-cyan group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 shadow-md shadow-nebula-purple/40">
                        <Rocket className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-base sm:text-lg font-extrabold tracking-widest text-space-black dark:text-white group-hover:text-nebula-purple dark:group-hover:text-starlight-cyan transition-colors">
                        CHINJUKU
                    </span>
                </button>

                {/* Desktop Nav Items with Active Scroll Spy Highlighting */}
                <div className="hidden lg:flex items-center gap-1 xl:gap-1.5">
                    {navLinks.map((link) => {
                        const sectionId = link.href.replace('#', '');
                        const isActive = link.isRoute
                            ? isArchivePage
                            : !isArchivePage && activeSection === sectionId;

                        return (
                            <button
                                key={link.name}
                                onClick={() => onLinkClick(link.href)}
                                aria-current={isActive ? 'page' : undefined}
                                className={`relative px-3.5 py-1.5 rounded-full text-xs font-mono font-medium transition-all duration-300 uppercase tracking-wider cursor-pointer flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nebula-purple/50 ${
                                    isActive
                                        ? 'bg-gradient-to-r from-nebula-purple/15 to-starlight-cyan/15 dark:from-nebula-glow/25 dark:to-starlight-cyan/25 text-nebula-purple dark:text-starlight-cyan font-bold border border-nebula-purple/35 dark:border-starlight-cyan/40 shadow-[0_0_15px_rgba(124,58,237,0.2)]'
                                        : 'text-gray-600 dark:text-gray-300 hover:text-space-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 border border-transparent'
                                }`}
                            >
                                {isActive && (
                                    <span className="w-1.5 h-1.5 rounded-full bg-nebula-purple dark:bg-starlight-cyan animate-pulse shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
                                )}
                                <span>{link.name}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Right Actions (Resume & Theme) */}
                <div className="hidden lg:flex items-center gap-3">
                    <button
                        onClick={handleOpenResume}
                        className="px-4 py-1.5 rounded-full bg-gradient-to-r from-nebula-purple to-nebula-glow hover:from-nebula-glow hover:to-starlight-blue text-white text-xs font-medium tracking-wider transition-all shadow-md shadow-nebula-purple/30 border border-white/20 hover:scale-105 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nebula-purple/50"
                    >
                        Resume
                    </button>

                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-full bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/15 border border-gray-200 dark:border-white/15 transition-all text-gray-700 dark:text-white hover:scale-110 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nebula-purple/50"
                        aria-label="Toggle Theme"
                        title="Toggle Color Theme"
                    >
                        {getThemeIcon(theme)}
                    </button>
                </div>

                {/* Mobile Hamburger & Theme Toggle */}
                <div className="flex items-center gap-2 lg:hidden">
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-full bg-black/5 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-white focus-visible:outline-none"
                        aria-label="Toggle Theme"
                    >
                        {getThemeIcon(theme)}
                    </button>
                    <button
                        className="p-2 rounded-full bg-black/5 dark:bg-white/10 border border-gray-200 dark:border-white/20 text-gray-700 dark:text-white hover:bg-black/10 dark:hover:bg-white/20 transition-colors focus-visible:outline-none"
                        onClick={() => setIsOpen(!isOpen)}
                        aria-label="Toggle Navigation Menu"
                    >
                        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>
            </nav>

            {/* Mobile Glassmorphic Drawer Dropdown */}
            {isOpen && (
                <div className="mt-3 w-full rounded-3xl bg-white/95 dark:bg-space-black/95 backdrop-blur-2xl border border-gray-200 dark:border-white/20 shadow-2xl p-5 flex flex-col items-center gap-2.5 lg:hidden animate-in fade-in slide-in-from-top-3 duration-200">
                    {navLinks.map((link) => {
                        const sectionId = link.href.replace('#', '');
                        const isActive = link.isRoute
                            ? isArchivePage
                            : !isArchivePage && activeSection === sectionId;

                        return (
                            <button
                                key={link.name}
                                onClick={() => onLinkClick(link.href)}
                                aria-current={isActive ? 'page' : undefined}
                                className={`w-full py-2.5 px-4 rounded-2xl text-center text-sm font-mono uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                                    isActive
                                        ? 'bg-gradient-to-r from-nebula-purple/15 to-starlight-cyan/15 dark:from-nebula-glow/25 dark:to-starlight-cyan/25 text-nebula-purple dark:text-starlight-cyan font-bold border border-nebula-purple/35 dark:border-starlight-cyan/40 shadow-[0_0_12px_rgba(124,58,237,0.2)]'
                                        : 'text-gray-700 dark:text-gray-200 hover:text-space-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10'
                                }`}
                            >
                                {isActive && (
                                    <span className="w-1.5 h-1.5 rounded-full bg-nebula-purple dark:bg-starlight-cyan animate-pulse" />
                                )}
                                <span>{link.name}</span>
                            </button>
                        );
                    })}
                    <div className="w-full h-px bg-gray-200 dark:bg-white/10 my-1" />
                    <button
                        onClick={handleOpenResume}
                        className="w-full py-2.5 rounded-full bg-gradient-to-r from-nebula-purple to-nebula-glow text-white text-sm font-semibold tracking-wider shadow-lg shadow-nebula-purple/40"
                    >
                        View Full Resume
                    </button>
                </div>
            )}
        </header>
    );
};

export default Navbar;

