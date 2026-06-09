
export function Dot({ active, isToday, letter }: { active: boolean; isToday: boolean; letter: string }) {
  let className = "w-10 h-10 rounded-full flex items-center justify-center text-sm transition-transform hover:scale-110 ";

  if (isToday && active)        className += "bg-indigo-500 text-white ring-4 ring-indigo-200";
  else if (isToday && !active)  className += "bg-slate-100 text-slate-400 border-2 border-dashed border-indigo-300";
  else if (active)              className += "bg-indigo-500 text-white";
  else                          className += "bg-slate-100 text-slate-400";

  return (
    <div className={className}>
      {active
        ? <span className="material-symbols-outlined text-[15px]">check</span>
        : <span className="text-xs">{letter}</span>
      }
    </div>
  );
}