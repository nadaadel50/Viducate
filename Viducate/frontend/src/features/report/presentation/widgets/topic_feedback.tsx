import { AlertCircle, AlertTriangle, PartyPopper } from "lucide-react";
import { FormattedMessage } from "react-intl";
import {
  FONT_SIZE,
  FONT_WEIGHT,
  LETTER_SPACING,
} from "../../../../core/constants/fonts_update";
import type { TopicReport } from "../../domain/entity/report_entity";

interface TopicFeedbackProps {
  topic: TopicReport;
  hasQuiz: boolean;
}

export function TopicFeedback({ topic, hasQuiz }: TopicFeedbackProps) {
  if (!hasQuiz) return null;

  if (topic.weakAreas?.length) {
    return (
      <section
        className="mt-4 rounded-xl border p-4 shadow-sm"
        style={{
          backgroundColor: "#fff1f2",
          borderColor: "#fecdd3",
        }}
      >
        <div className="mb-3 flex items-center gap-2">
          <AlertTriangle size={18} className="text-rose-600" />

          <span
            className={`${FONT_SIZE.size11} ${FONT_WEIGHT.bold} ${LETTER_SPACING.wider} uppercase`}
            style={{ color: "#e11d48" }}
          >
            <FormattedMessage id="report.topic.needsMoreWork" />
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {topic.weakAreas.map((area) => (
            <span
              key={area}
              className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 ${FONT_SIZE.size11} ${FONT_WEIGHT.semibold}`}
              style={{
                backgroundColor: "#fff",
                color: "#be123c",
                borderColor: "#fecdd3",
              }}
            >
              <AlertCircle size={12} className="shrink-0 text-rose-500" />

              <span className="truncate">{area}</span>
            </span>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section
      className="mt-4 flex items-center gap-3 rounded-xl border p-4 shadow-sm"
      style={{
        backgroundColor: "#ecfdf5",
        borderColor: "#a7f3d0",
      }}
    >
      <PartyPopper size={20} className="shrink-0 text-emerald-600" />

      <span
        className={`${FONT_SIZE.size14} ${FONT_WEIGHT.bold}`}
        style={{ color: "#047857" }}
      >
        <FormattedMessage id="report.topic.mastered" />
      </span>
    </section>
  );
}
