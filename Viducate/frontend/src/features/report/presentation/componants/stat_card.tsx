import type { LucideIcon } from "lucide-react";

import {
  FONT_SIZE,
  FONT_WEIGHT,
  LETTER_SPACING,
} from "../../../../core/constants/fonts_update";

import { useInView } from "../hooks/use_in_view";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  sub?: string;
  color: string;
  delay?: number;
}

export function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  color,
  delay = 0,
}: StatCardProps) {
  const { ref, inView } = useInView();

  return (
    <div
      ref={ref}
      className="group flex flex-col gap-3 rounded-xl border border-white/60 bg-white/80 px-4 py-3 shadow-md backdrop-blur-md transition-all "
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(20px)",
        transition: `opacity 0.5s ease ${delay}ms, transform 0.5s ease ${delay}ms`,
      }}
    >
      <div className="flex items-center justify-between">
        <div
          className="flex h-9 w-9 items-center justify-center rounded-lg sm:h-10 sm:w-10"
          style={{
            backgroundColor: `${color}15`,
            color,
          }}
        >
          <Icon size={20} strokeWidth={2.2} />
        </div>

        <div
          className="h-2.5 w-2.5 shrink-0 rounded-full border border-white shadow-sm"
          style={{
            backgroundColor: color,
          }}
        />
      </div>

      <div>
        <div
          className={`${FONT_SIZE.size24} ${FONT_WEIGHT.extraBold} mb-1`}
          style={{ color }}
        >
          {value}
        </div>

        <div
          className={`${FONT_SIZE.size11} ${FONT_WEIGHT.bold} ${LETTER_SPACING.wide} mb-1 uppercase text-slate-400`}
        >
          {label}
        </div>

        {sub && (
          <p
            className={`${FONT_SIZE.size11} ${FONT_WEIGHT.medium} leading-relaxed text-slate-500`}
          >
            {sub}
          </p>
        )}
      </div>
    </div>
  );
}
