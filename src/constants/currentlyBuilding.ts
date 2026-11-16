export interface BuildingItem {
  /** matches a project in projects.ts (for the case-study link) */
  slug: string;
  name: string;
  url: string;
  status: "live" | "in-progress";
  summary: string;
  workingOn: string;
  stack: string[];
  /** desktop screenshots shown in the preview frame */
  shots: string[];
  /** true when the real site may be loaded in an iframe ("Try it here") */
  embeddable: boolean;
}

export interface CurrentlyBuilding {
  updated: string;
  items: BuildingItem[];
  interests: string[];
}

export const CURRENTLY_BUILDING: CurrentlyBuilding = {
  updated: "Nov 2026",
  items: [
    {
      slug: "beatdrop",
      name: "BeatDrop",
      url: "https://beatdrop-self.vercel.app",
      status: "live",
      summary: "Song-guessing game from short clips, Thai and international.",
      workingOn: "Daily Challenge archive and smoother mobile audio",
      stack: ["Next.js", "TypeScript", "Upstash Redis", "PostgreSQL"],
      shots: ["play", "guesser", "daily", "room"].map((s) => `/projects/beatdrop/${s}.png`),
      embeddable: true,
    },
    {
      slug: "sheet2web",
      name: "Sheet2Web",
      url: "https://sheet-portfolio-tracker.vercel.app",
      status: "in-progress",
      summary: "Google Sheets sync and multi-market portfolio tracker.",
      workingOn: "Transaction receipts and safer two-way Sheets sync",
      stack: ["Next.js", "TypeScript", "Supabase", "Lucent DS"],
      // login-only app (X-Frame-Options: DENY): screenshots from a test account, email masked
      shots: ["dashboard", "portfolios", "allocation", "dividends"].map((s) => `/projects/sheet2web/${s}.png`),
      embeddable: false,
    },
  ],
  interests: ["AI tools in everyday development", "Real-time multiplayer on the web", "Personal finance tooling"],
};
