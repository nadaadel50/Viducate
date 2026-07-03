import type { LucideIcon } from "lucide-react";

interface MaterialBadgeProps {
  icon: LucideIcon;
  label: string;
  done: boolean;
  color: string;
}

export function MaterialBadge({
  icon: Icon,
  label,
  done,
  color,
}: MaterialBadgeProps) {
  return (
    <div className="flex items-center gap-3 text-sm p-2 rounded-lg bg-slate-50 border border-slate-100">
      <span className={done ? "text-emerald-500" : "text-slate-300"}>
        {done ? "✅" : "⬜"}
      </span>

      <div className="flex items-center gap-2">
        <Icon
          size={16}
          strokeWidth={2.2}
          style={{
            color: done ? color : "#cbd5e1",
          }}
        />

        <span
          className={
            done ? "text-slate-700 font-medium" : "text-slate-400 font-medium"
          }
        >
          {label}
        </span>
      </div>
    </div>
  );
}
