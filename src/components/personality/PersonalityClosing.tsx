import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { PERSONALITY_COPY } from "../../constants/personality";
import { useNavClick } from "../../hooks";
import { Magnetic, useScrollVelocityMarquee } from "../motion";
import Container from "../common/Container";
import { PersonalityScrubText } from "./PersonalityScrubText";

/**
 * ปิดท้าย: philosophy ตัวใหญ่ที่สว่างขึ้นทีละตัวตาม scroll (GSAP อยู่ใน page)
 * + แถบตัวอักษรวิ่งแบบเดียวกับหน้า Contact + ปุ่มไปดูงานและติดต่อ
 */
export const PersonalityClosing: React.FC = () => {
  const handleNavClick = useNavClick();
  const sectionRef = useRef<HTMLElement>(null);
  // ใช้ hook เดิมของ Contact: แถบวิ่งเร็วขึ้นและเอียงตามความเร็ว scroll
  useScrollVelocityMarquee(sectionRef, ".personality-band-row");

  return (
    <section ref={sectionRef} aria-label="Philosophy" className="personality-closing overflow-hidden pb-32 pt-16 md:pb-40">
      <Container className="text-center">
        <h2
          aria-label={PERSONALITY_COPY.philosophy.join(" ")}
          className="text-[clamp(40px,7vw,112px)] font-semibold leading-[0.98] tracking-[-0.045em] text-core-ink"
        >
          <PersonalityScrubText className="block" text={PERSONALITY_COPY.philosophy[0]} />
          <PersonalityScrubText className="block" text={PERSONALITY_COPY.philosophy[1]} accentWords={["creating."]} />
        </h2>
      </Container>

      {/* แถบตัวอักษรขอบใส วิ่งไม่หยุด (สไตล์เดียวกับแถบใน Contact) */}
      <div aria-hidden="true" className="relative my-16 w-full overflow-hidden select-none md:my-20">
        <div className="personality-band-row flex w-max animate-scroll gap-12 whitespace-nowrap text-[11vw] font-semibold leading-none tracking-[-0.04em] text-transparent [-webkit-text-stroke:1px_rgba(201,209,219,0.22)]">
          {[0, 1].map((k) => (
            <span key={k} className="flex gap-12">
              {PERSONALITY_COPY.marquee.map((phrase) => (
                <React.Fragment key={phrase}>
                  <span>{phrase}</span>
                  <span className="text-core-icy/10 [-webkit-text-stroke:0]">·</span>
                </React.Fragment>
              ))}
            </span>
          ))}
        </div>
      </div>

      <Container className="text-center">
        <div className="personality-cta flex flex-wrap items-center justify-center gap-3">
          <Magnetic strength={0.25}>
            <Link to={PERSONALITY_COPY.ctaWork.href} className="sci-fi-btn-primary group min-h-[44px]">
              {PERSONALITY_COPY.ctaWork.label}
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </Magnetic>
          <a
            href={`/${PERSONALITY_COPY.ctaContact.href}`}
            onClick={(e) => {
              e.preventDefault();
              handleNavClick(PERSONALITY_COPY.ctaContact.href);
            }}
            className="sci-fi-btn-secondary min-h-[44px]"
          >
            {PERSONALITY_COPY.ctaContact.label}
          </a>
        </div>
      </Container>
    </section>
  );
};
