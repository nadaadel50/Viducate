export function Badges({ activeDays }: { activeDays: number }) {
  const badges = [];

  if (activeDays >= 3) badges.push({ bg: "bg-indigo-50",  border: "border-indigo-200", text: "text-indigo-800", icon: "star",   label: "Consistent" });
  if (activeDays >= 5) badges.push({ bg: "bg-green-50",   border: "border-green-300",  text: "text-green-900", icon: "emoji_events", label: "On a roll" });
  if (activeDays === 7) badges.push({ bg: "bg-amber-50",  border: "border-amber-300",  text: "text-amber-900", icon: "crown",  label: "Perfect week" });

  if (badges.length === 0) return null;

  return (
    <div className="flex gap-2 flex-wrap mt-4">
      {badges.map((b) => (
        <div key={b.label} className={`flex items-center gap-1 ${b.bg} border ${b.border} ${b.text} rounded-full px-3 py-1 text-xs font-medium`}>
          <span className="material-symbols-outlined text-[13px]">{b.icon}</span>
          {b.label}
        </div>
      ))}
    </div>
  );
}