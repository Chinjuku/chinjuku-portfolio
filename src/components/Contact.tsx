import React from 'react';
import { Mail, Github, Linkedin, FileText, ArrowUpRight, Phone } from 'lucide-react';
import resumePdf from '../assets/resume.pdf';

const Contact: React.FC = () => {
    return (
        <section className="flex items-center justify-center bg-space-white dark:bg-space-black relative overflow-hidden py-24 transition-colors duration-300">
            {/* Background Stars */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-soft-light"></div>
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-starlight-blue/10 via-transparent to-transparent opacity-50" />
            <div className="container mx-auto px-6 text-center relative z-10">

                <h2 className="text-nebula-purple dark:text-nebula-glow font-medium tracking-widest uppercase mb-4">Hail Frequencies Open</h2>
                <h3 className="text-4xl md:text-6xl font-bold text-space-black dark:text-white mb-12">Let's Build the Future</h3>

                <div className="flex flex-wrap justify-center gap-6 md:gap-12 mb-20">
                    <a href="mailto:chinatipwuu@gmail.com" className="group flex items-center gap-2 text-2xl md:text-3xl font-bold text-gray-500 dark:text-gray-400 hover:text-space-black dark:hover:text-white transition-colors">
                        <Mail className="w-6 h-6 md:w-8 md:h-8 group-hover:text-nebula-purple transition-colors" />
                        <span>chinatipwuu@gmail.com</span>
                        <ArrowUpRight className="w-5 h-5 opacity-0 group-hover:opacity-100 group-hover:-translate-y-1 group-hover:translate-x-1 transition-all" />
                    </a>

                    <a href="https://github.com/Chinjuku" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-2 text-2xl md:text-3xl font-bold text-gray-500 dark:text-gray-400 hover:text-space-black dark:hover:text-white transition-colors">
                        <Github className="w-6 h-6 md:w-8 md:h-8 group-hover:text-space-black dark:group-hover:text-white transition-colors" />
                        <span>GitHub</span>
                        <ArrowUpRight className="w-5 h-5 opacity-0 group-hover:opacity-100 group-hover:-translate-y-1 group-hover:translate-x-1 transition-all" />
                    </a>

                    <a href="#" className="group flex items-center gap-2 text-2xl md:text-3xl font-bold text-gray-500 dark:text-gray-400 hover:text-space-black dark:hover:text-white transition-colors">
                        <Linkedin className="w-6 h-6 md:w-8 md:h-8 group-hover:text-starlight-blue transition-colors" />
                        <span>LinkedIn</span>
                        <ArrowUpRight className="w-5 h-5 opacity-0 group-hover:opacity-100 group-hover:-translate-y-1 group-hover:translate-x-1 transition-all" />
                    </a>

                    <a href={resumePdf} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-2 text-2xl md:text-3xl font-bold text-gray-500 dark:text-gray-400 hover:text-space-black dark:hover:text-white transition-colors">
                        <FileText className="w-6 h-6 md:w-8 md:h-8 group-hover:text-starlight-cyan transition-colors" />
                        <span>Resume</span>
                        <ArrowUpRight className="w-5 h-5 opacity-0 group-hover:opacity-100 group-hover:-translate-y-1 group-hover:translate-x-1 transition-all" />
                    </a>

                    <a href="tel:0885959868" className="group flex items-center gap-2 text-2xl md:text-3xl font-bold text-gray-500 dark:text-gray-400 hover:text-space-black dark:hover:text-white transition-colors">
                        <Phone className="w-6 h-6 md:w-8 md:h-8 group-hover:text-green-500 transition-colors" />
                        <span>088-5959-868</span>
                        <ArrowUpRight className="w-5 h-5 opacity-0 group-hover:opacity-100 group-hover:-translate-y-1 group-hover:translate-x-1 transition-all" />
                    </a>
                </div>

                <footer className="border-t border-gray-200 dark:border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between text-gray-500 text-sm">
                    <p>© 2024 Chinjuku. All rights reserved.</p>
                    <p className="flex items-center gap-1 mt-2 md:mt-0">
                        Built with <span className="text-space-black dark:text-white">React</span> & <span className="text-nebula-purple">Stardust</span>
                    </p>
                </footer>

            </div>
        </section>
    );
};

export default Contact;
