import { AlertCircle, CheckCircle } from "lucide-react";

import {
  FONT_SIZE,
  FONT_WEIGHT,
} from "../../../../core/constants/fonts_update";

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
} as const;

export function TopicTag({ label, variant }: TopicTagProps) {
  const { style, icon: Icon } = VARIANT_STYLES[variant];

  return (
    <span
      className={`inline-flex max-w-full items-center gap-1.5 rounded-lg border px-2.5 py-1 shadow-sm ${FONT_SIZE.size11} ${FONT_WEIGHT.semibold}`}
      style={style}
    >
      <Icon size={13} strokeWidth={2.3} className="shrink-0" />

      <span className="truncate">{label}</span>
    </span>
  );
}
