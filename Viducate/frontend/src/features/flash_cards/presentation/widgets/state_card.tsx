import clsx from "clsx";
import { FONT_STYLES } from "../../../../core/constants/fonts";

type StatProps = {
  title: string;
  value: number;
  color: "green" | "blue" | "yellow" | "red";
};

const colorClasses = {
  green: "bg-green-100 text-green-600",
  blue: "bg-blue-100 text-blue-600",
  yellow: "bg-yellow-100 text-yellow-600",
  red: "bg-red-100 text-red-600",
} as const;

export function StatCard({ title, value, color }: StatProps) {
  return (
    <div
      className={clsx(
        "rounded-xl p-2 text-center shadow sm:p-3",
        colorClasses[color],
      )}
    >
      <p className={clsx(FONT_STYLES.caption, "text-gray-600")}>{title}</p>

      <p className={clsx(FONT_STYLES.sectionTitle)}>{value}</p>
    </div>
  );
}
