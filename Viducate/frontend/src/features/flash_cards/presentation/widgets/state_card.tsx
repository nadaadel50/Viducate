type StatProps = {
  title: string;
  value: number;
  color: "green" | "blue" | "yellow" | "red";
};

export function StatCard({ title, value, color }: StatProps) {
  const colorClasses = {
    green: "bg-green-100 text-green-600",
    blue: "bg-blue-100 text-blue-600",
    yellow: "bg-yellow-100 text-yellow-600",
    red: "bg-red-100 text-red-600",
  };

  return (
    <div className={`p-4 rounded-xl text-center shadow ${colorClasses[color]}`}>
      <p className="text-sm text-gray-600">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}