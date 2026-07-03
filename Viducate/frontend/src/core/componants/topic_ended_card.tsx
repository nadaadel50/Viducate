import type { ReactNode } from "react";
import clsx from "clsx";

import { FONT_SIZE, FONT_WEIGHT, LINE_HEIGHT } from "../constants/fonts_update";

const VARIANT_STYLES = {
  purple: {
    bg: "bg-purple-50",
    iconBg: "bg-purple-100",
    iconColor: "text-purple-600",
    hoverIconBg: "group-hover:bg-purple-600",
    hoverBorder: "hover:border-purple-500/20",
  },
  orange: {
    bg: "bg-orange-50",
    iconBg: "bg-orange-100",
    iconColor: "text-orange-600",
    hoverIconBg: "group-hover:bg-orange-600",
    hoverBorder: "hover:border-orange-500/20",
  },
  blue: {
    bg: "bg-blue-50",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    hoverIconBg: "group-hover:bg-blue-600",
    hoverBorder: "hover:border-blue-500/20",
  },
  teal: {
    bg: "bg-teal-50",
    iconBg: "bg-teal-100",
    iconColor: "text-teal-600",
    hoverIconBg: "group-hover:bg-teal-600",
    hoverBorder: "hover:border-teal-500/20",
  },
  green: {
    bg: "bg-[#F2FBF6]",
    iconBg: "bg-[#E6F6ED]",
    iconColor: "text-[#22C55E]",
    hoverIconBg: "group-hover:bg-[#22C55E]",
    hoverBorder: "hover:border-green-500/20",
  },
  red: {
    bg: "bg-[#FFF5F5]",
    iconBg: "bg-[#FEE2E2]",
    iconColor: "text-[#EF4444]",
    hoverIconBg: "group-hover:bg-[#EF4444]",
    hoverBorder: "hover:border-red-500/20",
  },
} as const;

export type TopicEndCardVariant = keyof typeof VARIANT_STYLES;

type TopicEndCardProps = {
  variant?: TopicEndCardVariant;
  icon: ReactNode;
  title: ReactNode;
  description: ReactNode;
  onClick?: () => void;
};

export function TopicEndCard({
  variant = "purple",
  icon,
  title,
  description,
  onClick,
}: TopicEndCardProps) {
  const style = VARIANT_STYLES[variant];

  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        "w-full group flex cursor-pointer flex-col items-start gap-4 rounded-xl border border-gray-100 p-5 text-left transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-md md:p-6",
        style.bg,
        style.hoverBorder,
      )}
    >
      <div
        className={clsx(
          "flex h-12 w-12 items-center justify-center rounded-lg transition-all duration-300 group-hover:text-white",
          style.iconBg,
          style.iconColor,
          style.hoverIconBg,
        )}
      >
        {icon}
      </div>

      <div className="space-y-1  flex flex-col items-start">
        <h2
          className={clsx(FONT_SIZE.size18, FONT_WEIGHT.bold, "text-[#111218]")}
        >
          {title}
        </h2>

        <p
          className={clsx(
            FONT_SIZE.size14,
            LINE_HEIGHT.relaxed,
            "text-[#636988]",
          )}
        >
          {description}
        </p>
      </div>
    </button>
  );
}
