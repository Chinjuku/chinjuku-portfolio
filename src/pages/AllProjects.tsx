import React, { useState } from 'react';
import { all_projects } from '../data/projects';
import { ArrowLeft, ExternalLink, Github, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const AllProjects: React.FC = () => {
    const [showRepoModal, setShowRepoModal] = useState(false);
    const [selectedRepo, setSelectedRepo] = useState<string | string[] | null>(null);

    const handleRepoClick = (repos: string | string[]) => {
        if (Array.isArray(repos)) {
            setSelectedRepo(repos);
            setShowRepoModal(true);
        } else {
            window.open(repos, '_blank');
        }
    };
    return (
        <div className="min-h-screen bg-space-white dark:bg-space-black transition-colors duration-300 py-24 px-6">
            <div className="container mx-auto">

                {/* Header */}
                <div className="mb-16">
                    <Link to="/" className="inline-flex items-center gap-2 text-nebula-purple dark:text-nebula-glow hover:underline mb-8">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Mission Control
                    </Link>
                    <h1 className="text-4xl md:text-6xl font-bold text-space-black dark:text-white mb-4">Mission Archives</h1>
                    <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl">
                        A complete log of all deployed systems, experimental prototypes, and classified research projects.
                    </p>
                </div>

                {/* Projects Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {all_projects.map((project) => (
                        <div key={project.id} className="group relative bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl overflow-hidden hover:border-nebula-purple/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">

                            {/* Image */}
                            <div className="h-48 overflow-hidden relative">
                                <img
                                    src={project.image}
                                    alt={project.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <span className="text-xs font-mono text-nebula-purple dark:text-nebula-glow uppercase tracking-wider">{project.role}</span>
                                        <h3 className="text-xl font-bold text-space-black dark:text-white mt-1">{project.title}</h3>
                                    </div>
                                </div>

                                <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 line-clamp-3">
                                    {project.description}
                                </p>

                                <div className="flex flex-wrap gap-2 mb-6">
                                    {project.tech.map((t, i) => (
                                        <span key={i} className="px-2 py-1 text-xs bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 rounded">
                                            {t}
                                        </span>
                                    ))}
                                </div>

                                <div className="flex gap-4 mt-auto">
                                    {project.web_url && (
                                        <button
                                            onClick={() => window.open(project.web_url, '_blank')}
                                            className="flex items-center gap-1 text-sm font-medium text-space-black dark:text-white hover:text-nebula-purple dark:hover:text-nebula-glow transition-colors"
                                        >
                                            <ExternalLink className="w-4 h-4" />
                                            Demo
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleRepoClick(project.repos)}
                                        className="flex items-center gap-1 text-sm font-medium text-space-black dark:text-white hover:text-nebula-purple dark:hover:text-nebula-glow transition-colors"
                                    >
                                        <Github className="w-4 h-4" />
                                        Code
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            </div>

            {/* Repo Modal */}
            {showRepoModal && selectedRepo && Array.isArray(selectedRepo) && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-space-black border border-gray-200 dark:border-white/10 rounded-2xl p-6 max-w-sm w-full shadow-2xl relative">
                        <button
                            onClick={() => setShowRepoModal(false)}
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <h3 className="text-xl font-bold text-space-black dark:text-white mb-4">Select Repository</h3>

                        <div className="space-y-3">
                            <a
                                href={selectedRepo[0]}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors group"
                            >
                                <span className="font-medium text-space-black dark:text-white">Frontend Repository</span>
                                <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-nebula-purple transition-colors" />
                            </a>

                            <a
                                href={selectedRepo[1]}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors group"
                            >
                                <span className="font-medium text-space-black dark:text-white">Backend Repository</span>
                                <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-nebula-purple transition-colors" />
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AllProjects;
