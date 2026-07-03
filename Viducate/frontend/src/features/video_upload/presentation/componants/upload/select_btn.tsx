import { COLORS } from "../../../../../core/constants";
import { FONT_STYLES } from "../../../../../core/constants/fonts";
import type { ReactNode } from "react";
import type { SelectType } from "../../types/types";

type SelectBtnProps = {
  isSelected: boolean;
  text: string;
  icon: ReactNode;
  handleSelect: (btnSelected: SelectType) => void;
  value: SelectType;
};

export function SelectBtn({
  isSelected,
  text,
  icon,
  handleSelect,
  value,
}: SelectBtnProps) {
  return (
    <button
      onClick={() => handleSelect(value)}
      style={{
        color: isSelected ? COLORS.brand.primary : COLORS.text.gray,
      }}
      className={`
        w-full
        flex
        items-center
        justify-center
        gap-2
        py-2
        sm:py-2.5
        px-3
        transition-all
        duration-300
        ease-in-out

        ${isSelected ? "rounded-lg shadow-sm bg-white" : "cursor-pointer"}
      `}
    >
      <span className="shrink-0">{icon}</span>

      <span className={`${FONT_STYLES.button} truncate`}>{text}</span>
    </button>
  );
}
