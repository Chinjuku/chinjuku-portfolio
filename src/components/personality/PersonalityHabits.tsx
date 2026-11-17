import React from "react";
import { PERSONALITY_COPY, PERSONALITY_LEARN, PERSONALITY_RHYTHM } from "../../constants/personality";
import Container from "../common/Container";
import { PersonalityLearnTabs } from "./PersonalityLearnTabs";
import { PersonalityPanel } from "./PersonalityPanel";
import { PersonalityRhythmClock } from "./PersonalityRhythmClock";
import { PersonalitySectionHead } from "./PersonalitySectionHead";

/** Day to day: 2 แผงคอนโซลสูงเท่ากัน ซ้าย = How I learn (แท็บ) ขวา = Daily rhythm (นาฬิกาเล่นได้) */
export const PersonalityHabits: React.FC = () => (
  <section aria-label={PERSONALITY_COPY.habitsTitle} className="py-24 md:py-32">
    <Container>
      <PersonalitySectionHead eyebrow={PERSONALITY_COPY.habitsEyebrow} title={PERSONALITY_COPY.habitsTitle} />
      <div className="mt-12 grid items-stretch gap-4 lg:grid-cols-2">
        <PersonalityPanel head={PERSONALITY_LEARN}>
          <PersonalityLearnTabs />
        </PersonalityPanel>
        <PersonalityPanel head={PERSONALITY_RHYTHM}>
          <PersonalityRhythmClock />
        </PersonalityPanel>
      </div>
    </Container>
  </section>
);
