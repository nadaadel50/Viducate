import clsx from "clsx";
import type { Difficulty } from "../../domain/entity/difficaulty";
import { CustomButton } from "../../../../core/componants/custum_btn";
import {
  FONT_SIZE,
  FONT_WEIGHT,
} from "../../../../core/constants/fonts_update";
import { FormattedMessage } from "react-intl";
const difficultyStyles = {
  easy: {
    border: "border-blue-200 hover:border-blue-300",
    text: "text-blue-600",
    bg: "bg-blue-50",
    hoverBg: "hover:bg-blue-100",
    iconBg: "bg-blue-100",
    iconHoverBg: "group-hover:bg-blue-200",
    icon: "thumb_up",
    timeId: "flashcards.time.easy",
  },
  good: {
    border: "border-green-200 hover:border-green-300",
    text: "text-green-600",
    bg: "bg-green-50",
    hoverBg: "hover:bg-green-100",
    iconBg: "bg-green-100",
    iconHoverBg: "group-hover:bg-green-200",
    icon: "check",
    timeId: "flashcards.time.good",
  },
  hard: {
    border: "border-yellow-200 hover:border-yellow-300",
    text: "text-yellow-600",
    bg: "bg-yellow-50",
    hoverBg: "hover:bg-yellow-100",
    iconBg: "bg-yellow-100",
    iconHoverBg: "group-hover:bg-yellow-200",
    icon: "thumb_down",
    timeId: "flashcards.time.hard",
  },
  again: {
    border: "border-red-200 hover:border-red-300",
    text: "text-red-600",
    bg: "bg-red-50",
    hoverBg: "hover:bg-red-100",
    iconBg: "bg-red-100",
    iconHoverBg: "group-hover:bg-red-200",
    icon: "refresh",
    timeId: "flashcards.time.again",
  },
} as const;

type UserLevelBtnProps = {
  diffStyle: Difficulty;
  onClick: () => void;
};

export function UserLevelBtn({ diffStyle, onClick }: UserLevelBtnProps) {
  const style = difficultyStyles[diffStyle];

  return (
    <CustomButton
      onClick={onClick}
      className={clsx(
        "group flex flex-1 flex-col gap-1.5 rounded-xl border-2 p-2 sm:p-3",
        style.border,
        style.bg,
        style.text,
        style.hoverBg,
        "hover:shadow-md",
      )}
    >
      <div
        className={clsx(
          "flex items-center justify-center rounded-full p-1.5 transition-colors sm:p-2",
          style.iconBg,
          style.iconHoverBg,
        )}
      >
        <span className="material-symbols-outlined">{style.icon}</span>
      </div>

      <span className={clsx(FONT_WEIGHT.bold, FONT_SIZE.size12, "capitalize")}>
        <FormattedMessage id={`flashcards.level.${diffStyle}`} />
      </span>

      <span className={clsx(FONT_SIZE.size11, "capitalize")}>
        <FormattedMessage id={style.timeId} />
      </span>
    </CustomButton>
  );
}
