import { FileQuestion, FileText, NotebookPen, Package } from "lucide-react";
import { FormattedMessage, useIntl } from "react-intl";
import { MaterialBadge } from "../componants/material_badge";
import type { VideoReport } from "../../domain/entity/report_entity";

interface LearningMaterialsProps {
  report: VideoReport;
}

export function LearningMaterials({ report }: LearningMaterialsProps) {
  const intl = useIntl();

  const materials = [
    {
      icon: FileText,
      color: "#2563eb",
      label: intl.formatMessage({
        id: "report.materials.summary",
      }),
      done: report.hasSummary,
    },
    {
      icon: NotebookPen,
      color: "#7c3aed",
      label: intl.formatMessage({
        id: "report.materials.studyNotes",
      }),
      done: report.hasStudyNotes,
    },
    {
      icon: FileQuestion,
      color: "#059669",
      label: intl.formatMessage({
        id: "report.materials.quiz",
      }),
      done: report.hasComprehensiveQuiz,
    },
  ];

  return (
    <div className="flex flex-col justify-center rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
      <div className="mb-5 flex items-center gap-2">
        <Package size={20} className="text-slate-500" />

        <span className="text-sm font-bold uppercase tracking-wider text-slate-500">
          <FormattedMessage id="report.materials.title" />
        </span>
      </div>

      <div className="flex-1 space-y-4">
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
    </div>
  );
}
