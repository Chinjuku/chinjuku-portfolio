import React from "react";
import { X, ExternalLink } from "lucide-react";

interface RepoModalProps {
  isOpen: boolean;
  repos: string | string[] | null;
  onClose: () => void;
}

const getRepoLabel = (url: string, index: number) => {
  const name = url.split("/").pop()?.toLowerCase() || "";
  if (name.includes("ai") || name.includes("prediction") || name.includes("model")) {
    return "AI Stock Prediction Engine";
  }
  if (name.includes("application") || name.includes("app")) {
    return "Web Application Repository";
  }
  if (name.includes("frontend") || name.includes("client")) {
    return "Frontend Repository";
  }
  if (name.includes("backend") || name.includes("server")) {
    return "Backend Repository";
  }
  return index === 0 ? "Primary Repository" : "Secondary Repository";
};

export const RepoModal: React.FC<RepoModalProps> = ({
  isOpen,
  repos,
  onClose,
}) => {
  if (!isOpen || !repos || !Array.isArray(repos)) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <div className="sci-fi-glass rounded-2xl p-6 max-w-sm w-full relative animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:white transition-colors cursor-pointer"
          aria-label="Close repository modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <span className="w-2 h-2 rounded-full bg-starlight-cyan animate-ping" />
          <h3 className="text-xl font-bold sci-fi-heading">
            Select Repository
          </h3>
        </div>

        <div className="space-y-3">
          {repos.map((url, idx) => (
            <a
              key={url}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 rounded-xl sci-fi-card group"
            >
              <span className="font-medium text-gray-800 dark:text-gray-200 group-hover:text-nebula-purple dark:group-hover:text-starlight-cyan transition-colors">
                {getRepoLabel(url, idx)}
              </span>
              <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-nebula-purple dark:group-hover:text-starlight-cyan transition-colors" />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RepoModal;
