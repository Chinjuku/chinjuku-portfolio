export interface ContactInfo {
  gmail: string;
  github: string;
  phone: string;
  linkedin: string;
  fastwork: string;
}

export const chinjukuContact: ContactInfo = {
  gmail: "chinatipwuu@gmail.com",
  github: "https://github.com/Chinjuku",
  phone: "088-5959-868",
  linkedin: "https://www.linkedin.com/in/chinatip-wu-8a318432b",
  fastwork: "https://fastwork.com/user/chinatip",
};

/** Headlines the Contact section cycles through. */
export const CONTACT_HEADLINES = [
  "Say hello.",
  "Have a project in mind?",
  "Let's build something intelligent.",
] as const;
