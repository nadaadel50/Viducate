const styles = {
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
} as const;
type Variant = "purple" | "orange" | "blue"| "teal";
export function TopicEndCard({
  variant = "purple",
  icon,
  title,
  description,
}: {
  variant?: Variant;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  const s = styles[variant];

  return (
    <button
      className={`${s.bg} cursor-pointer group flex flex-col items-start gap-4 rounded-xl border border-gray-100 p-6 transition-all duration-300 hover:shadow-md hover:-translate-y-1 hover:bg-white ${s.hoverBorder} text-left`}
    >
      <div
        className={`w-12 h-12 rounded-lg ${s.iconColor} ${s.iconBg} flex items-center justify-center transition-all duration-300 group-hover:text-white ${s.hoverIconBg}`}
      >
        {icon}
      </div>

      <div>
        <h2 className="text-[#111218] text-lg font-bold mb-1">{title}</h2>
        <p className="text-[#636988] text-sm">{description}</p>
      </div>
    </button>
  );
}
