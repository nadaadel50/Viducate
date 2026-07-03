import { ChevronDown } from "lucide-react";
import { FormattedMessage } from "react-intl";
import {
  FONT_SIZE,
  FONT_WEIGHT,
  LETTER_SPACING,
} from "../../../../core/constants/fonts_update";
import type { TopicReport } from "../../domain/entity/report_entity";

interface TopicHeaderProps {
  topic: TopicReport;
  index: number;
  open: boolean;
  hasQuiz: boolean;
  scorePercent: number;
  scoreAnim: boolean;
  config: {
    label: string;
    color: string;
    bg: string;
    border: string;
    emoji: string;
  };
  onToggle: () => void;
}

export function TopicHeader({
  topic,
  index,
  open,
  hasQuiz,
  scorePercent,
  scoreAnim,
  config,
  onToggle,
}: TopicHeaderProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="flex w-full items-center gap-3 p-4 text-left transition-colors hover:bg-slate-50 sm:gap-4 sm:p-5"
    >
      {/* Topic Number */}

      <div
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border sm:h-10 sm:w-10"
        style={{
          backgroundColor: config.bg,
          color: config.color,
          borderColor: config.border,
        }}
      >
        <span className={`${FONT_SIZE.size13} ${FONT_WEIGHT.bold}`}>
          {index + 1}
        </span>
      </div>

      {/* Topic Info */}

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3
            className={`${FONT_SIZE.size16} ${FONT_WEIGHT.bold} truncate text-slate-800`}
          >
            {topic.title}
          </h3>

          <span
            className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 ${FONT_SIZE.size10} ${FONT_WEIGHT.bold} ${LETTER_SPACING.wide}`}
            style={{
              backgroundColor: config.bg,
              color: config.color,
              borderColor: config.border,
            }}
          >
            <span>{config.emoji}</span>

            {config.label}
          </span>
        </div>
      </div>

      {/* Right Side */}

      <div className="ml-auto flex shrink-0 items-center gap-3">
        {hasQuiz ? (
          <>
            <div className="hidden text-right sm:block">
              <div
                className={`${FONT_SIZE.size20} ${FONT_WEIGHT.extraBold}`}
                style={{
                  color: config.color,
                }}
              >
                {scorePercent}%
              </div>

              <div
                className={`${FONT_SIZE.size10} ${FONT_WEIGHT.semibold} ${LETTER_SPACING.wide} uppercase text-slate-500`}
              >
                <FormattedMessage id="report.topic.score" />
              </div>
            </div>

            <div className="hidden w-24 sm:block">
              <div className="mb-1 h-1.5 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: scoreAnim ? `${scorePercent}%` : "0%",
                    backgroundColor: config.color,
                    transition: "width 1.2s cubic-bezier(.4,0,.2,1)",
                  }}
                />
              </div>

              <div
                className={`${FONT_SIZE.size10} ${FONT_WEIGHT.medium} text-slate-400`}
              >
                <FormattedMessage
                  id="report.topic.attempts"
                  values={{
                    count: topic.quizAttempts,
                  }}
                />
              </div>
            </div>
          </>
        ) : (
          <span
            className={`hidden rounded-full border border-slate-200 bg-slate-100 px-3 py-1 ${FONT_SIZE.size11} ${FONT_WEIGHT.semibold} text-slate-600 sm:inline-flex`}
          >
            <FormattedMessage id="report.topic.takeQuiz" />
          </span>
        )}

        <ChevronDown
          size={18}
          className="transition-transform duration-300"
          style={{
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
          }}
        />
      </div>
    </button>
  );
}
