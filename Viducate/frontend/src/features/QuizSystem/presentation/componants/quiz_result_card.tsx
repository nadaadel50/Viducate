import { FormattedMessage } from "react-intl";

import { COLORS } from "../../../../core/constants";
import {
  FONT_SIZE,
  FONT_WEIGHT,
} from "../../../../core/constants/fonts_update";

import type { QuizSubmitResult } from "../../domain/entity/quiz_entity";

interface QuizResultCardProps {
  submitResult: QuizSubmitResult;
  onReview: () => void;
}

export function QuizResultCard({
  submitResult,
  onReview,
}: QuizResultCardProps) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/10 p-4 backdrop-blur-md animate-in fade-in duration-500">
      <div
        className="relative flex w-full max-w-md flex-col items-center rounded-3xl border bg-white p-6 shadow-[0_20px_60px_rgba(0,0,0,0.15)] animate-in zoom-in-95 duration-300 sm:p-8"
        style={{ borderColor: COLORS.border.default }}
      >
        <div
          className="mb-4 flex h-16 w-16 items-center justify-center rounded-full shadow-lg sm:h-20 sm:w-20"
          style={{ background: COLORS.brand.gradient }}
        >
          <span
            className="material-symbols-outlined text-white"
            style={{ fontSize: 34 }}
          >
            emoji_events
          </span>
        </div>

        <h2
          className={`${FONT_SIZE.size24} sm:${FONT_SIZE.size30} ${FONT_WEIGHT.extraBold} mb-2 text-center`}
          style={{ color: COLORS.text.primary }}
        >
          <FormattedMessage id="quiz.completed" />
        </h2>

        <p
          className={`${FONT_SIZE.size13} mb-6 text-center`}
          style={{ color: COLORS.text.secondary }}
        >
          <FormattedMessage id="quiz.result_msg" />
        </p>

        <div
          className="mb-8 w-full rounded-2xl p-5 text-center"
          style={{ backgroundColor: COLORS.icon.background }}
        >
          <div
            className={`${FONT_SIZE.size48} ${FONT_WEIGHT.extraBold} mb-1`}
            style={{ color: COLORS.brand.primary }}
          >
            {submitResult.score}%
          </div>

          <p
            className={`${FONT_SIZE.size13} ${FONT_WEIGHT.bold}`}
            style={{ color: COLORS.text.gray }}
          >
            <FormattedMessage
              id="quiz.score_msg"
              values={{
                score: submitResult.correctCount,
                total: submitResult.total,
              }}
            />
          </p>

          {submitResult.trials > 1 && (
            <p
              className={`${FONT_SIZE.size11} mt-2`}
              style={{ color: COLORS.text.secondary }}
            >
              <FormattedMessage
                id="quiz.attempts"
                values={{ count: submitResult.trials }}
              />
            </p>
          )}
        </div>

        <button
          onClick={onReview}
          className={`flex w-full items-center justify-center gap-2 rounded-xl border-2 py-3 transition-all hover:bg-slate-50 active:scale-95 ${FONT_SIZE.size14} ${FONT_WEIGHT.bold}`}
          style={{
            borderColor: COLORS.button.primary,
            color: COLORS.button.primary,
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
            visibility
          </span>

          <span className="whitespace-nowrap">
            <FormattedMessage id="quiz.review_answers" />
          </span>
        </button>
      </div>
    </div>
  );
}
