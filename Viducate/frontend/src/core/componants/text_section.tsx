import type { ReactNode } from "react";
import { FONT_STYLES } from "../constants/fonts";

type MainTextProps = {
  bigTitle: ReactNode;
  smallTitle: ReactNode;
};

export function MainText({ bigTitle, smallTitle }: MainTextProps) {
  return (
    <div className="w-full mb-6">
      <h2
        className={`
          ${FONT_STYLES.pageTitle}
          mb-2
          leading-tight
          tracking-[-0.033em]
        `}
      >
        {bigTitle}
      </h2>

      <p
        className={`
          ${FONT_STYLES.subtitle}
          text-[#767C9B]
        `}
      >
        {smallTitle}
      </p>
    </div>
  );
}

export default MainText;
