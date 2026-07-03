import type { ReactNode } from "react";
import { FONT_STYLES } from "../../../../core/constants/fonts";

type ContentGenerationBtnProps = {
  onClick: () => void;
  icon: ReactNode;
  label: string;
  isDue?: boolean;
};

export function ContentGenerationBtn({
  onClick,
  icon,
  label,
  isDue = false,
}: ContentGenerationBtnProps) {
  return (
    <button
      onClick={onClick}
      title={label}
      className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border bg-white/50 px-1 py-2 transition-all 
        shadow-sm hover:border-[#4f46e5]/30 hover:bg-white 
        hover:text-[#4f46e5] ${isDue ? "border-green-500 text-green-600" : "border-slate-200/60 text-slate-400"}`}
    >
      <span className="mb-1">{icon}</span>

      <span className={`${FONT_STYLES.topicStatus}  uppercase tracking-wide`}>
        {label}
      </span>
    </button>
  );
}
