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
type Variant = "purple" | "orange" | "blue"| "teal"| "green" | "red";
export function TopicEndCard({
  variant = "purple",
  icon,
  title,
  description,
  onClick,
}: {
  variant?: Variant;
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick?: () => void;
}) {
  const s = styles[variant];

  return (
    <button
      onClick={onClick}
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
