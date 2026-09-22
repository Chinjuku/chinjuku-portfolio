export interface TechSatellite {
  label: string;
  sublabel: string;
  icon: string;
  darkInvert?: boolean;
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  accentColor: string;
  floatDelay: number;
  floatDuration: number;
}

export const techSatellites: TechSatellite[] = [
  {
    label: "React / Next.js",
    sublabel: "Reactive UI",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
    top: "2%",
    left: "2%",
    accentColor: "border-cyan-500/40 text-starlight-cyan shadow-cyan-500/10",
    floatDelay: 0,
    floatDuration: 2.8,
  },
  {
    label: "TypeScript",
    sublabel: "Typed Systems",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
    top: "2%",
    right: "2%",
    accentColor: "border-blue-500/40 text-starlight-blue shadow-blue-500/10",
    floatDelay: 0.5,
    floatDuration: 3.2,
  },
  {
    label: "Node / APIs",
    sublabel: "Microservices",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
    top: "44%",
    right: "-2%",
    accentColor:
      "border-emerald-500/40 text-emerald-500 dark:text-emerald-400 shadow-emerald-500/10",
    floatDelay: 0.2,
    floatDuration: 3.0,
  },
  {
    label: "PostgreSQL",
    sublabel: "Relational DB",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg",
    bottom: "4%",
    right: "3%",
    accentColor: "border-purple-500/40 text-nebula-purple shadow-purple-500/10",
    floatDelay: 0.7,
    floatDuration: 2.6,
  },
  {
    label: "Tailwind CSS",
    sublabel: "Design Tokens",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg",
    bottom: "4%",
    left: "3%",
    accentColor:
      "border-sky-500/40 text-sky-500 dark:text-sky-400 shadow-sky-500/10",
    floatDelay: 0.4,
    floatDuration: 3.4,
  },
  {
    label: "Docker & Cloud",
    sublabel: "Deployment",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg",
    top: "44%",
    left: "-2%",
    accentColor: "border-cyan-500/40 text-starlight-cyan shadow-cyan-500/10",
    floatDelay: 0.9,
    floatDuration: 2.9,
  },
];
