import type { LucideIcon } from "lucide-react";

import {
  FONT_SIZE,
  FONT_WEIGHT,
} from "../../../../core/constants/fonts_update";

interface SectionHeaderProps {
  icon: LucideIcon;
  title: string;
  color?: string;
}

export function SectionHeader({
  icon: Icon,
  title,
  color = "#4f46e5",
}: SectionHeaderProps) {
  return (
    <header className="mb-4 mt-6 flex items-center gap-3 border-b border-slate-100 pb-3 md:mb-5 md:mt-8">
      <div
        className="flex h-8 w-8 items-center justify-center rounded-lg md:h-9 md:w-9"
        style={{
          backgroundColor: `${color}15`,
          color,
        }}
      >
        <Icon size={18} strokeWidth={2.2} />
      </div>

      <h2
        className={`${FONT_SIZE.size18} md:text-xl ${FONT_WEIGHT.bold} leading-tight text-slate-800`}
      >
        {title}
      </h2>
    </header>
  );
}
