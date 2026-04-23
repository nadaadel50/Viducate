const styles = {
  quiz: {
    border: "border-[#6f8ab7]",
    text: "text-[#6f8ab7]",
    hoverBg: "hover:bg-[#6f8ab7]/5",
  },
  summary: {
    border: "border-[#97bba3]",
    text: "text-[#97bba3]",
    hoverBg: "hover:bg-[#97bba3]/5",
  },
  flashcards: {
    border: "border-[#bfa2db]",
    text: "text-[#bfa2db]",
    hoverBg: "hover:bg-[#bfa2db]/5",
  },
  mindmap: {
    border: "border-[#e5989b]",
    text: "text-[#e5989b]",
    hoverBg: "hover:bg-[#e5989b]/5",
  },
} as const;

type Variant = "quiz" | "summary" | "flashcards" | "mindmap";

export function FinalGeneratedBtn({
  icon,
  label,
  onClick,
  variant,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  variant: Variant;
}) {
  const s = styles[variant];

  return (
    <button
      onClick={onClick}
      className={`cursor-pointer w-full group flex items-center justify-center gap-2 rounded-xl border ${s.border} ${s.text} bg-white py-3 px-4 text-sm font-semibold transition-all duration-200 ${s.hoverBg} hover:shadow hover:-translate-y-[1px] active:scale-[0.98]`}
    >
      <span className="transition-transform group-hover:scale-110">
        {icon}
      </span>

      <span className="tracking-tight">
        {label}
      </span>
    </button>
  );
}