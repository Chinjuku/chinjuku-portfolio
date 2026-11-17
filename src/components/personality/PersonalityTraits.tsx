import React from "react";
import { PERSONALITY_COPY, PERSONALITY_TRAITS, traitDomId } from "../../constants/personality";
import Container from "../common/Container";
import { PersonalitySectionHead } from "./PersonalitySectionHead";
import { PersonalityTraitCard } from "./PersonalityTraitCard";

// 5 การ์ดใน grid 6 คอลัมน์: แถวแรก 3 ใบ (กว้าง 2) แถวสอง 2 ใบ (กว้าง 3) จะได้ไม่เหลือช่องว่าง
// tablet (2 คอลัมน์): ใบที่ 5 กว้างเต็มแถว
const SPAN = ["lg:col-span-2", "lg:col-span-2", "lg:col-span-2", "lg:col-span-3", "md:col-span-2 lg:col-span-3"];

interface PersonalityTraitsProps {
  /** การ์ดที่เพิ่งถูกเลือกจาก radar จะเรืองแสงสั้นๆ */
  highlighted: string | null;
}

/** การ์ด 5 นิสัย (พลิกดูตัวอย่างจากงานจริงได้) */
export const PersonalityTraits: React.FC<PersonalityTraitsProps> = ({ highlighted }) => (
  <section aria-label={PERSONALITY_COPY.traitsTitle} className="py-24 md:py-32">
    <Container>
      <PersonalitySectionHead eyebrow={PERSONALITY_COPY.traitsEyebrow} title={PERSONALITY_COPY.traitsTitle} />
      <ul className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-6">
        {PERSONALITY_TRAITS.map((trait, i) => (
          // scroll-mt กัน navbar ที่ลอยอยู่บังหัวการ์ด
          <li key={trait.id} id={traitDomId(trait.id)} className={`personality-trait scroll-mt-28 ${SPAN[i]}`}>
            <PersonalityTraitCard
              trait={trait}
              index={i}
              total={PERSONALITY_TRAITS.length}
              highlighted={highlighted === trait.id}
            />
          </li>
        ))}
      </ul>
    </Container>
  </section>
);
