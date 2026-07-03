import type { ReactNode } from "react";
import clsx from "clsx";

import { CustomButton } from "../../../../core/componants/custum_btn";
import { FONT_STYLES } from "../../../../core/constants/fonts";
import { FormattedMessage } from "react-intl";
const styles = {
  quiz: {
    border: "border-[#6f8ab7]",
    text: "text-[#6f8ab7]",
    hover: "hover:bg-[#6f8ab7]/5",
  },
  summary: {
    border: "border-[#97bba3]",
    text: "text-[#97bba3]",
    hover: "hover:bg-[#97bba3]/5",
  },
  flashcards: {
    border: "border-[#bfa2db]",
    text: "text-[#bfa2db]",
    hover: "hover:bg-[#bfa2db]/5",
  },
  mindmap: {
    border: "border-[#e5989b]",
    text: "text-[#e5989b]",
    hover: "hover:bg-[#e5989b]/5",
  },
} as const;

type Variant = keyof typeof styles;

type FinalGeneratedBtnProps = {
  icon: ReactNode;
  label: ReactNode;
  onClick: () => void;
  variant: Variant;
  reviewCards?: number;
};

export function FinalGeneratedBtn({
  icon,
  label,
  onClick,
  variant,
  reviewCards,
}: FinalGeneratedBtnProps) {
  const variantStyle = styles[variant];

  return (
    <CustomButton
      fullWidth
      onClick={onClick}
      leftIcon={
        <span className="transition-transform group-hover:scale-110">
          {icon}
        </span>
      }
      className={clsx(
        "group border bg-white hover:-translate-y-[1px] hover:shadow",
        variantStyle.border,
        variantStyle.text,
        variantStyle.hover,
      )}
    >
      <span className={FONT_STYLES.button}>{label}</span>

      {reviewCards && reviewCards > 0 ? (
        <span
          className={clsx(
            FONT_STYLES.topicStatus,
            "flex shrink-0 items-center rounded-full bg-green-50 px-2 py-0.5 text-green-600",
          )}
        >
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-500" />
          <span className="ml-1 hidden sm:inline">
            <FormattedMessage id="watch.review" />
          </span>
        </span>
      ) : (
        <span className={clsx(FONT_STYLES.topicStatus, "px-2 py-0.5")}>
          &nbsp;
        </span>
      )}
    </CustomButton>
  );
}
