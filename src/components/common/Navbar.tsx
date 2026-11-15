import React, { useState, useEffect, useMemo } from "react";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useActiveSection, useNavClick } from "../../hooks";
import resumePdf from "../../assets/resume.pdf";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const handleNavClick = useNavClick();

  const isArchivePage = location.pathname === "/projects";

  const navLinks = useMemo(
    () => [
      { name: "Home", href: "#hero" },
      { name: "Skills", href: "#skills" },
      { name: "Work", href: "#projects" },
      { name: "Activity", href: "#activity" },
      { name: "Experience", href: "#experience" },
      { name: "About", href: "#about" },
      { name: "Contact", href: "#contact" },
      { name: "All Projects", href: "/projects", isRoute: true },
    ],
    [],
  );

  const sectionIds = useMemo(
    () => navLinks.filter((l) => !l.isRoute).map((l) => l.href.replace("#", "")),
    [navLinks],
  );

  const activeSection = useActiveSection(sectionIds, { offsetFactor: 0.35 });

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleOpenResume = () => {
    window.open(resumePdf, "_blank");
  };

  const onLinkClick = (href: string) => {
    setIsOpen(false);
    handleNavClick(href);
  };

  const isLinkActive = (href: string, isRoute?: boolean) =>
    isRoute ? isArchivePage : !isArchivePage && activeSection === href.replace("#", "");

  return (
    <header className="fixed left-1/2 top-4 z-50 w-[95%] max-w-6xl -translate-x-1/2 select-none sm:top-5">
      <nav
        className={`flex w-full items-center justify-between rounded-full border px-4 py-2 backdrop-blur-xl transition-all duration-300 sm:px-5 ${
          scrolled
            ? "border-white/10 bg-core-obsidian/80 shadow-[0_16px_40px_rgba(0,0,0,0.6)]"
            : "border-white/[0.06] bg-core-obsidian/50"
        }`}
        aria-label="Main Navigation"
      >
        <button
          onClick={() => onLinkClick("#hero")}
          className="group flex items-center gap-2.5 rounded-full py-1 pr-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-core-icy/50"
          title="Back to top"
        >
          <span className="relative flex h-6 w-6 items-center justify-center rounded-full border border-core-chrome/40 bg-gradient-to-b from-white/15 to-transparent">
            <span className="h-1.5 w-1.5 rounded-full bg-core-icy shadow-[0_0_8px_rgba(138,191,255,0.9)] transition-transform group-hover:scale-125" />
          </span>
          <span className="font-mono text-xs tracking-[0.3em] text-core-ink">CHINJUKU</span>
        </button>

        {/* Desktop links */}
        <div className="hidden items-center gap-0.5 lg:flex">
          {navLinks.map((link) => {
            const active = isLinkActive(link.href, link.isRoute);
            return (
              <button
                key={link.name}
                onClick={() => onLinkClick(link.href)}
                aria-current={active ? "page" : undefined}
                className={`relative flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-core-icy/50 ${
                  active ? "text-core-ink" : "text-core-mist hover:text-core-ink"
                }`}
              >
                {active && <span className="h-1 w-1 rounded-full bg-core-icy" />}
                {link.name}
              </button>
            );
          })}
        </div>

        <div className="hidden items-center lg:flex">
          <button
            onClick={handleOpenResume}
            className="inline-flex items-center gap-1.5 rounded-full bg-core-chrome px-4 py-1.5 text-xs font-medium text-core-obsidian transition-colors hover:bg-core-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-core-icy/50"
          >
            Resume
            <ArrowUpRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <button
          className="rounded-full border border-white/10 p-2 text-core-ink transition-colors hover:bg-white/10 focus-visible:outline-none lg:hidden"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle navigation menu"
          aria-expanded={isOpen}
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {/* Mobile drawer */}
      {isOpen && (
        <div className="mt-3 flex w-full flex-col gap-1 rounded-3xl border border-white/10 bg-core-obsidian/95 p-4 shadow-2xl backdrop-blur-2xl lg:hidden">
          {navLinks.map((link) => {
            const active = isLinkActive(link.href, link.isRoute);
            return (
              <button
                key={link.name}
                onClick={() => onLinkClick(link.href)}
                aria-current={active ? "page" : undefined}
                className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left text-base transition-colors ${
                  active ? "bg-white/[0.06] text-core-ink" : "text-core-mist hover:text-core-ink"
                }`}
              >
                {link.name}
                {active && <span className="h-1.5 w-1.5 rounded-full bg-core-icy" />}
              </button>
            );
          })}
          <div className="my-2 h-px w-full bg-white/10" />
          <button
            onClick={handleOpenResume}
            className="w-full rounded-full bg-core-chrome py-3 text-sm font-medium text-core-obsidian"
          >
            View Resume
          </button>
        </div>
      )}
    </header>
  );
};

export default Navbar;
