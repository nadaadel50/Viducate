import type { LucideIcon } from "lucide-react";

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
    <div className="flex items-center gap-3 mb-5 mt-8 border-b border-slate-100 pb-3">
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center"
        style={{
          backgroundColor: `${color}15`,
          color: color,
        }}
      >
        <Icon size={20} strokeWidth={2.2} />
      </div>

      <h2 className="text-xl font-bold text-slate-800">{title}</h2>
    </div>
  );
}
