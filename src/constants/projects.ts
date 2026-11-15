export interface Project {
  id: number;
  title: string;
  description: string;
  role: string;
  tech: string[];
  color: string;
  repos: string | string[];
  web_url: string;
  image: string;
  finished_date: string;
}

export const all_projects: Project[] = [
  {
    id: 1,
    title: "FinTax",
    description:
      "A comprehensive FinTech web application integrating personalized financial & tax planning with machine learning-driven investment forecasting. The platform features an interactive fullstack dashboard that connects with a dedicated Python AI service to predict stock trends and evaluate portfolio risk for smarter financial decisions.",
    role: "Fullstack & AI Dev",
    tech: [
      "NextJS",
      "TypeScript",
      "TailwindCSS",
      "Python",
      "FastAPI",
      "Machine Learning",
      "Pandas",
      "MongoDB",
    ],
    color: "from-emerald-400 to-cyan-500",
    repos: [
      "https://github.com/Chinjuku/fintax-application",
      "https://github.com/Chinjuku/fintax-ai-stock-prediction",
    ],
    web_url: "https://fintax-application.vercel.app/",
    image:
      "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=1000&auto=format&fit=crop",
    finished_date: "2026-04-14",
  },
  {
    id: 2,
    title: "TripFlow",
    description:
      "Collaborative trip planner with drag-and-drop boards, Google Maps navigation deep-links, and cron-scheduled reminders. Built with a React PWA frontend, ElysiaJS backend on Bun, Supabase (Postgres + RLS + Realtime), and OCR E-Slip Verification powered by Google Gemini AI.",
    role: "Fullstack Dev",
    tech: [
      "React",
      "TypeScript",
      "ElysiaJS",
      "Bun",
      "Supabase",
      "TailwindCSS",
      "Google Gemini",
    ],
    color: "from-sky-400 to-blue-600",
    repos: "https://github.com/Chinjuku/TripFlow",
    web_url: "",
    image:
      "https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=1000&auto=format&fit=crop",
    finished_date: "2026-05-20",
  },
  {
    id: 3,
    title: "RestaurantEU",
    description:
      "Restaurant Management System. Developed a customer interface for browsing and ordering menu items, with a system to display dish statuses. Implemented an employee login system with access to features such as a dashboard, order preparation, serving, and cashier pages. Used Laravel Framework as the PHP framework that employs the MVC pattern and used MySQL for the database system.",
    role: "Fullstack Dev",
    tech: ["Laravel", "MySQL", "PHP"],
    color: "from-emerald-400 to-teal-600",
    repos: "https://github.com/Chinjuku/RestaurantEU",
    web_url: "",
    image:
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1000&auto=format&fit=crop",
    finished_date: "2024-03-31",
  },
  {
    id: 4,
    title: "Connextra",
    description:
      "Developed a real-time chat application entirely from scratch without frameworks to master the fundamentals of HTTP requests and database management.",
    role: "Fullstack Dev",
    tech: [
      "Typescript",
      "PostgreSQL",
      "Prisma",
      "React+Vite",
      "Nodejs",
      "Socket.io",
    ],
    color: "from-orange-400 to-red-500",
    repos: [
      "https://github.com/Chinjuku/ConnextrA-Client",
      "https://github.com/Chinjuku/ConnextrA-Server",
    ],
    web_url: "",
    image:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop",
    finished_date: "2025-11-05",
  },
  {
    id: 5,
    title: "HongsamutIT",
    description:
      "IT Reserve, a website for booking IT equipment. Developed using PHP, MySQL, HTML, CSS, and JavaScript.",
    role: "Fullstack Dev",
    tech: ["PHP", "MySQL", "HTML", "CSS", "JavaScript"],
    color: "from-purple-500 to-indigo-600",
    repos: "https://github.com/Chinjuku/HongsamutIT",
    web_url: "",
    image:
      "https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=1000&auto=format&fit=crop",
    finished_date: "2023-10-28",
  },
  {
    id: 6,
    title: "PSIT Place",
    description:
      "IT Products E-commerce. An e-commerce system for buying and selling IT equipment where managers can manage products. Developed a backend system using Flask Python and MySQL for database storage. Applied Python, JavaScript, HTML, and CSS for frontend development.",
    role: "Backend Dev",
    tech: ["Flask", "MySQL", "Python"],
    color: "from-orange-400 to-red-500",
    repos: "https://github.com/Chinjuku/PSCP-Project__PSIT-Place__",
    web_url: "",
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1000&auto=format&fit=crop",
    finished_date: "2022-12-16",
  },
  {
    id: 7,
    title: "CareTrack",
    description:
      "Web application developed to improve the quality of life for the elderly, specifically addressing the growing aging population in Thailand. The primary goal is to solve critical issues such as forgetting to take medication, taking incorrect dosages, and missing doctor appointments due to age-related memory decline.",
    role: "Fullstack Dev",
    tech: ["NextJS", "TailwindCSS", "Prisma", "PostgreSQL"],
    color: "from-blue-400 to-cyan-500",
    repos: "https://github.com/Chinjuku/CareTrack",
    web_url: "",
    image:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=1000&auto=format&fit=crop",
    finished_date: "2024-10-15",
  },
  {
    id: 8,
    title: "JACs (Job Application System)",
    description:
      "JACs is a web-based recruitment platform designed to streamline the hiring process for both employers and job seekers. Built on the Django (Python) framework, the system handles the full cycle of recruitment, from job posting to application management.",
    role: "Fullstack Dev",
    tech: ["Django", "PostgreSQL", "HTML", "CSS", "JavaScript", "GoogleMapAPI"],
    color: "from-orange-400 to-red-500",
    repos: "https://github.com/Chinjuku/JACs",
    web_url: "",
    image:
      "https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=1000&auto=format&fit=crop",
    finished_date: "2025-08-08",
  },
  {
    id: 9,
    title: "FinSight",
    description:
      "The platform features a GenAI Stock Chatbot powered by Google Gemini, offering users data-aware market insights. The system also includes a robust Portfolio Management System that supports Core-Satellite strategies, real-time benchmarking against global indices, and historical performance simulation. With features like DCF valuation, multi-currency support (USD/THB), and smart alerts, finSight provides institutional-grade tools for individual investors.",
    role: "Fullstack Dev",
    tech: ["NextJS", "TailwindCSS", "Google Gemini", "FastAPI", "MongoDB"],
    color: "from-blue-400 to-cyan-500",
    repos: "https://github.com/Chinjuku/FinSight",
    web_url: "",
    image:
      "https://images.unsplash.com/photo-1642543492481-44e81e3914a7?q=80&w=1000&auto=format&fit=crop",
    finished_date: "2025-12-16",
  },
  {
    id: 10,
    title: "TicketFlicks",
    description:
      "Movie Ticket Booking and Review System. Included a payment system for booking tickets and a feature for users to favorite and review movies. Designed and developed a user-friendly website utilizing NextJS for the frontend and Django for the backend. Used PostgreSQL as a Relational Database Management System.",
    role: "Fullstack Dev",
    tech: ["Next.js", "Django", "PostgreSQL"],
    color: "from-purple-500 to-indigo-600",
    repos: [
      "https://github.com/Chinjuku/TicketFlicks-Frontend",
      "https://github.com/Chinjuku/TicketFlicks-Backend",
    ],
    web_url: "",
    image:
      "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1000&auto=format&fit=crop",
    finished_date: "2024-06-04",
  },
  {
    id: 11,
    title: "Calendoo Todolist",
    description:
      "Todolist and Project Task List Website. Managed a system that recorded to-do lists and projects to be completed each day. Leveraged a modern UI framework combination of ReactJS, TailwindCSS and DaisyUI to streamline development, enabling a 50% reduction in development time. Used Prisma as Database Services and Typescript as Back-end Services. Used MongoDB for database.",
    role: "Fullstack Dev",
    tech: ["React", "TailwindCSS", "Prisma", "MongoDB"],
    color: "from-blue-400 to-cyan-500",
    repos: "https://github.com/Chinjuku/Calendoo-Todolist",
    web_url: "",
    image:
      "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?q=80&w=1000&auto=format&fit=crop",
    finished_date: "2024-04-27",
  },
  {
    id: 12,
    title: "SmartBIN",
    description:
      "Smart waste management and automated monitoring system utilizing IoT sensors for real-time fill level detection, telemetry reporting, and optimized waste collection scheduling to enhance urban sanitation efficiency.",
    role: "IoT & Embedded Dev",
    tech: ["IoT", "C++", "ESP32", "Arduino", "Sensors", "Hardware"],
    color: "from-emerald-400 to-teal-600",
    repos: "https://github.com/Chinjuku/SmartBIN",
    web_url: "",
    image:
      "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?q=80&w=1000&auto=format&fit=crop",
    finished_date: "2023-12-10",
  },
  {
    id: 13,
    title: "Discovery Piscine (Rush Project)",
    description:
      "Collaborative portfolio and profile showcase web platform built during the 42 Bangkok / KMITL Discovery Piscine (Fun with Coding). Features responsive multi-profile pages, custom typography, CSS grid layouts, and interactive DOM manipulation.",
    role: "Frontend Dev",
    tech: ["HTML", "CSS", "JavaScript", "Responsive Design"],
    color: "from-pink-500 to-rose-600",
    repos:
      "https://github.com/Chinjuku/discovery-piscine-for-kmitl-fun-with-coding-sep-2024-Chinjuku/tree/main/cell04/rush",
    web_url: "",
    image:
      "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1000&auto=format&fit=crop",
    finished_date: "2024-09-14",
  },
  {
    id: 14,
    title: "Inventory Stock (Intern Practice)",
    description:
      "Enterprise inventory and stock management practice system developed during internship to master relational database architectures, item tracking, stock auditing, and fullstack TypeScript service implementations.",
    role: "Fullstack Dev",
    tech: ["TypeScript", "JavaScript", "Node.js", "Express", "PostgreSQL"],
    color: "from-amber-400 to-orange-500",
    repos: "https://github.com/Chinjuku/Inventory-Stock",
    web_url: "",
    image:
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=1000&auto=format&fit=crop",
    finished_date: "2024-11-17",
  },
  {
    id: 15,
    title: "Adorable Miaw",
    description:
      "Interactive Java OOP desktop simulation game featuring multi-threaded cat animations, interactive minigames (Cooking, Cleaning, Typing), state persistence with file serialization, and modular event-driven GUI architecture.",
    role: "Game & Software Dev",
    tech: ["Java", "OOP", "Java Swing", "GUI", "Multithreading"],
    color: "from-amber-400 to-rose-500",
    repos: "https://github.com/Chinjuku/Adorable-Miaw",
    web_url: "",
    image:
      "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=1000&auto=format&fit=crop",
    finished_date: "2024-07-28",
  },
  {
    id: 16,
    title: "Egg-e-egg-egg (Fresh Farm & LINE LIFF)",
    description:
      "Farm-to-table agricultural e-commerce platform and LINE LIFF mini-app connecting local farmers directly with consumers. Features a web storefront, seamless in-chat ordering & checkout via LINE LIFF, LINE Messaging API webhook notifications, and an admin back-office dashboard for inventory and order management.",
    role: "Fullstack Dev",
    tech: [
      "NextJS",
      "React",
      "TypeScript",
      "TailwindCSS",
      "LINE LIFF",
      "LINE Messaging API",
      "Bun",
    ],
    color: "from-amber-400 to-emerald-500",
    repos: "https://github.com/Chinjuku/egg-e-egg-egg",
    web_url: "",
    image:
      "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1000&auto=format&fit=crop",
    finished_date: "2026-10-27",
  },
  {
    id: 17,
    title: "GovBudget Tracking System",
    description:
      "Government budget management and encumbrance accounting system designed to control fiscal allotments, purchase order (PO) obligations, disbursement vouchers, budget returns, and action-plan project tracking. Features real-time budget ledger reporting and automated Excel/PDF document exports.",
    role: "Fullstack Dev",
    tech: [
      "NextJS",
      "TypeScript",
      "Supabase",
      "PostgreSQL",
      "TailwindCSS",
      "TanStack Query",
      "Zod",
    ],
    color: "from-blue-500 to-indigo-600",
    repos: "https://github.com/Chinjuku/GovBudgetTrackingSystem",
    web_url: "",
    image:
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=1000&auto=format&fit=crop",
    finished_date: "2026-10-27",
  },
  {
    id: 18,
    title: "Antigravity Discord Bridge",
    description:
      "Two-way remote control and notification bridge connecting Antigravity AI coding agents with Discord. Enables mobile-first developer workflows with interactive decision buttons, real-time task status embeds, multi-project auto-discovery, and remote CLI command execution (/ai, /review) directly from Discord.",
    role: "Tooling & Backend Dev",
    tech: ["Node.js", "JavaScript", "Discord.js", "Express", "CLI", "REST API"],
    color: "from-indigo-400 to-purple-600",
    repos: "https://github.com/Chinjuku/AntigravityDiscordBridge",
    web_url: "",
    image:
      "https://images.unsplash.com/photo-1614680376593-902f749f7ffc?q=80&w=1000&auto=format&fit=crop",
    finished_date: "2026-10-28",
  },
  {
    id: 19,
    title: "StockPerfNoti",
    description:
      "Zero-cost, serverless US stock screener. A Cloudflare Worker answers a Discord /list slash command and a GitHub Actions job posts a Mon–Fri post-market report, filtering the TradingView scanner by 3-month performance, market cap, SMA50 and dollar volume.",
    role: "Tooling & Backend Dev",
    tech: ["TypeScript", "Cloudflare Workers", "GitHub Actions", "Discord API", "TradingView API"],
    color: "from-emerald-400 to-cyan-600",
    repos: "https://github.com/Chinjuku/StockPerfNoti",
    web_url: "",
    image: "",
    finished_date: "2026-10-28",
  },
  {
    id: 20,
    title: "Lucent Design System",
    description:
      "Minimal-glass design system built on W3C design tokens (Style Dictionary v4) with a 3-tier token hierarchy, layered elevation and accessible Radix-based React components, generated through an AI-agent token and component pipeline.",
    role: "Frontend & Design Systems",
    tech: ["TypeScript", "React", "Radix UI", "Style Dictionary", "TailwindCSS"],
    color: "from-slate-300 to-sky-500",
    repos: "https://github.com/Chinjuku/lucent-design-system",
    web_url: "",
    image: "",
    finished_date: "2026-09-01",
  },
  {
    id: 21,
    title: "TFT Trivia",
    description:
      "Fan-made Teamfight Tactics trivia and guessing game covering every set: four quiz modes (champion, item, trait, which set), attribute-comparison puzzles, challenge links with identical questions for friends, and a daily set. Static site with data pulled from CommunityDragon.",
    role: "Frontend Dev",
    tech: ["React", "TypeScript", "React Router", "Zod"],
    color: "from-amber-400 to-orange-600",
    repos: "https://github.com/Chinjuku/tft-trivia",
    web_url: "https://chinjuku.github.io/tft-trivia/",
    image: "",
    finished_date: "2026-11-12",
  },
  {
    id: 22,
    title: "BeatDrop",
    description:
      "Thai and international song-guessing game from short snippets: reel-style mode, four-choice Song Guesser, daily challenge with leaderboard, plus artist, era and genre modes with Easy to Hard unlock timings.",
    role: "Fullstack Dev",
    tech: ["NextJS", "TypeScript", "React Query", "Upstash Redis", "PostgreSQL", "next-intl"],
    color: "from-fuchsia-400 to-indigo-600",
    repos: "https://github.com/Chinjuku/BeatDrop",
    web_url: "https://beatdrop-self.vercel.app",
    image: "",
    finished_date: "2026-11-15",
  },
  {
    id: 23,
    title: "Sheet2Web Portfolio Tracker",
    description:
      "Investment portfolio tracker that turns spreadsheet holdings into a web dashboard, built with Next.js, Supabase and the Lucent design system, using decimal-safe calculations for positions and returns.",
    role: "Fullstack Dev",
    tech: ["NextJS", "TypeScript", "Supabase", "React Query", "Lucent Design System"],
    color: "from-sky-400 to-blue-600",
    repos: "https://github.com/Chinjuku/sheet2web-portfolio-tracker",
    web_url: "https://sheet-portfolio-tracker.vercel.app",
    image: "",
    finished_date: "2026-11-15",
  },
];

export const projects: Project[] = all_projects.filter(
  (project) => project.id <= 4,
);
