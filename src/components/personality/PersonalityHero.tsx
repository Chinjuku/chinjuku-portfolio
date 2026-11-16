import React, { Suspense, lazy } from "react";
import { PERSONALITY_COPY } from "../../constants/personality";
import type { CoreState } from "../hero/core/scrollState";
import { hasWebGL } from "../hero/core/webgl";
import { RevealText } from "../motion";
import Container from "../common/Container";
import { PersonalityStatHud } from "./PersonalityStatHud";
import { PersonalityStatRadar2D } from "./PersonalityStatRadar2D";

// radar 3D โหลดแบบ lazy เพื่อไม่ให้ three.js เข้า bundle หลัก
const PersonalityStatScene = lazy(() => import("./PersonalityStatScene"));

interface PersonalityHeroProps {
  coreState: CoreState;
  isMobile: boolean;
  onSelectTrait: (traitId: string) => void;
}

/** ส่วนบนของหน้า: ชื่อ identity + แผง HUD (ซ้าย) และ radar stat 5 นิสัย (ขวา) */
export const PersonalityHero: React.FC<PersonalityHeroProps> = ({ coreState, isMobile, onSelectTrait }) => {
  // มือถือ / ไม่มี WebGL ใช้ radar 2D ซึ่งเบากว่าและกดด้วยนิ้วได้ชัดกว่า
  const use3D = !isMobile && hasWebGL();
  const radar2D = <PersonalityStatRadar2D onSelect={onSelectTrait} className="h-full max-h-[440px]" />;

  return (
    <section aria-label="Personality" className="personality-hero relative overflow-hidden pb-8 pt-28 md:pt-32">
      <Container className="grid items-center gap-10 md:grid-cols-12 md:gap-8">
        <div className="personality-intro md:col-span-6 lg:col-span-5">
          <p className="font-mono text-[11px] tracking-[0.3em] text-core-icy">{PERSONALITY_COPY.eyebrow}</p>
          <h1
            aria-label={PERSONALITY_COPY.identity}
            className="mt-6 text-[clamp(44px,6vw,96px)] font-semibold leading-[0.95] tracking-[-0.045em] text-core-ink"
          >
            <RevealText as="span" className="block" text={PERSONALITY_COPY.headlineLines[0]} />
            <RevealText
              as="span"
              className="block"
              text={PERSONALITY_COPY.headlineLines[1]}
              accentWords={["Creator."]}
              delay={0.12}
            />
          </h1>
          <p className="mt-6 max-w-[42ch] text-base leading-relaxed text-core-mist lg:text-lg">{PERSONALITY_COPY.intro}</p>
          <PersonalityStatHud className="mt-8 max-w-md" />
        </div>

        <div className="relative md:col-span-6 lg:col-span-7">
          <div className="relative flex h-[min(92vw,440px)] items-center justify-center md:h-[420px] lg:h-[72vh]">
            {use3D ? (
              <Suspense fallback={radar2D}>
                <PersonalityStatScene state={coreState} onSelect={onSelectTrait} className="absolute -inset-[6%]" />
              </Suspense>
            ) : (
              radar2D
            )}
          </div>
          <p className="pointer-events-none mt-2 text-center font-mono text-[10px] tracking-[0.2em] text-core-mist">
            {PERSONALITY_COPY.statHint}
          </p>
        </div>
      </Container>
    </section>
  );
};
