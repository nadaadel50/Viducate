import type { ReactNode } from "react";
import { CustomButton } from "../../../../core/componants/custum_btn";

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
  label: string;
  onClick: () => void;
  variant: Variant;
};

export function FinalGeneratedBtn({
  icon,
  label,
  onClick,
  variant,
}: FinalGeneratedBtnProps) {
  const style = styles[variant];

  return (
    <CustomButton
      fullWidth
      onClick={onClick}
      leftIcon={<span className="transition-transform group-hover:scale-110">{icon}</span>}
      className={`group border bg-white ${style.border} ${style.text} ${style.hover} hover:shadow hover:-translate-y-[1px]`}
    >
      <span className="tracking-tight">{label}</span>
    </CustomButton>
  );
}