import { CheckCircle, AlertCircle } from "lucide-react";

interface TopicTagProps {
  label: string;
  variant: "strong" | "weak";
}

const VARIANT_STYLES = {
  strong: {
    style: {
      backgroundColor: "#fff",
      color: "#047857",
      border: "1px solid #a7f3d0",
    },
    icon: CheckCircle,
  },
  weak: {
    style: {
      backgroundColor: "#fff",
      color: "#be123c",
      border: "1px solid #fecdd3",
    },
    icon: AlertCircle,
  },
};

export function TopicTag({ label, variant }: TopicTagProps) {
  const { style, icon: Icon } = VARIANT_STYLES[variant];

  return (
    <span
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold shadow-sm"
      style={style}
    >
      <Icon size={14} strokeWidth={2.5} />
      {label}
    </span>
  );
}
