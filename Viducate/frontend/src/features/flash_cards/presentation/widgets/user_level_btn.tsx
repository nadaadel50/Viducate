const difficultyStyles = {
  easy: {
    border:
      "border-transparent hover:border-green-200 dark:hover:border-green-800",
    text: "text-green-600 dark:text-green-400",
    bg: "bg-green-50 dark:bg-green-900/10",
    hoverBg: "hover:bg-green-100 dark:hover:bg-green-900/20",
    iconBg: "bg-green-100 dark:bg-green-900/30",
    iconHoverBg: "group-hover:bg-green-200 dark:group-hover:bg-green-800/50",
    icon: "thumb_up",
  },

  good: {
    border: "border-transparent hover:border-blue-200",
    text: "text-blue-600",
    bg: "bg-blue-50",
    hoverBg: "hover:bg-blue-100 ",
    iconBg: "bg-blue-100 ",
    iconHoverBg: "group-hover:bg-blue-200",
    icon: "check",
  },

  hard: {
    border: "border-transparent hover:border-red-200",
    text: "text-red-600 ",
    bg: "bg-red-50 ",
    hoverBg: "hover:bg-red-100",
    iconBg: "bg-red-100 ",
    iconHoverBg: "group-hover:bg-red-200 ",
    icon: "thumb_down",
  },
};

const selectedBorder = {
  easy: "border-green-600",
  good: "border-blue-600",
  hard: "border-red-600",
};
type Difficulty = "easy" | "good" | "hard";
type UserLevelBtnProps = {
  diffStyle: Difficulty;
  isSelected: boolean;
  onClick: () => void;
};
export function UserLevelBtn({
  diffStyle,
  isSelected,
  onClick,
}: UserLevelBtnProps) {
  const style = difficultyStyles[diffStyle];

  return (
    <button
      onClick={onClick}
      className={`flex-1 flex flex-col items-center justify-center gap-2 h-20 rounded-xl border-2  cursor-pointer
         ${isSelected ? selectedBorder[diffStyle] : style.border} ${style.bg} ${style.text} ${style.hoverBg} transition-all group`}
    >
      <div
        className={`p-1.5 rounded-full ${style.iconBg} ${style.iconHoverBg}`}
      >
        <span className="material-symbols-outlined text-[20px]">
          {style.icon}
        </span>
      </div>

      <span className="font-bold text-sm">{diffStyle}</span>
    </button>
  );
}
