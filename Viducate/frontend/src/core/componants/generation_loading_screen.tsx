import type { ReactNode } from "react";

import { COLORS } from "../constants";
import {
  FONT_SIZE,
  FONT_WEIGHT,
  LETTER_SPACING,
  LINE_HEIGHT,
} from "../constants/fonts_update";

interface LoadingScreenProps {
  icon: ReactNode;
  titlePrefix: string;
  titleHighlight: string;
  subtitle: string;
}

const ORBIT_SIZES = {
  outer: "w-[18rem] h-[18rem] md:w-[22rem] md:h-[22rem]",
  middle: "w-[13rem] h-[13rem] md:w-[16rem] md:h-[16rem]",
  inner: "w-[9rem] h-[9rem] md:w-[11rem] md:h-[11rem]",
  glow: "w-[14rem] h-[14rem] md:w-[18rem] md:h-[18rem]",
  center: "w-20 h-20 md:w-[105px] md:h-[105px]",
} as const;

export function GenerationLoadingScreen({
  icon,
  titlePrefix,
  titleHighlight,
  subtitle,
}: LoadingScreenProps) {
  return (
    <div
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden px-4"
      style={{ background: COLORS.background.radialGradient }}
    >
      <div
        className="absolute inset-0 opacity-40"
        style={{ background: COLORS.background.light }}
      />

      <main className="relative z-10 flex w-full max-w-3xl flex-col items-center text-center">
        <div className="relative mb-8 flex h-[20rem] w-[20rem] items-center justify-center md:mb-10 md:h-[25rem] md:w-[25rem]">
          <div
            className={`absolute rounded-full blur-[100px] animate-pulse ${ORBIT_SIZES.glow}`}
            style={{
              backgroundColor: COLORS.brand.primary,
              opacity: 0.3,
            }}
          />

          <div
            className={`absolute rounded-full border border-dashed animate-spin-slow ${ORBIT_SIZES.outer}`}
            style={{
              borderColor: COLORS.border.default,
              opacity: 0.2,
              animationDuration: "20s",
            }}
          >
            <div
              className="absolute left-1/2 top-0 h-4 w-4 -translate-x-1/2 rounded-full shadow-[0_0_15px_white]"
              style={{ background: COLORS.brand.gradient }}
            />

            <div
              className="absolute bottom-0 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full opacity-50"
              style={{ background: COLORS.text.primary }}
            />
          </div>

          <div
            className={`absolute rounded-full border border-dotted animate-spin ${ORBIT_SIZES.middle}`}
            style={{
              borderColor: COLORS.brand.primary,
              opacity: 0.3,
              animationDuration: "12s",
              animationDirection: "reverse",
            }}
          >
            <div
              className="absolute left-0 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full"
              style={{
                background: COLORS.state.success,
                boxShadow: `0 0 10px ${COLORS.state.success}`,
              }}
            />

            <div className="absolute right-8 top-8 h-2 w-2 rounded-full bg-white opacity-60" />
          </div>

          <div
            className={`absolute rounded-full border border-double animate-spin ${ORBIT_SIZES.inner}`}
            style={{
              borderColor: COLORS.brand.secondary,
              opacity: 0.4,
              animationDuration: "6s",
            }}
          >
            <div
              className="absolute right-0 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full"
              style={{ background: COLORS.brand.gradient }}
            />
          </div>

          <div
            className={`relative z-20 flex items-center justify-center rounded-full shadow-2xl ${ORBIT_SIZES.center}`}
            style={{
              background: COLORS.brand.gradient,
              boxShadow: `0 0 40px ${COLORS.brand.primary}90`,
              animation: "float 3s ease-in-out infinite",
            }}
          >
            <div className="scale-150 text-white drop-shadow-lg md:scale-[1.7]">
              {icon}
            </div>
          </div>
        </div>

        <div className="max-w-2xl space-y-4 md:space-y-5">
          <h1
            className={`
              ${FONT_SIZE.size30}
              
              ${FONT_WEIGHT.bold}
              ${LETTER_SPACING.tight}

            `}
            style={{ color: COLORS.text.primary }}
          >
            {titlePrefix}

            <br />

            <span
              className="mt-2 inline-block"
              style={{
                backgroundImage: COLORS.brand.gradient,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {titleHighlight}
            </span>
          </h1>

          <p
            className={`
              ${FONT_SIZE.size14}
            
              ${LINE_HEIGHT.relaxed}
              opacity-70
            `}
            style={{ color: COLORS.text.secondary }}
          >
            {subtitle}
          </p>
        </div>
      </main>
    </div>
  );
}
