import { FormattedMessage } from "react-intl";
import {
  FONT_SIZE,
  FONT_WEIGHT,
  LETTER_SPACING,
} from "../../../../core/constants/fonts_update";
import type { TopicReport } from "../../domain/entity/report_entity";

interface TopicQuizCardProps {
  topic: TopicReport;
  hasQuiz: boolean;
  scorePercent: number;
  config: {
    color: string;
  };
}

export function TopicQuizCard({
  topic,
  hasQuiz,
  scorePercent,
  config,
}: TopicQuizCardProps) {
  if (!hasQuiz) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-slate-100 bg-white p-5 text-center shadow-sm sm:p-6">
        <div className="mb-2 text-3xl">📝</div>

        <h4
          className={`${FONT_SIZE.size16} ${FONT_WEIGHT.bold} text-slate-800`}
        >
          <FormattedMessage id="report.topic.finishedWatching" />
        </h4>

        <p className={`mt-2 max-w-[220px] ${FONT_SIZE.size12} text-slate-500`}>
          <FormattedMessage id="report.topic.quizReminder" />
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm sm:p-5">
      <div className="mb-3 flex items-center gap-2">
        <span className="text-lg">🎯</span>

        <span
          className={`${FONT_SIZE.size11} ${FONT_WEIGHT.bold} ${LETTER_SPACING.wider} uppercase text-slate-500`}
        >
          <FormattedMessage id="report.topic.quizResults" />
        </span>
      </div>

      <div
        className={`${FONT_SIZE.size30} ${FONT_WEIGHT.extraBold} mb-1`}
        style={{
          color: config.color,
        }}
      >
        {scorePercent}%
      </div>

      <div
        className={`${FONT_SIZE.size12} ${FONT_WEIGHT.medium} space-y-1 text-slate-500`}
      >
        <div>
          <FormattedMessage
            id="report.topic.correctAnswers"
            values={{
              score: topic.correctAnswers,
              total: topic.quizTotal,
            }}
          />
        </div>

        <div>
          <FormattedMessage
            id="report.topic.attempts"
            values={{
              count: topic.quizAttempts,
            }}
          />
        </div>
      </div>

      <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full"
          style={{
            width: `${scorePercent}%`,
            backgroundColor: config.color,
            transition: "width .8s ease",
          }}
        />
      </div>
    </div>
  );
}
