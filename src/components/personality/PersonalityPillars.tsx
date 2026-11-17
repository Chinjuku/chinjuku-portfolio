import React from "react";
import {
  PERSONALITY_COPY,
  PERSONALITY_PILLARS,
  PERSONALITY_TRAITS,
  type PersonalityPillar,
} from "../../constants/personality";
import Container from "../common/Container";
import { PersonalityIcon } from "./PersonalityIcon";
import { PersonalityMindsetLoop } from "./PersonalityMindsetLoop";
import { PersonalitySectionHead } from "./PersonalitySectionHead";
import { PersonalityWorkStyleSwitch } from "./PersonalityWorkStyleSwitch";

// ภาพ/ของเล่นประจำการ์ด: aside = อยู่ข้างข้อความ, extra = อยู่ใต้ข้อความ
const ASIDE: Partial<Record<PersonalityPillar["id"], React.ReactNode>> = {
  mindset: <PersonalityMindsetLoop />,
};
const EXTRA: Partial<Record<PersonalityPillar["id"], React.ReactNode>> = {
  "working-style": <PersonalityWorkStyleSwitch />,
};

/** Identity / Mindset / Working style / Philosophy: identity ใหญ่ซ้าย อีก 3 ใบเรียงขวา */
export const PersonalityPillars: React.FC = () => {
  const [identity, ...rest] = PERSONALITY_PILLARS;
  return (
    <section aria-label={PERSONALITY_COPY.pillarsTitle} className="py-24 md:py-32">
      <Container>
        <PersonalitySectionHead eyebrow={PERSONALITY_COPY.pillarsEyebrow} title={PERSONALITY_COPY.pillarsTitle} />
        <div className="mt-12 grid gap-4 lg:grid-cols-12">
          <PillarCard pillar={identity} large className="lg:col-span-5" />
          <div className="grid gap-4 lg:col-span-7">
            {rest.map((p) => (
              <PillarCard key={p.id} pillar={p} aside={ASIDE[p.id]} extra={EXTRA[p.id]} />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
};

interface PillarCardProps {
  pillar: PersonalityPillar;
  large?: boolean;
  aside?: React.ReactNode;
  extra?: React.ReactNode;
  className?: string;
}

const PillarCard: React.FC<PillarCardProps> = ({ pillar, large = false, aside, extra, className = "" }) => (
  <article
    className={`personality-pillar relative overflow-hidden rounded-2xl border border-white/[0.08] p-6 md:p-8 ${large ? "flex flex-col justify-between bg-gradient-to-b from-white/[0.05] to-white/[0.01] lg:min-h-full" : "bg-white/[0.02]"} ${className}`}
  >
    {large && (
      // แสงไอซี่มุมบนแบบเดียวกับรูปใน About
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_80%_at_100%_0%,rgba(138,191,255,0.14),transparent_55%)]"
      />
    )}
    <div className="relative flex items-center gap-3">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-core-icy">
        <PersonalityIcon name={pillar.icon} />
      </span>
      <span className="font-mono text-[10px] tracking-[0.25em] text-core-mist">{pillar.label}</span>
    </div>
    {large && (
      // identity = รวม 5 นิสัย: โชว์เป็นชิปกลางการ์ด
      <ul aria-label="Traits" className="relative my-10 flex flex-wrap gap-2">
        {PERSONALITY_TRAITS.map((t) => (
          <li
            key={t.id}
            className="rounded-full border border-white/10 bg-core-obsidian/40 px-3 py-1.5 font-mono text-[11px] tracking-[0.1em] text-core-chrome"
          >
            {t.name}
          </li>
        ))}
      </ul>
    )}
    <div className={`relative ${aside ? "flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between" : ""}`}>
      <div>
        <h3
          className={`mt-6 font-semibold tracking-tight text-core-ink ${
            large ? "text-3xl md:text-4xl" : "text-xl md:text-2xl"
          }`}
        >
          {pillar.title}
        </h3>
        <p className="mt-3 max-w-[56ch] text-sm leading-relaxed text-core-mist md:text-[15px]">{pillar.description}</p>
        {extra}
      </div>
      {aside}
    </div>
  </article>
);
