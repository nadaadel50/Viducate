import { Badges } from "./badge";
import { Dot } from "./dot";

type Day = {
  name: string;
  active: boolean;
  isToday: boolean;
};

type ActivityCardProps = {
  days: Day[];
  currentStreak: number;
};

const DAY_LETTERS = ["M", "T", "W", "T", "F", "S", "S"];



export function ActivityCard({ days, currentStreak }: ActivityCardProps) {
  const activeDays = days.filter((d) => d.active).length;

  return (
    <div className="w-full bg-white p-6 rounded-3xl border border-slate-100 shadow-soft flex flex-col">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-bold text-lg text-slate-900 flex items-center gap-3">
          <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
            <span className="material-symbols-outlined">calendar_month</span>
          </div>
          My activity
        </h3>

        <div className="flex items-center gap-1 bg-orange-50 border border-orange-200 text-orange-900 rounded-full px-3 py-1 text-xs font-medium">
          <span className="material-symbols-outlined text-[14px]">local_fire_department</span>
          {currentStreak}-day streak
        </div>
      </div>

      {/* Dots */}
      <p className="text-xs text-slate-400 mb-3">This week</p>
      <div className="grid grid-cols-7 gap-2">
        {days.map((d, i) => (
          <div key={d.name} className="flex flex-col items-center gap-1.5">
            <Dot active={d.active} isToday={d.isToday} letter={DAY_LETTERS[i]} />
            <span className={`text-[10px] ${d.isToday ? "text-indigo-500 font-medium" : "text-slate-400"}`}>
              {d.name}
            </span>
          </div>
        ))}
      </div>

      <Badges activeDays={activeDays} />
    </div>
  );
}