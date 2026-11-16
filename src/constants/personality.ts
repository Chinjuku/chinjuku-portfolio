// เนื้อหาทั้งหมดของหน้า /personality (แยกจาก UI ตาม convention ของโปรเจกต์)
// หมายเหตุ: คำอธิบายเป็นฉบับร่างจาก Personality System + about-me รอเจ้าของรีวิว

/** คีย์ไอคอน lucide ที่ component จะ map เป็นไอคอนจริง */
export type PersonalityIcon =
  | "search"
  | "sparkles"
  | "compass"
  | "chart"
  | "shuffle"
  | "flask"
  | "layers"
  | "infinity"
  | "book"
  | "clock";

/** ตัวอย่างจากงานจริง (ด้านหลังการ์ดที่พลิก) ลิงก์ไปหน้า /projects/:slug */
export interface PersonalityExample {
  slug: string;
  project: string;
  note: string;
}

export interface PersonalityTrait {
  id: string;
  name: string;
  icon: PersonalityIcon;
  /** ประโยคสั้นใต้ชื่อ */
  tagline: string;
  description: string;
  example: PersonalityExample;
}

export interface PersonalityPillar {
  id: "mindset" | "working-style" | "philosophy" | "identity";
  label: string;
  title: string;
  icon: PersonalityIcon;
  description: string;
}

/** id ของการ์ดนิสัยใน DOM ใช้ให้ radar stat เลื่อนมาหา */
export const traitDomId = (id: string) => `personality-trait-${id}`;

export interface PersonalityHudRow {
  label: string;
  value: string;
}

/** แผงข้อมูลแบบเกมข้างกราฟ radar (ไม่มีตัวเลข stat ตามที่เจ้าของเลือก) */
export const PERSONALITY_HUD: PersonalityHudRow[] = [
  { label: "CLASS", value: "The Curious Creator" },
  { label: "MINDSET", value: "Experiment and learn" },
  { label: "STYLE", value: "Hybrid" },
  { label: "MOTTO", value: "Always curious. Always creating." },
];

export interface PersonalityHabit {
  id: string;
  label: string;
  title: string;
  icon: PersonalityIcon;
  points: string[];
}

export const PERSONALITY_COPY = {
  eyebrow: "PERSONALITY",
  identity: "The Curious Creator",
  /** หัวข้อใหญ่ 2 บรรทัด (บรรทัดที่ 2 ใช้สีเน้น) */
  headlineLines: ["The Curious", "Creator."],
  intro:
    "I'm a full-stack developer who learns by building. Most of the tools I use every day I taught myself, one project at a time.",
  statHint: "TAP A TRAIT TO JUMP TO IT",
  hudTitle: "PROFILE // CHINJUKU",
  hudStatus: "ONLINE",
  traitsEyebrow: "TRAITS",
  traitsTitle: "Five things that shape how I work",
  pillarsEyebrow: "HOW I OPERATE",
  pillarsTitle: "Mindset, style and the line I keep coming back to",
  habitsEyebrow: "DAY TO DAY",
  habitsTitle: "Where the curiosity goes",
  philosophy: ["Always curious.", "Always creating."],
  ctaWork: { label: "See what I've built", href: "/projects" },
  flipLabel: "In practice",
  flipBackLabel: "Back",
  caseStudyLabel: "Case study",
  /** แถบตัวอักษรวิ่งท้ายหน้า */
  marquee: ["Always curious", "Always creating"],
  ctaContact: { label: "Say hello", href: "#contact" },
} as const;

export const PERSONALITY_TRAITS: PersonalityTrait[] = [
  {
    id: "curious",
    name: "Curious",
    icon: "search",
    tagline: "Asks why until it makes sense.",
    description:
      "I want to know how things work under the hood. I read the docs, open the source and keep asking until the answer is clear, not just working.",
    example: {
      slug: "tft-trivia",
      project: "TFT Trivia",
      note: "Dug into the data behind every Teamfight Tactics set to build four quiz modes and attribute-comparison puzzles.",
    },
  },
  {
    id: "creative",
    name: "Creative",
    icon: "sparkles",
    tagline: "Turns ideas into things you can click.",
    description:
      "I like making ideas real: a 3D hero, a song-guessing game, a dashboard that makes numbers easy to read. If I can picture it, I want to build it.",
    example: {
      slug: "beatdrop",
      project: "BeatDrop",
      note: "Turned \"name that song from a few seconds\" into a game with Thai and international clips.",
    },
  },
  {
    id: "independent",
    name: "Independent",
    icon: "compass",
    tagline: "Give me a goal and some room.",
    description:
      "I break a goal into small steps, find what I'm missing and come back with something that works. When a requirement is unclear, I ask early instead of guessing.",
    example: {
      slug: "antigravity-discord-bridge",
      project: "Antigravity Discord Bridge",
      note: "Wanted to steer AI coding agents from my phone, so I built a Discord bridge with decision buttons and live task status.",
    },
  },
  {
    id: "analytical",
    name: "Analytical",
    icon: "chart",
    tagline: "Finds the cause before the fix.",
    description:
      "Before I change code I want to know why it broke. I trace the data, check the edge cases and write down what \"done\" should look like.",
    example: {
      slug: "sheet2web",
      project: "Sheet2Web",
      note: "Used decimal-safe maths for positions and returns, because money can't be \"close enough\".",
    },
  },
  {
    id: "adaptable",
    name: "Adaptable",
    icon: "shuffle",
    tagline: "Picks up what the project needs.",
    description:
      "React or Vue, Node or Django, a new tool every month. I learn what the work calls for and keep the parts that prove themselves.",
    example: {
      slug: "tripflow",
      project: "TripFlow",
      note: "Picked up a React PWA, ElysiaJS on Bun, Supabase and Gemini OCR to fit what the trip planner needed.",
    },
  },
];

export const PERSONALITY_PILLARS: PersonalityPillar[] = [
  {
    id: "identity",
    label: "IDENTITY",
    title: "The Curious Creator",
    icon: "sparkles",
    description:
      "Curiosity is the starting point; making something is how I find out if I understood it. That loop sits at the center of everything else here.",
  },
  {
    id: "mindset",
    label: "MINDSET",
    title: "Experiment and learn",
    icon: "flask",
    description:
      "Build a small version, see what breaks, learn from it, build the next one. Side projects are where I try new ideas before they reach real work.",
  },
  {
    id: "working-style",
    label: "WORKING STYLE",
    title: "Hybrid",
    icon: "layers",
    description:
      "Heads-down when I'm building, open when we're deciding. I go deep on my own, then bring it back to the team to check direction, details and what users really need.",
  },
  {
    id: "philosophy",
    label: "PHILOSOPHY",
    title: "Always curious. Always creating.",
    icon: "infinity",
    description:
      "There is always one more thing to understand and one more thing to make. I'd rather keep both going than wait until I feel ready.",
  },
];

export const PERSONALITY_HABITS: PersonalityHabit[] = [
  {
    id: "learn",
    label: "HOW I LEARN",
    title: "By building",
    icon: "book",
    points: [
      "Self-taught most of the stack I use at work.",
      "Learn a tool by shipping a small project with it.",
      "Ask AI to explain how things really work, then check it in code.",
      "Watch a video when I need to see the big picture first.",
    ],
  },
  {
    id: "rhythm",
    label: "DAILY RHYTHM",
    title: "Two shifts of making",
    icon: "clock",
    points: [
      "Remote full-stack developer by day.",
      "Side projects in the evening, usually 8 pm to midnight.",
      "That second shift is where new ideas get tried first.",
    ],
  },
];

/** วงจร Mindset: Experiment and learn */
export const PERSONALITY_LOOP = [
  { id: "build", label: "BUILD" },
  { id: "break", label: "BREAK" },
  { id: "learn", label: "LEARN" },
] as const;

export interface PersonalityWorkMode {
  id: "focus" | "sync";
  label: string;
  title: string;
  text: string;
}

/** สวิตช์ Working style: Hybrid = สลับระหว่างสองโหมดนี้ */
export const PERSONALITY_WORK_MODES: PersonalityWorkMode[] = [
  {
    id: "focus",
    label: "HEADS-DOWN",
    title: "Deep focus",
    text: "One problem, no noise. I dig in on my own until there's a first version that works.",
  },
  {
    id: "sync",
    label: "SYNC",
    title: "Team sync",
    text: "Then I bring it back: check the direction, the details and what users really need before going further.",
  },
];

export interface PersonalityShift {
  id: "day" | "evening";
  label: string;
  /** ชั่วโมงเริ่ม/จบ (0-24) เวลาไทย */
  start: number;
  end: number;
  status: string;
}

/**
 * นาฬิกา Daily rhythm (เวลาไทย)
 * หมายเหตุ: about-me บอกแค่ว่าเริ่มงานราว 10 โมง เวลาเลิกงาน 18:00 เป็นค่าร่าง รอเจ้าของยืนยัน
 */
export const PERSONALITY_RHYTHM = {
  timeZone: "Asia/Bangkok",
  zoneLabel: "BANGKOK",
  shifts: [
    { id: "day", label: "Day job", start: 10, end: 18, status: "AT WORK" },
    { id: "evening", label: "Side projects", start: 20, end: 24, status: "BUILDING SIDE PROJECTS" },
  ] as PersonalityShift[],
  offStatus: "OFFLINE",
} as const;
