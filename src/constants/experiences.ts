export interface Experience {
  id: number;
  role: string;
  company: string;
  period: string;
  description: string;
  tags: string[];
  finished_date: string;
}

export const experiences: Experience[] = [
  {
    id: 6,
    role: "Full-stack Developer",
    company: "Firmer Co., Ltd",
    period: "Apr 2026 - Present",
    description:
      "Full-time Full-stack Developer at Firmer, continuing to build and maintain the inventory system I started on as an intern.",
    tags: ["Fullstack", "Inventory System", "Full-time"],
    // ongoing role: the start date stands in so the card sorts first and shows the year
    finished_date: "2026-04-20",
  },
  {
    id: 1,
    role: "Wordpress Developer",
    company: "Sri Ayutthaya",
    period: "Nov 2025 - Jan 2026",
    description:
      "Built a WordPress site for a restaurant ordering system and set up SMTP email notifications for new orders, as a part-time developer.",
    tags: ["Wordpress", "SMTP", "Part-time"],
    finished_date: "2026-01-10",
  },
  {
    id: 2,
    role: "Fullstack Developer",
    company: "Firmer Co., Ltd",
    period: "Sep 2024 - Mar 2025",
    description: "Worked as a intern developing an inventory project.",
    tags: ["Fullstack", "Inventory System", "Internship"],
    finished_date: "2025-03-31",
  },
  {
    id: 3,
    role: "Tech Staff (Frontend Dev)",
    company: "IT Openhouse 2025",
    period: "Jan 2025 - Mar 2025",
    description:
      "Developed landing page with registered form for IT openhouse camping using react ts and nest js for backend dev.",
    tags: ["React", "NestJS", "TypeScript"],
    finished_date: "2025-03-10",
  },
  {
    id: 4,
    role: "Tech Staff (Frontend Dev)",
    company: "ITCamp20",
    period: "Jan 2024 - Apr 2024",
    description:
      "Developed a website for promoting and recruiting for ITCamp20 using the Nuxt framework and TailwindCSS for web development.",
    tags: ["Nuxt", "TailwindCSS"],
    finished_date: "2024-04-10",
  },
  {
    id: 5,
    role: "Registration Staff",
    company: "UNITE Camp 5",
    period: "Jan 2023",
    description:
      "School of Information Technology, KMITL. Was responsible for managing the registration process for staff and campers participating in the event.",
    tags: ["Management", "Registration"],
    finished_date: "2023-01-20",
  },
];
