import { FormattedMessage } from "react-intl";
import { COLORS } from "../../../../core/constants";

interface QuizActionsProps {
  isLast: boolean;
  isFirst: boolean;
  isReviewMode: boolean;
  onNext: () => void;
  onPrevious: () => void;
  canSubmit: boolean;
  onNewQuiz: () => void;
}

export const QuizActions = ({
  isLast,
  isFirst,
  isReviewMode,
  onNext,
  onPrevious,
  canSubmit,
  onNewQuiz,
}: QuizActionsProps) => {
  const showNextBtn = true;
  const isDisabled =
    (!isReviewMode && isLast && !canSubmit) || (isReviewMode && isLast);

  return (
    <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col gap-3">
      <div className="flex justify-between items-center w-full gap-2">
        <button
          onClick={onPrevious}
          disabled={isFirst}
          className="w-12 h-12 flex items-center justify-center rounded-lg transition hover:bg-slate-50 disabled:opacity-30"
          style={{ color: COLORS.text.secondary }}
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>

        {showNextBtn && (
          <button
            onClick={onNext}
            disabled={isDisabled}
            className="flex-1 px-4 py-3 rounded-xl font-bold text-white transition flex items-center justify-center gap-2"
            style={{
              background:
                isLast && !isReviewMode
                  ? COLORS.state.success
                  : COLORS.brand.gradient,
              opacity: isDisabled ? 0.5 : 1,
              cursor: isDisabled ? "not-allowed" : "pointer",
            }}
          >
            <span className="whitespace-nowrap">
              <FormattedMessage
                id={isLast && !isReviewMode ? "quiz.submit" : "quiz.next"}
              />
            </span>
            <span className="material-symbols-outlined">
              {isLast && !isReviewMode ? "done" : "arrow_forward"}
            </span>
          </button>
        )}
      </div>

      {isReviewMode && (
        <button
          onClick={onNewQuiz}
          className="flex-1 py-3 rounded-xl font-bold transition flex items-center justify-center gap-2 border-2 hover:bg-slate-50"
          style={{
            borderColor: COLORS.brand.primary,
            color: COLORS.brand.primary,
          }}
        >
          <span className="material-symbols-outlined">autorenew</span>
          <FormattedMessage id="quiz.new_quiz" />
        </button>
      )}
    </div>
  );
};
