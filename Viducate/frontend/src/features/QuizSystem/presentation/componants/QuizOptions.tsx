
import { COLORS } from "../../../../core/constants";
import { useQuizOptions } from "../hooks/useQuizOptions.ts";
import { FormattedMessage } from 'react-intl';
export const QuizOptions = ({
  question,
  selectedId,
  onSelect,
  isReviewMode,
}: any) => {

  const { options, getOptionStyle } = useQuizOptions({
    question,
    selectedId,
    isReviewMode,
  });

  if (!question) return null;

  return (
    <div className="space-y-6">
      <div className="space-y-4 px-2">
        <h2
          className="text-2xl sm:text-3xl font-black leading-tight"
          style={{ color: COLORS.text.primary }}
        >
          {question.question_text}
        </h2>

        {isReviewMode && question.video_timestamp && (
          <button
            onClick={() =>
              console.log("Jumping to second:", question.video_timestamp)
            }
            className="flex items-center gap-2 px-4 py-2 rounded-xl transition-all hover:scale-105 active:scale-95 shadow-sm"
            style={{
              backgroundColor: COLORS.icon.background,
              color: COLORS.brand.primary,
            }}
          >
            <span className="material-symbols-outlined text-xl">
              play_circle
            </span>
            <span className="text-sm font-bold uppercase tracking-wide">
              <FormattedMessage id="quiz.go_to_watch" values={{ timestamp_label: question.timestamp_label }} />
            </span>
          </button>
        )}
      </div>

      <div className="flex flex-col gap-3">
        {options.map((option) => {
          const { style, isCorrect, isSelected, label } =
            getOptionStyle(option.id);

          return (
            <label key={option.id} className="cursor-pointer group">
              <input
                type="radio"
                className="sr-only"
                checked={isSelected}
                onChange={() => onSelect(option.id)}
                disabled={isReviewMode}
              />

              <div
                className="flex items-center justify-between p-5 rounded-2xl shadow-sm transition-all duration-200 hover:translate-x-1"
                style={style}
              >
                <div className="flex items-center gap-4">
                  <div
                    className="w-5 h-5 rounded-full border-2 flex items-center justify-center"
                    style={{
                      borderColor: isSelected
                        ? COLORS.brand.primary
                        : COLORS.border.default,
                      backgroundColor: isSelected
                        ? COLORS.brand.primary
                        : "transparent",
                    }}
                  >
                    {isSelected && (
                      <div className="w-2 h-2 bg-white rounded-full" />
                    )}
                  </div>

                  <span
                    className="text-base font-semibold"
                    style={{ color: COLORS.text.primary }}
                  >
                    {option.text}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {isReviewMode && isCorrect && (
                    <span className="material-symbols-outlined text-green-600">
                      check_circle
                    </span>
                  )}

                  {isReviewMode && isSelected && !isCorrect && (
                    <span className="material-symbols-outlined text-red-600">
                      cancel
                    </span>
                  )}

                  <span className="text-sm font-bold opacity-30">
                    {label}
                  </span>
                </div>
              </div>
            </label>
          );
        })}
      </div>
    </div>
  );
};