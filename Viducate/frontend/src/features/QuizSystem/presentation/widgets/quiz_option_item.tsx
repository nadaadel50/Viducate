import { COLORS } from "../../../../core/constants";
import { FONT_STYLES } from "../../../../core/constants/fonts";
import {
  FONT_SIZE,
  FONT_WEIGHT,
} from "../../../../core/constants/fonts_update";

type OptionState = {
  style: React.CSSProperties;
  isCorrect: boolean;
  isSelected: boolean;
  label: string;
};

interface QuizOptionItemProps {
  option: {
    id: string;
    text: string;
  };
  optionState: OptionState;
  isReviewMode: boolean;
  onSelect: (optionId: string) => void;
}

export function QuizOptionItem({
  option,
  optionState,
  isReviewMode,
  onSelect,
}: QuizOptionItemProps) {
  const { style, isCorrect, isSelected, label } = optionState;

  return (
    <label className="group cursor-pointer">
      <input
        type="radio"
        className="sr-only"
        checked={isSelected}
        onChange={() => onSelect(option.id)}
        disabled={isReviewMode}
      />

      <div
        className="flex items-center justify-between rounded-xl p-4 shadow-xs transition-all duration-200 hover:translate-x-1"
        style={style}
      >
        <div className="flex items-center gap-3">
          <div
            className="flex h-4 w-4 items-center justify-center rounded-full border-2"
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
              <div className="h-1.5 w-1.5 rounded-full bg-white" />
            )}
          </div>

          <span
            className={`${FONT_STYLES.quiz_item} ${FONT_WEIGHT.normal}`}
            style={{ color: COLORS.text.primary }}
          >
            {option.text}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {isReviewMode && isCorrect && (
            <span className="material-symbols-outlined text-lg text-green-600">
              check_circle
            </span>
          )}

          {isReviewMode && isSelected && !isCorrect && (
            <span className="material-symbols-outlined text-lg text-red-600">
              cancel
            </span>
          )}

          <span
            className={`${FONT_SIZE.size12} ${FONT_WEIGHT.bold} opacity-30`}
          >
            {label}
          </span>
        </div>
      </div>
    </label>
  );
}
