import React from "react";
import { RevealText } from "../motion";

interface PersonalitySectionHeadProps {
  eyebrow: string;
  title: string;
  className?: string;
}

/** หัวข้อแต่ละส่วนในหน้า personality: eyebrow mono + หัวข้อที่ค่อยๆ โผล่ทีละคำ (แบบเดียวกับ Experience) */
export const PersonalitySectionHead: React.FC<PersonalitySectionHeadProps> = ({ eyebrow, title, className = "" }) => (
  <div className={`personality-head ${className}`}>
    <p className="font-mono text-[11px] tracking-[0.3em] text-core-icy">{eyebrow}</p>
    <RevealText
      as="h2"
      className="mt-4 max-w-3xl text-3xl font-semibold tracking-[-0.03em] text-core-ink md:text-5xl"
      text={title}
    />
  </div>
);
