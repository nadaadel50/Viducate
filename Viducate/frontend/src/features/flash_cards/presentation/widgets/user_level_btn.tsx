import type { Difficulty } from "../../domain/entity/difficaulty";

const difficultyStyles = {
  easy: {
    border: "border-blue-200 hover:border-blue-300 dark:hover:border-blue-800",
    text: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-50 dark:bg-blue-900/10",
    hoverBg: "hover:bg-blue-100 dark:hover:bg-blue-900/20",
    iconBg: "bg-blue-100 dark:bg-blue-900/30",
    iconHoverBg: "group-hover:bg-blue-200 dark:group-hover:bg-blue-800/50",
    icon: "thumb_up",
    time: "1d",
  },

  good: {
    border: "border-green-200 hover:border-green-300",
    text: "text-green-600",
    bg: "bg-green-50",
    hoverBg: "hover:bg-green-100",
    iconBg: "bg-green-100",
    iconHoverBg: "group-hover:bg-green-200",
    icon: "check",
    time: "15min",
  },

  hard: {
    border: "border-yellow-200 hover:border-yellow-300",
    text: "text-yellow-600",
    bg: "bg-yellow-50",
    hoverBg: "hover:bg-yellow-100",
    iconBg: "bg-yellow-100",
    iconHoverBg: "group-hover:bg-yellow-200",
    icon: "thumb_down",
    time: "8min",
  },

  again: {
    border: "border-red-200 hover:border-red-300",
    text: "text-red-600",
    bg: "bg-red-50",
    hoverBg: "hover:bg-red-100",
    iconBg: "bg-red-100",
    iconHoverBg: "group-hover:bg-red-200",
    icon: "refresh",
    time: "1min",
  },
};


type UserLevelBtnProps = {
  diffStyle: Difficulty;
  onClick: () => void;
};
export function UserLevelBtn({
  diffStyle,
  onClick,
}: UserLevelBtnProps) {
  const style = difficultyStyles[diffStyle];

  return (
    <button
      onClick={onClick}
      className={`flex-1 flex flex-col items-center justify-center gap-2  rounded-xl border-2  cursor-pointer p-2
         ${style.border} ${style.bg} ${style.text} ${style.hoverBg} transition-all group`}
    >
      <div
        className={`p-1.5 flex items-center justify-center rounded-full ${style.iconBg} ${style.iconHoverBg}`}
      >
        <span className="material-symbols-outlined text-[20px]">
          {style.icon}
        </span>

      </div>

      <span className="font-bold text-sm">{diffStyle}</span>
      <span className=" text-xs">{style.time}</span>
    </button>
  );
}
