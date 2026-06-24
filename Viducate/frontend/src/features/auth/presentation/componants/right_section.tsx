import { COLORS } from "../../../../core/constants";
import { FONT_STYLES } from "../../../../core/constants/fonts";
import type { ReactNode } from "react";

type RightSectionProps = {
  imgSrc?: string;
  animationComponant?: ReactNode;
  titleFirstPart: string;
  titleColoredPart: string;
  description: string;
  animation: boolean;
};

export function RightSection({
  imgSrc,
  animationComponant,
  titleFirstPart,
  titleColoredPart,
  description,
  animation,
}: RightSectionProps) {
  return (
    <>
      {animation ? (
        animationComponant
      ) : (
        <img
          className="
            w-44
            sm:w-56
            md:w-72
            lg:w-90
            h-auto
          "
          src={imgSrc}
          alt=""
        />
      )}

      <h2
        style={{ color: COLORS.text.primary }}
        className={`
          ${FONT_STYLES.pageTitle}
          mt-8
          md:mt-6
          mb-4
          text-center
          w-full
          md:w-100
          lg:w-130
          px-4
        `}
      >
        {titleFirstPart}
        <span style={{ color: COLORS.text.coloredText }}>
          {titleColoredPart}
        </span>
      </h2>

      <p
        style={{ color: COLORS.text.secondary }}
        className={`
          ${FONT_STYLES.body}
          text-center
          w-full
          md:w-120
          px-4
        `}
      >
        {description}
      </p>
    </>
  );
}
