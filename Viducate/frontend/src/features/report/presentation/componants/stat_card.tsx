import type { LucideIcon } from "lucide-react";
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
      className="glass glass-hover rounded-2xl p-5 flex flex-col gap-3 group bg-white/80 backdrop-blur-md border border-white/60 shadow-lg"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 0.5s ease ${delay}ms, transform 0.5s ease ${delay}ms`,
      }}
    >
      <div className="flex items-center justify-between">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{
            backgroundColor: `${color}15`,
            color,
          }}
        >
          <Icon size={22} strokeWidth={2.2} />
        </div>

        <div
          className="w-3 h-3 rounded-full flex-shrink-0 border border-white shadow-md"
          style={{
            backgroundColor: color,
          }}
        />
      </div>

      <div>
        <div className="text-3xl font-extrabold mb-1" style={{ color }}>
          {value}
        </div>

        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
          {label}
        </div>

        {sub && <div className="text-xs text-slate-500 font-medium">{sub}</div>}
      </div>
    </div>
  );
}
