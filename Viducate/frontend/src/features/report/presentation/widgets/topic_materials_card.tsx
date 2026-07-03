import { Package } from "lucide-react";
import { FormattedMessage } from "react-intl";

import type { LucideIcon } from "lucide-react";
import {
  FONT_SIZE,
  FONT_WEIGHT,
  LETTER_SPACING,
} from "../../../../core/constants/fonts_update";
import { MaterialBadge } from "../componants/material_badge";

interface MaterialItem {
  icon: LucideIcon;
  color: string;
  label: string;
  done: boolean;
}

interface TopicMaterialsCardProps {
  materials: MaterialItem[];
}

export function TopicMaterialsCard({ materials }: TopicMaterialsCardProps) {
  return (
    <section className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm sm:p-5">
      <div className="mb-4 flex items-center gap-2">
        <Package size={18} className="text-slate-500" />

        <span
          className={`${FONT_SIZE.size11} ${FONT_WEIGHT.bold} ${LETTER_SPACING.wider} uppercase text-slate-500`}
        >
          <FormattedMessage id="report.topic.materialsPrepared" />
        </span>
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {materials.map((material) => (
          <MaterialBadge
            key={material.label}
            icon={material.icon}
            color={material.color}
            label={material.label}
            done={material.done}
          />
        ))}
      </div>
    </section>
  );
}
