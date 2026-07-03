import { FormattedMessage } from "react-intl";

import { COLORS } from "../../../../core/constants";
import {
  FONT_SIZE,
  FONT_WEIGHT,
} from "../../../../core/constants/fonts_update";

interface QuizActionsProps {
  isLast: boolean;
  isFirst: boolean;
  isReviewMode: boolean;
  onNext: () => void;
  onPrevious: () => void;
  canSubmit: boolean;
  onNewQuiz: () => void;
}

export function QuizActions({
  isLast,
  isFirst,
  isReviewMode,
  onNext,
  onPrevious,
  canSubmit,
  onNewQuiz,
}: QuizActionsProps) {
  const isNextDisabled =
    (!isReviewMode && isLast && !canSubmit) || (isReviewMode && isLast);

  return (
    <section className="flex flex-col gap-3 rounded-xl border border-slate-100 bg-white p-3 shadow-sm dark:bg-slate-800">
      <div className="flex items-center justify-between gap-2">
        <button
          onClick={onPrevious}
          disabled={isFirst}
          className="flex h-10 w-10 items-center justify-center rounded-lg transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-30"
          style={{ color: COLORS.text.secondary }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
            arrow_back
          </span>
        </button>

        <button
          onClick={onNext}
          disabled={isNextDisabled}
          className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-white transition ${FONT_SIZE.size14} ${FONT_WEIGHT.bold}`}
          style={{
            background:
              isLast && !isReviewMode
                ? COLORS.state.success
                : COLORS.brand.gradient,
            opacity: isNextDisabled ? 0.5 : 1,
            cursor: isNextDisabled ? "not-allowed" : "pointer",
          }}
        >
          <span className="whitespace-nowrap">
            <FormattedMessage
              id={isLast && !isReviewMode ? "quiz.submit" : "quiz.next"}
            />
          </span>

          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
            {isLast && !isReviewMode ? "done" : "arrow_forward"}
          </span>
        </button>
      </div>

      {isReviewMode && (
        <button
          onClick={onNewQuiz}
          className={`flex items-center justify-center gap-2 rounded-lg border-2 py-2.5 transition hover:bg-slate-50 ${FONT_SIZE.size14} ${FONT_WEIGHT.bold}`}
          style={{
            borderColor: COLORS.brand.primary,
            color: COLORS.brand.primary,
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
            autorenew
          </span>

          <FormattedMessage id="quiz.new_quiz" />
        </button>
      )}
    </section>
  );
}
