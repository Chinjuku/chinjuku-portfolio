import React from "react";

interface PersonalityScrubTextProps {
  text: string;
  /** คำที่ใช้สีเน้น (เทียบทั้งคำ) */
  accentWords?: string[];
  className?: string;
}

/**
 * แยกข้อความเป็นตัวอักษร (class personality-scrub-char) ให้หน้า page สั่ง GSAP scrub
 * ให้สว่างขึ้นทีละตัวตาม scroll ห่อทีละคำเป็น inline-block กันคำขาดกลางบรรทัด
 * ตัวอักษรถูกซ่อนจาก screen reader (หัวข้อแม่มี aria-label ข้อความเต็มอยู่แล้ว)
 */
export const PersonalityScrubText: React.FC<PersonalityScrubTextProps> = ({ text, accentWords = [], className = "" }) => (
  <span aria-hidden="true" className={className}>
    {text.split(" ").map((word, w, words) => (
      <React.Fragment key={`${word}-${w}`}>
        <span className={`inline-block ${accentWords.includes(word) ? "text-core-icy" : ""}`}>
          {Array.from(word).map((ch, i) => (
            <span key={i} className="personality-scrub-char">
              {ch}
            </span>
          ))}
        </span>
        {w < words.length - 1 && " "}
      </React.Fragment>
    ))}
  </span>
);
