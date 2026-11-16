import React from "react";
import { PERSONALITY_COPY, PERSONALITY_HABITS } from "../../constants/personality";
import Container from "../common/Container";
import { PersonalityIcon } from "./PersonalityIcon";
import { PersonalityRhythmClock } from "./PersonalityRhythmClock";
import { PersonalitySectionHead } from "./PersonalitySectionHead";

/** How I learn + Daily rhythm: แถวข้อความมีเส้นคั่นแบบเดียวกับแถว facts ใน About */
export const PersonalityHabits: React.FC = () => (
  <section aria-label={PERSONALITY_COPY.habitsTitle} className="py-24 md:py-32">
    <Container>
      <PersonalitySectionHead eyebrow={PERSONALITY_COPY.habitsEyebrow} title={PERSONALITY_COPY.habitsTitle} />
      <div className="mt-12 grid gap-10 md:grid-cols-2 md:gap-8">
        {PERSONALITY_HABITS.map((habit) => (
          <article key={habit.id} className="personality-habit">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-core-icy">
                <PersonalityIcon name={habit.icon} />
              </span>
              <span className="font-mono text-[10px] tracking-[0.25em] text-core-mist">{habit.label}</span>
            </div>
            <h3 className="mt-5 text-2xl font-semibold tracking-tight text-core-ink">{habit.title}</h3>
            {/* Daily rhythm มีนาฬิกา 24 ชม. เพิ่ม */}
            {habit.id === "rhythm" && (
              <div className="mt-6">
                <PersonalityRhythmClock />
              </div>
            )}
            <ul className="mt-6 border-t border-core-graphite">
              {habit.points.map((point) => (
                <li
                  key={point}
                  className="personality-habit-row flex gap-3 border-b border-core-graphite py-3.5 text-sm text-core-ink md:text-[15px]"
                >
                  <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-core-icy" />
                  {point}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </Container>
  </section>
);
