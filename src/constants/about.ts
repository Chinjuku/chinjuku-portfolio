export const ABOUT_COPY = {
  eyebrow: "ABOUT",
  headlineLines: ["Engineer first.", "AI where it helps."],
  bio: [
    "I'm a Software Engineering graduate from KMITL who builds web products end to end, from the database schema to the last pixel.",
    "Lately that means wiring AI into real features people use, not demos.",
    "I care most about the unglamorous parts: data models that stay clean, and features that survive real users.",
  ],
  name: "Chinatip Wu",
  location: "Bangkok, TH",
} as const;

export interface AboutFact {
  label: string;
  value: string;
}

export const ABOUT_FACTS: AboutFact[] = [
  { label: "EDUCATION", value: "B.Sc. IT (Software Engineering), KMITL · 2026" },
  { label: "NOW", value: "Full-stack Developer @ Firmer Co., Ltd" },
  { label: "LEARNING", value: "Applying AI tools across everyday development" },
  { label: "FOCUS", value: "Full-stack web · AI inside real products" },
];
